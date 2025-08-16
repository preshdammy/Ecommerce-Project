
"use client";

import { useQuery, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ADD_COMPLAINT = gql`
  mutation AddComplaint($message: String!) {
    addComplaint(message: $message) {
      id
      message
      status
      createdAt
    }
  }
`;

const GET_COMPLAINTS = gql`
  query {
    complaints {
      id
      message
      status
      createdAt
      user {
        id
        name
        email
      }
      vendor {
        id
        name
        email
      }
    }
  }
`;

const UPDATE_COMPLAINT_STATUS = gql`
  mutation UpdateComplaintStatus($id: ID!, $status: String!) {
    updateComplaintStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export default function ComplaintsPage() {
  const router = useRouter();
  const token = Cookies.get("admintoken");

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      router.replace("/adminlogin");
    }
  }, [token, router]);

  const { data, loading, error, refetch } = useQuery(GET_COMPLAINTS);

  const [addComplaint] = useMutation(ADD_COMPLAINT, {
    onCompleted: () => {
      toast.success("Complaint submitted!");
      setMessage("");
      refetch();
    },
    onError: () => {
      toast.error("Failed to submit complaint.");
    },
  });

  const [updateComplaintStatus] = useMutation(UPDATE_COMPLAINT_STATUS, {
    onCompleted: () => {
      toast.success("Complaint status updated");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const complaints = data?.complaints || [];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">
        Complaints
      </h1>

      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">Loading complaints...</p>
        </div>
      )}
      {error && (
        <p className="text-red-500 bg-red-50 p-4 rounded-lg text-center font-medium">
          Error loading complaints
        </p>
      )}

      {!loading && !error && complaints.length === 0 ? (
        <p className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center text-sm">
          No complaints yet.
        </p>
      ) : (
        <div className="space-y-4">
          {complaints.map((c: any) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="text-gray-800 text-base leading-relaxed mb-3">
                  {c.message}
                </p>
                <p className="text-sm text-gray-500">
                  Filed by{" "}
                  {c.user
                    ? `${c.user.name} (${c.user.email})`
                    : c.vendor
                    ? `${c.vendor.name} (${c.vendor.email})`
                    : "Unknown"}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      c.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : c.status === "In Review"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    Status: {c.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(c.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {c.status !== "Resolved" && (
                  <div className="flex items-center gap-3 mt-4">
                    {c.status !== "In Review" && (
                      <button
                        onClick={() =>
                          updateComplaintStatus({
                            variables: { id: c.id, status: "In Review" },
                          })
                        }
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                      >
                        Mark as In Review
                      </button>
                    )}
                    <button
                      onClick={() =>
                        updateComplaintStatus({
                          variables: { id: c.id, status: "Resolved" },
                          })
                        }
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300"
                    >
                      Mark as Resolved
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <IoIosArrowDown className="text-xl text-gray-400 hover:text-gray-600 transition-colors duration-200" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
