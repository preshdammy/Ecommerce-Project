"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { gql, useMutation } from "@apollo/client";

const SEND_REPORT = gql`
  mutation SendReport(
    $reportType: String!
    $targetId: ID!
    $targetName: String!
    $reason: String
    $reportedBy: String!
    $reporterType: ReporterType
  ) {
    sendReport(
      reportType: $reportType
      targetId: $targetId
      targetName: $targetName
      reason: $reason
      reportedBy: $reportedBy
      reporterType: $reporterType
    ) {
      id
      reportType
      targetName
      reason
      reportedBy
      status
      createdAt
    }
  }
`;

export default function ReportAccountModal({
  canReportSeller,
  canReportUser,
  canReportVendor,
  vendorId,
  vendorName,
}: {
  canReportSeller?: boolean;
  canReportUser?: boolean;
  canReportVendor?: boolean;
  vendorId?: string;
  vendorName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<"user" | "vendor" | "">(vendorId ? "vendor" : "");
  const [targetId, setTargetId] = useState(vendorId || "");
  const [name, setName] = useState(vendorName || "");
  const [currentUser, setCurrentUser] = useState<string>("");

  const [sendReport] = useMutation(SEND_REPORT);

  useEffect(() => {
    const userInfo = Cookies.get("userinfo"); // Get userinfo cookie
    console.log("Retrieved userinfo from cookie:", userInfo); // Debug log
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        const username = parsedUser.name || parsedUser.username || parsedUser.email;
        console.log("Parsed username:", username);
        if (username) {
          setCurrentUser(username);
        } else {
          console.log("No username found in userinfo");
        }
      } catch (err) {
        console.error("Failed to parse userinfo cookie", err);
      }
    } else {
      console.log("No userinfo found in cookie");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendReport({
        variables: {
          reportType: vendorId ? "vendor" : reportType,
          targetId: vendorId || targetId,
          targetName: vendorName || name,
          reason: "Report submitted", // Default reason
          reportedBy: currentUser || "Anonymous",
          reporterType: canReportVendor ? "vendor" : "user",
        },
      });

      alert("✅ Report submitted successfully. It will be reviewed.");

      // Reset form
      setReportType("");
      setTargetId("");
      setName("");
      setOpen(false);
    } catch (error) {
      console.error("Error sending report:", error);
      alert("❌ Failed to send report.");
    }
  };

  return (
    <div>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="bg-[#FF4C3B] text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
      >
        Report Account
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Report Account</h2>

            {currentUser && (
              <p className="text-sm text-gray-600 mb-2">
                Reporting as: <span className="font-semibold">{currentUser}</span>
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Show vendor info if provided */}
              {vendorId && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Reporting Vendor: <span className="font-semibold">{vendorName}</span>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Vendor ID: {vendorId}
                  </p>
                </div>
              )}

              {/* Type selection - only show if no vendorId provided */}
              {!vendorId && (
                <div>
                  <label className="block text-sm font-medium mb-1">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select...</option>
                    {canReportUser && <option value="user">User</option>}
                    {canReportVendor && <option value="vendor">Vendor</option>}
                  </select>
                </div>
              )}

              {/* Target ID - only show if no vendorId provided and type selected */}
              {!vendorId && reportType && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {reportType === "user" ? "User ID" : "Vendor ID"}
                  </label>
                  <input
                    type="text"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    placeholder={`Enter ${reportType} ID`}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Name - only show if no vendorId provided and type selected */}
              {!vendorId && reportType && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {reportType === "user" ? "User Name" : "Vendor Name"}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Enter ${reportType} name`}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}


              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
