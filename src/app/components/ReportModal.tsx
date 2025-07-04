"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

interface ReportModalProps {
  reportType: "seller" | "shopper" | null;
  onClose: () => void;
}

// ✅ GraphQL Mutation
const REPORT_ACCOUNT = gql`
  mutation ReportAccount($input: ReportAccountInput!) {
    reportAccount(input: $input)
  }
`;

export default function ReportModal({ reportType, onClose }: ReportModalProps) {
  const [name, setUsername] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const [reportAccount, { loading, error }] = useMutation(REPORT_ACCOUNT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await reportAccount({
        variables: {
          input: {
            type: reportType,
            name,
            reason,
            description,
          },
        },
      });

      alert(" Report sent");
      onClose();
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      alert("Failed to send report. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Report {reportType === "seller" ? "Seller's" : "Shopper's"} Account
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name of the account
            </label>
            <input
              type="text"
              className="mt-1 block w-full h-[50px] rounded-md border text-[20px] border-gray-300 shadow-sm focus:ring-blue-500 focus:border-b-emerald-300"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reason for reporting
            </label>
            <select
              className="mt-1 block w-full rounded-md border h-[30px] border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              <option value="scam">Scam or Fraud</option>
              <option value="fake_product">Fake Product</option>
              <option value="harassment">Harassment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {error && (
            <p className="text-sm text-red-600">An error occurred. Please try again.</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
