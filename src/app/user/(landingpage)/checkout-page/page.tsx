"use client";

import React, { useState, useMemo, FormEvent } from "react";
import { gql, useMutation } from "@apollo/client";
import { useReactiveVar } from "@apollo/client";
import { useRouter } from "next/navigation";
import { cartItemsVar } from "@/shared/lib/apolloClient"; 
import { toast } from "react-toastify";


const brandBlue = "#1E63FF";
const brandBlueLight = "#E8EFFF";
const accentCoral = "#FF5A3D";
const accentCoralHover = "#FF3E1C";
const accentCoralLight = "#FFE5DF";
const neutralBg = "#F9FAFD";
const textDark = "#1A1A1A";


export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $items: [OrderItemInput!]!
    $shippingAddress: ShippingAddressInput!
    $paymentMethod: PaymentMethod!
  ) {
    createOrder(
      items: $items
      shippingAddress: $shippingAddress
      paymentMethod: $paymentMethod
    ) {
      id
      totalAmount
      shippingFee
      paymentStatus
      status
      items {
        product {
          id
          name
          price
          images
        }
        quantity
        lineTotal
      }
    }
  }
`;

export const INITIATE_PAYSTACK_PAYMENT = gql`
  mutation InitiatePaystackPayment($orderId: ID!) {
    initiatePaystackPayment(orderId: $orderId) {
      authorizationUrl
      reference
    }
  }
`;

export const VERIFY_PAYSTACK_PAYMENT = gql`
  mutation VerifyPaystackPayment($reference: String!) {
    verifyPaystackPayment(reference: $reference) {
      id
      paymentStatus
      status
    }
  }
