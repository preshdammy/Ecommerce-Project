"use client";

import { useState } from "react";
import ReportModal from "../../components/ReportModal";

export default function ReportAccountForm() {
  const [reportType, setReportType] = useState<"seller" | "shopper" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (type: "seller" | "shopper") => {
    setReportType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setReportType(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Report Account</h2>
          <p className="text-gray-600">
            At Time Shoppy, we pride ourselves on being reliable and efficient. We are dedicated to having our customers satisfied as well as our vendors paid. Fraudulent activities are not allowed on this platform. Do not hesitate to report any suspicious activity. Once reported, we will investigate accordingly.
          </p>
        </div>

        <div>
          <p className="mb-4 font-medium text-gray-700">What account would you like to report?</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => openModal("seller")}
              className="w-full sm:w-1/2 py-3 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold"
            >
              Seller's Account
            </button>
            <button
              onClick={() => openModal("shopper")}
              className="w-full sm:w-1/2 py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
            >
              Shopper's Account
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ReportModal reportType={reportType} onClose={closeModal} />
      )}
    </>
  );
}
