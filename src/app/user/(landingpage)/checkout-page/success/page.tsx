"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { gql, useMutation, useQuery } from "@apollo/client";
import { cartItemsVar } from "@/shared/lib/apolloClient"; 
import Cookies from "js-cookie";


const VERIFY_PAYSTACK_PAYMENT = gql`
  mutation VerifyPaystackPayment($reference: String!) {
    verifyPaystackPayment(reference: $reference) {
      id
      paymentStatus
      status
      totalAmount
      shippingFee
      shippingAddress {
        street
        city
        state
        postalCode
        country
      }
      items {
        quantity
        lineTotal
        product {
          id
          name
          price
          images
        }
      }
    }
  }
`;

const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      paymentStatus
      status
      totalAmount
      shippingFee
      shippingAddress {
        street
        city
        state
        postalCode
        country
      }
      items {
        quantity
        lineTotal
        product {
          id
          name
          price
          images
        }
      }
    }
  }
`;


export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const qsRef = searchParams.get("reference");
  const qsOrderId = searchParams.get("orderId");
  

  


  // track the order we should display (set after verify or via query)
  const [activeOrderId, setActiveOrderId] = useState<string | null>(
    qsOrderId
  );
  const [statusMsg, setStatusMsg] = useState<string>("Finalizing your order...");
  const [verifyTried, setVerifyTried] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // verify mutation
  const [verifyPaystack, { loading: verifying }] = useMutation(
    VERIFY_PAYSTACK_PAYMENT,
    {
      onError: (err) => {
        setVerifyError(err.message);
        setStatusMsg("Payment verification failed.");
      },
      onCompleted: (data) => {
        const o = data?.verifyPaystackPayment;
        if (o?.id) {
          setActiveOrderId(o.id);
          setStatusMsg("Payment verified! Order confirmed.");
          // safe cart clear
          cartItemsVar([]);
        } else {
          setVerifyError("Verification returned no order.");
        }
      },
    }
  );

  // order query (runs when we know activeOrderId)
  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
    refetch: refetchOrder,
  } = useQuery(GET_ORDER, {
    variables: { id: activeOrderId },
    skip: !activeOrderId,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (activeOrderId) {
      const interval = setInterval(() => {
        refetchOrder();
      }, 60000); 
  
      return () => clearInterval(interval);
    }
  }, [activeOrderId, refetchOrder]);
  

  // auto‑verify if reference present
  useEffect(() => {
    if (qsRef && !verifyTried) {
      setVerifyTried(true);
      setStatusMsg("Verifying payment...");
      verifyPaystack({ variables: { reference: qsRef } });
    } else if (!qsRef && qsOrderId) {
      // POD flow or no reference returned
      setStatusMsg("Order placed successfully.");
      // ensure we load order
      refetchOrder();
      cartItemsVar([]); // safe: clear after order placed
    } else if (!qsRef && !qsOrderId) {
      setStatusMsg("No order information found.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qsRef, qsOrderId]);

  // manual verify retry
  const handleManualVerify = useCallback(
    (ref: string) => {
      if (!ref) return;
      setVerifyError(null);
      setStatusMsg("Verifying payment...");
      verifyPaystack({ variables: { reference: ref } });
    },
    [verifyPaystack]
  );

  // get order object (from verify or query)
  const order =
    (verifyPaystack as any)?.data?.verifyPaystackPayment || orderData?.order;

  /* ---------------------------------- Render ---------------------------------- */

  const loading = verifying || orderLoading;
  const errorMsg = verifyError || orderError?.message || null;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-center text-3xl font-extrabold text-[#1e63ff]">
        🎉 Order Confirmed!
      </h1>
  
      {loading && <p className="text-center text-gray-600">Loading...</p>}
  
      {!loading && (
        <>
          <p className="mb-6 text-center text-base text-gray-700">{statusMsg}</p>
  
          {errorMsg && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 text-sm text-red-800 shadow">
              <p className="mb-2 font-semibold">Something went wrong:</p>
              <p>{errorMsg}</p>
              <ManualVerify onVerify={handleManualVerify} />
            </div>
          )}
  
          {order ? (
            <OrderSummaryCard order={order} />
          ) : !errorMsg ? (
            <p className="text-center text-gray-500">No order to display.</p>
          ) : null}
        </>
      )}
    </div>
  );  
}

/* ---------------------------------- Order Summary Card ---------------------------------- */
function OrderSummaryCard({ order }: { order: any }) {
  const {
    id,
    paymentStatus,
    status,
    totalAmount,
    shippingFee,
    shippingAddress,
    items,
  } = order;

  return (
    <div className="rounded-xl bg-blue-50 p-6 shadow-lg">
      <p className="mb-2 text-sm text-gray-800">
        <span className="font-semibold">Order ID:</span> {id}
      </p>
      <p className="mb-2 text-sm text-gray-800">
        <span className="font-semibold">Order Status:</span>{" "}
        <span className="text-blue-600 font-medium">{status}</span>
      </p>
      <p className="mb-4 text-sm text-gray-800">
        <span className="font-semibold">Payment Status:</span>{" "}
        <span className="text-blue-600 font-medium">{paymentStatus}</span>
      </p>

      <h3 className="mb-2 text-lg font-semibold text-[#1e63ff]">Shipping Address</h3>
      <div className="mb-4 text-sm text-gray-700">
        <p>{shippingAddress?.street}</p>
        <p>
          {shippingAddress?.city}, {shippingAddress?.state}{" "}
          {shippingAddress?.postalCode}
        </p>
        <p>{shippingAddress?.country}</p>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-[#1e63ff]">Item(s)</h3>
      <ul className="mb-4 space-y-3">
        {items?.map((it: any, i: number) => (
          <li
            key={i}
            className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm text-gray-500"
          >
            <span>
              {it.product?.name} × {it.quantity}
            </span>
            <span className="font-medium text-gray-600">
              ₦{it.lineTotal?.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-1 border-t border-gray-300 pt-3 text-sm">
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₦{shippingFee?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-semibold text-[#1e63ff]">
          <span>Total</span>
          <span>₦{totalAmount?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- Manual Verify ---------------------------------- */
function ManualVerify({ onVerify }: { onVerify: (ref: string) => void }) {
  const [ref, setRef] = useState("");
  return (
    <div className="mt-4 flex flex-col items-center gap-2 text-sm">
      <input
        type="text"
        value={ref}
        onChange={(e) => setRef(e.target.value)}
        placeholder="Enter Paystack reference"
        className="w-full rounded border p-2"
      />
      <button
        type="button"
        onClick={() => ref.trim() && onVerify(ref.trim())}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Retry Verification
      </button>
    </div>
  );
}