`;


const SHIPPING_RATE_BY_STATE_NGN: Record<string, number> = {
  Lagos: 1500,
  "Abuja (FCT)": 2500,
  Oyo: 2000,
  Kano: 2800,
  Default: 3000,
};
function calcShippingFee(state: string): number {
  return SHIPPING_RATE_BY_STATE_NGN[state] ?? SHIPPING_RATE_BY_STATE_NGN.Default;
}


const PAYSTACK_METHODS = [
  { value: "PAYSTACK_CARD", label: "Card" },
  { value: "PAYSTACK_TRANSFER", label: "Bank Transfer" },
  { value: "PAYSTACK_USSD", label: "USSD" },
  { value: "PAYSTACK_MOBILE_MONEY", label: "Mobile Money" },
  { value: "PAYSTACK_QR", label: "QR" },
] as const;

type PayMethod =
  | "POD"
  | "PAYSTACK_CARD"
  | "PAYSTACK_TRANSFER"
  | "PAYSTACK_USSD"
  | "PAYSTACK_MOBILE_MONEY"
  | "PAYSTACK_QR";


const steps = ["Details", "Confirm", "Done"];


export default function CheckoutPage() {
  const router = useRouter();

  /* ----- Cart ----- */
  const cartItems = useReactiveVar(cartItemsVar);
  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum: number, item: any) => sum + item.price * (item.quantity || 1),
        0
      ),
    [cartItems]
  );

  /* ----- Customer + Shipping form ----- */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("Lagos");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Nigeria");

  const shippingFee = useMemo(() => calcShippingFee(stateVal), [stateVal]);
  const grandTotal = useMemo(
    () => cartSubtotal + shippingFee,
    [cartSubtotal, shippingFee]
  );

  /* ----- Payment selection ----- */
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("POD");
  const [showMorePaystack, setShowMorePaystack] = useState(false);

  /* ----- Step state ----- */
  const [currentStep, setCurrentStep] = useState(0);
  const [formTouched, setFormTouched] = useState(false);

  /* ----- Mutations ----- */
  const [createOrder, { loading: creatingOrder }] = useMutation(CREATE_ORDER);
  const [initiatePaystackPayment, { loading: initiatingPaystack }] =
    useMutation(INITIATE_PAYSTACK_PAYMENT);

  
  const formValid =
    fullName.trim() &&
    email.trim() &&
    street.trim() &&
    city.trim() &&
    stateVal.trim() &&
    postalCode.trim() &&
    country.trim() &&
    cartItems.length > 0;

  function goConfirm() {
    setFormTouched(true);
    if (!formValid) return;
    setCurrentStep(1);
  }

  
  async function handlePlaceOrder(e?: FormEvent) {
    e?.preventDefault();
    if (!formValid) {
      setFormTouched(true);
      return;
    }
    try {
      const { data } = await createOrder({
        variables: {
          items: cartItems.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity || 1,
          })),
          shippingAddress: {
            street,
            city,
            state: stateVal,
            postalCode,
            country,
          },
            // NOTE: fullName/email/phone are NOT in ShippingAddressInput.
            // If you want to persist them, add fields in schema or attach to user profile separately.
          paymentMethod,
        },
      });

      const orderId = data?.createOrder?.id;
      if (!orderId) throw new Error("Order creation failed: missing id.");

      if (paymentMethod === "POD") {
        cartItemsVar([]);
        router.push(`/user/checkout-page/success?orderId=${orderId}`);
        return;
      }

      const res = await initiatePaystackPayment({ variables: { orderId } });
      const { authorizationUrl } = res.data.initiatePaystackPayment;
      window.location.href = authorizationUrl;
    } catch (err: any) {
      console.error("Order creation failed:", err);
      toast.error(err?.message || "Order failed. Try again.");
    }
  }

  
  const renderDetailsStep = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        goConfirm();
      }}
      className="space-y-10"
    >
      {/* Contact Information */}
      <SectionCard title="Contact Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            required
            touched={formTouched}
          />
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            touched={formTouched}
          />
          <FormField
            label="Phone"
            type="tel"
            value={phone}
            onChange={setPhone}
            className="sm:col-span-2"
          />
        </div>
      </SectionCard>

      {/* Shipping Address */}
      <SectionCard title="Shipping Address">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Street Address"
            value={street}
            onChange={setStreet}
            required
            touched={formTouched}
            className="sm:col-span-2"
          />
          <FormField
            label="City"
            value={city}
            onChange={setCity}
            required
            touched={formTouched}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              State
            </label>
            <select
              className={inputClass()}
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value)}
            >
              {Object.keys(SHIPPING_RATE_BY_STATE_NGN).map((s) => (
                <option key={s} value={s}>
                  {s} (+₦{SHIPPING_RATE_BY_STATE_NGN[s].toLocaleString()})
                </option>
              ))}
            </select>
          </div>
          <FormField
            label="Postal Code"
            value={postalCode}
            onChange={setPostalCode}
            required
            touched={formTouched}
          />
          <FormField
            label="Country"
            value={country}
            onChange={setCountry}
            required
            touched={formTouched}
          />
        </div>
      </SectionCard>

      {/* Delivery & Payment */}
      <SectionCard title="Delivery & Payment">
        <p className="mb-4 text-sm text-gray-600">
          Default is <strong>Pay on Delivery</strong>. Prefer to pay now? Choose a Paystack
          option.
        </p>
        <div className="space-y-3">
          {/* POD */}
          <label
            className={`flex cursor-pointer items-center gap-3 rounded border p-3 text-sm transition ${
              paymentMethod === "POD"
                ? "border-transparent bg-white shadow ring-2 ring-offset-2"
                : "border-gray-300 bg-gray-50"
            }`}
            style={
              paymentMethod === "POD"
                ? undefined
                : undefined
            }
          >
            <input
              type="radio"
              value="POD"
              checked={paymentMethod === "POD"}
              onChange={() => setPaymentMethod("POD")}
            />
            <span>Pay on Delivery</span>
          </label>

          {/* Toggle more */}
          <button
            type="button"
            className="text-xs font-medium underline"
            style={{ color: brandBlue }}
            onClick={() => setShowMorePaystack((s) => !s)}
          >
            {showMorePaystack ? "Hide online payment options" : "Choose online payment"}
          </button>

          {showMorePaystack && (
            <div className="ml-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PAYSTACK_METHODS.map((m) => (
                <label
                key={m.value}
                className={`flex cursor-pointer items-center gap-2 rounded border p-2 text-sm transition ${
                  paymentMethod === m.value
                    ? "border-transparent bg-white shadow ring-2 ring-offset-2 ring-brandBlue ring-offset-brandBlueLight"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  value={m.value}
                  checked={paymentMethod === m.value}
                  onChange={() => setPaymentMethod(m.value as PayMethod)}
                />
                <span>{m.label}</span>
              </label>
              
              ))}
            </div>
          )}
        </div>
      </SectionCard>

      {/* Continue */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!formValid}
          className="w-full rounded px-6 py-3 text-white disabled:opacity-40 sm:w-auto"
          style={{ background: brandBlue }}
        >
          Continue to Confirm
        </button>
      </div>
    </form>
  );

  const renderConfirmStep = () => (
    <div className="space-y-8">
      <SectionHeader title="Review & Confirm" />

      {/* Address Summary */}
      <SectionCard>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          Shipping To
        </h3>
        <div className="space-y-1 text-sm text-gray-700">
          <p>{fullName || "(No name)"}</p>
          <p>{email}</p>
          {phone && <p>{phone}</p>}
          <p>
            {street}, {city}, {stateVal}, {postalCode}, {country}
          </p>
        </div>
      </SectionCard>

      {/* Payment Summary */}
      <SectionCard>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Payment</h3>
        <p className="text-sm text-gray-700">
          {paymentMethod === "POD"
            ? "Pay on Delivery"
            : `Paystack ${
                PAYSTACK_METHODS.find((m) => m.value === paymentMethod)?.label ||
                "Online"
              }`}
        </p>
      </SectionCard>

      {/* Totals */}
      <SectionCard compact>
        <Totals
          subtotal={cartSubtotal}
          shipping={shippingFee}
          total={grandTotal}
          accent={accentCoral}
        />
      </SectionCard>

      <button
        onClick={handlePlaceOrder}
        disabled={creatingOrder || initiatingPaystack}
        className="w-full rounded px-6 py-3 text-white disabled:opacity-40 sm:w-auto"
        style={{
          background: paymentMethod === "POD" ? accentCoral : brandBlue,
        }}
      >
        {paymentMethod === "POD" ? "Confirm Order" : "Pay Now"}
      </button>
    </div>
  );

  const renderDoneStep = () => (
    <div className="py-12 text-center">
      <h2
        className="text-2xl font-semibold"
        style={{ color: textDark }}
      >
        Redirecting…
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        If nothing happens, please check your connection.
      </p>
    </div>
  );

  /* -----------------------------------------------------------------------------
   * Main Layout
   * -------------------------------------------------------------------------- */
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: neutralBg }}
    >
      <div className="mx-auto w-full max-w-6xl p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
        <StepBar steps={steps} currentStep={currentStep} />

        <div className="grid items-start gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-2 rounded bg-white p-4 shadow sm:p-6">
            {currentStep === 0 && renderDetailsStep()}
            {currentStep === 1 && renderConfirmStep()}
            {currentStep === 2 && renderDoneStep()}
          </div>

          {/* Right Summary */}
          <aside className="sticky top-4 max-h-[80vh] overflow-auto rounded bg-white p-4 shadow sm:p-6">
            <h3 className="mb-4 text-lg font-semibold" style={{ color: textDark }}>
              Order Summary
            </h3>
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className="mb-6 space-y-4">
                {cartItems.map((item: any) => (
                  <li
                    key={item.id}
                    className="flex gap-3 border-b pb-3 last:border-b-0"
                  >
                  {item.product?.images?.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-16 w-16 rounded object-cover"
                        />
                    ) : (
                      <div className="h-16 w-16 rounded bg-gray-200" />
                    )}
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-500">
                        ₦{item.price.toLocaleString()} × {item.quantity || 1}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      ₦{(item.price * (item.quantity || 1)).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Totals
              subtotal={cartSubtotal}
              shipping={shippingFee}
              total={grandTotal}
              accent={accentCoral}
            />
          </aside>
        </div>

        {/* Mobile bottom nav */}
        <div className="mt-6 flex justify-between lg:hidden">
          {currentStep > 0 && currentStep < 2 && (
            <button
              className="rounded border px-4 py-2 text-sm"
              onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
              style={{ borderColor: brandBlue, color: brandBlue }}
            >
              Back
            </button>
          )}
          {currentStep === 0 && (
            <button
              className="ml-auto rounded px-4 py-2 text-sm text-white disabled:opacity-40"
              disabled={!formValid}
              onClick={goConfirm}
              style={{ background: brandBlue }}
            >
              Next
            </button>
          )}
          {currentStep === 1 && (
            <button
              className="ml-auto rounded px-4 py-2 text-sm text-white disabled:opacity-40"
              disabled={creatingOrder || initiatingPaystack}
              onClick={handlePlaceOrder}
              style={{
                background: paymentMethod === "POD" ? accentCoral : brandBlue,
              }}
            >
              {paymentMethod === "POD" ? "Confirm" : "Pay Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


function inputClass() {
  return [
    "w-full rounded border p-2 text-sm",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
  ].join(" ");
}

/** Simple text input wrapper */
function FormField({
  label,
  value,
  onChange,
  required,
  touched,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  touched?: boolean;
  type?: string;
  className?: string;
}) {
  const showError = required && touched && !value.trim();
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        className={inputClass()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {showError && (
        <p className="mt-1 text-xs text-red-500">Required.</p>
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
  compact,
}: {
  title?: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded border bg-white shadow-sm ${
        compact ? "p-4" : "p-6"
      }`}
      style={{ borderColor: brandBlueLight }}
    >
      {title ? (
        <SectionHeader title={title} className="mb-4" />
      ) : null}
      {children}
    </div>
  );
}

/** Section header line */
function SectionHeader({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className="block h-4 w-1 rounded-full"
        style={{ background: brandBlue }}
      />
      <h2
        className="text-base font-semibold leading-none"
        style={{ color: textDark }}
      >
        {title}
      </h2>
    </div>
  );
}


function Totals({
  subtotal,
  shipping,
  total,
  accent,
}: {
  subtotal: number;
  shipping: number;
  total: number;
  accent: string;
}) {
  return (
    <div className="space-y-1 text-sm">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>₦{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span>₦{shipping.toLocaleString()}</span>
      </div>
      <div className="mt-2 border-t pt-2 font-semibold">
        <div className="flex justify-between">
          <span>Total</span>
          <span style={{ color: accent }}>
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}


function StepBar({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  const pct =
    currentStep === 0
      ? 0
      : currentStep === steps.length - 1
      ? 100
      : (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="relative mb-8 flex items-center justify-between">
     
      <div
        className="absolute left-0 right-0 top-1/2 z-0 h-2 -translate-y-1/2 transform rounded-full"
        style={{ background: brandBlueLight }}
      />
      
      <div
        className="absolute left-0 top-1/2 z-0 h-2 -translate-y-1/2 transform rounded-full transition-[width] duration-300 ease-in-out"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${brandBlue} 0%, #4C8DFF 100%)`,
        }}
      />
      
      {steps.map((label, index) => {
        const active = index <= currentStep;
        return (
          <div
            key={label}
            className="relative z-10 flex flex-col items-center gap-1"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                active
                  ? "text-white"
                  : "text-gray-600 bg-white border"
              }`}
              style={{
                background: active ? brandBlue : undefined,
                borderColor: active ? brandBlue : brandBlueLight,
              }}
            >
              {index + 1}
            </div>
            <span
              className="hidden text-[10px] font-medium sm:block sm:text-xs"
              style={{ color: active ? brandBlue : "#6B7280" }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
