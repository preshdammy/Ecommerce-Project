"use client";

import { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";

const VERIFY_PAYSTACK_PAYMENT = gql`
  mutation VerifyPaystackPayment($reference: String!) {
    verifyPaystackPayment(reference: $reference) {
      id
      paymentStatus
      status
    }
  }
`;

export default function VerifyPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [verifyPayment, { loading, error }] = useMutation(VERIFY_PAYSTACK_PAYMENT);

  useEffect(() => {
    if (!reference) return;
    (async () => {
      try {
        const { data } = await verifyPayment({ variables: { reference } });
        const orderId = data?.verifyPaystackPayment?.id;
        if (orderId) {
          router.replace(`/user/checkout-page/success?orderId=${orderId}`);
        } else {
          router.replace(`/user/checkout-page?verifyError=OrderNotFound`);
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        router.replace(`/user/checkout-page?verifyError=VerificationFailed`);
      }
    })();
  }, [reference, verifyPayment, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg font-semibold">
        {loading ? "Verifying your payment..." : error ? "Verification failed." : "Redirecting..."}
      </p>
    </div>
  );
}
