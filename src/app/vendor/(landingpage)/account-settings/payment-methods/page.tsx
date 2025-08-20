
"use client";

import React, { useState } from "react";
import { CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { ArrowRight } from "lucide-react";
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
    group: "Payment on Delivery",
    options: [
      {
        label: "Go Cashless: Pay on Delivery via Bank Transfer",
        description:
          "Pay via bank transfer through JumiaPay at the time of delivery; inform our delivery agent when your order arrives.",
        selected: true,
        icon: <CreditCard className="text-orange-500 w-6 h-6" />,
      },
    ],
  },
  {
    group: "Pre-pay Now",
    options: [
      {
        label: "Pay with Cards, Bank Transfer, or USSD",
        description: "Redirected to our secure checkout page.",
        icon: <ShieldCheck className="text-blue-600 w-6 h-6" />,
      },
    ],
  },
  {
    group: "Pay from Wallet",
    options: [
      {
        label: "Pay with Wallet Balance",
        description: "Use your available wallet balance for a quick and secure payment.",
        icon: <Wallet className="text-green-600 w-6 h-6" />,
      },
    ],
  },
];

export default function PaymentMethodPage() {
  const [selected, setSelected] = useState("Go Cashless: Pay on Delivery via Bank Transfer");



  return (
    <>

      <div className="max-w-3xl mx-auto p-6 h-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Payment Methods</h2>

        {paymentOptions.map((section) => (
          <div key={section.group} className="mb-8">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">{section.group}</h4>
            <div className="space-y-4">
              {section.options.map((opt) => (
                <label
                  key={opt.label}
                  className={`flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                    selected === opt.label ? "border-blue-500 bg-blue-50" : "hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.label}
                    checked={selected === opt.label}
                    onChange={() => setSelected(opt.label)}
                    className="mt-1.5 w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 flex items-start gap-3">
                    <span className="transform transition-transform duration-300 hover:scale-110">
                      {opt.icon}
                    </span>
                    <div>
                      <p className="text-base font-medium text-gray-900">{opt.label}</p>
                      {opt.description && (
                        <p className="text-sm text-gray-500 mt-1">{opt.description}</p>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          className="flex items-center gap-2 bg-[#007bff] text-white px-8 py-3 rounded-full font-semibold mt-6 ml-auto shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          Confirm Payment Method
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

       <div className="md:hidden flex justify-center mt-6 pb-4">
              <Link 
                href="/vendor/account-settings" 
                className="flex gap-2 px-4 py-2 items-center bg-gray-100 text-gray-700 rounded-lg font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Settings</span>
              </Link>
            </div>
    </>
  );
}
