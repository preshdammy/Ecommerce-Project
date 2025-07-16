"use client"

import React, { useState } from "react";
import { CheckCircle, CreditCard, ShieldCheck, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type PaymentOption = {
  label: string;
  icon: React.ReactNode;
  description?: string;
  selected?: boolean;
};

const paymentOptions: {
  group: string;
  options: PaymentOption[];
}[] = [
  {
    group: "Payment on delivery",
    options: [
      {
        label: "Go Cashless: Pay on Delivery via bank transfer",
        description:
          "You can pay via bank transfer through JumiaPay at the time of delivery; simply inform our delivery agent when your order is being delivered.",
        selected: true,
        icon: <CreditCard className="text-orange-500 w-5 h-5" />,
      },
    ],
  },
  {
    group: "Pre-pay Now",
    options: [
      {
        label: "Pay with Cards, Bank Transfer or USSD",
        description: "You will be redirected to our secure checkout page.",
        icon: <ShieldCheck className="text-blue-600 w-5 h-5" />,
      },
      {
        label: "PalmPay",
        description: "To use this option, you must be registered with PalmPay",
        icon: <img src="https://seeklogo.com/images/P/palmpay-logo-BDF922E40C-seeklogo.com.png" alt="palmpay" className="w-5 h-5" />,
      },
      {
        label: "Opay",
        description: "To use this option, you must be registered with Opay",
        icon: <img src="https://seeklogo.com/images/O/opay-logo-4916851E75-seeklogo.com.png" alt="opay" className="w-5 h-5" />,
      },
      {
        label: "Buy Now, Pay Later - EasyBuy",
        description: "To use this option, you must be registered with Easybuy",
        icon: <img src="https://seeklogo.com/images/E/easybuy-logo-08DE562979-seeklogo.com.png" alt="easybuy" className="w-5 h-5" />,
      },
    ],
  },
  {
    group: "Installment",
    options: [
      {
        label: "Standard Chartered Credit Card @ 3% Interest - Up to 12 months",
        icon: <ShieldCheck className="text-blue-600 w-5 h-5" />,
      },
    ],
  },
];

export default function PaymentMethodPage() {
  const [selected, setSelected] = useState("Go Cashless: Pay on Delivery via bank transfer");

  return (
    <>
      <div className="flex items-center gap-2 mb-4 text-blue-600">
        <Link href="/user/account-settings" className="flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-base font-medium">Back</span>
        </Link>
      </div>

      
    <div className="max-w-2xl mx-auto p-4">
      
      <h2 className="text-2xl font-semibold mb-6">Payment Methods</h2>

      {paymentOptions.map((section) => (
        <div key={section.group} className="mb-6">
          <h4 className="font-medium mb-3">{section.group}</h4>

          {section.options.map((opt) => (
            <label
              key={opt.label}
              className="flex items-start gap-2 border rounded-md p-4 mb-3 cursor-pointer hover:border-gray-400"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={opt.label}
                checked={selected === opt.label}
                onChange={() => setSelected(opt.label)}
                className="mt-1"
              />

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm leading-snug">{opt.label}</p>
                  {opt.icon && <span>{opt.icon}</span>}
                </div>
                {opt.description && (
                  <p className="text-xs text-gray-600 mt-1">{opt.description}</p>
                )}
              </div>
            </label>
          ))}
        </div>
      ))}

      <button className="flex items-center gap-2 text-white bg-orange-500 px-6 py-2 rounded font-semibold ml-auto">
        Confirm payment method <ArrowRight className="w-4 h-4" />
      </button>
    </div>
    </>
  );
}
