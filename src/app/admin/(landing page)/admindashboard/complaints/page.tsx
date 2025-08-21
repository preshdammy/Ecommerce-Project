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

  // store expanded complaints as a map {id: boolean}
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const complaints = data?.complaints || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 min-h-screen font-sans flex flex-col">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 tracking-tight">
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
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex-1 overflow-y-auto pb-4"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            <div className="space-y-4">
              {complaints.map((c: any) => {
                const isOpen = expanded[c.id];

                return (
                  <div
                    key={c.id}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                  >
                    {/* Top row: message + chevron (mobile only) */}
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 text-base flex-1">
                        {c.message}
                      </p>
                      <button
                        onClick={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [c.id]: !isOpen,
                          }))
                        }
                        className="md:hidden ml-2"
                      >
                        <IoIosArrowDown
                          className={`text-lg text-gray-500 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Status badge */}
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs md:px-3 md:py-1 md:text-sm rounded-full font-medium ${
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

                    {/* Extra details */}
                    <div
                      className={`mt-3 space-y-2 text-sm text-gray-600 ${
                        isOpen ? "block" : "hidden md:block"
                      }`}
                    >
                      <p>
                        Filed by{" "}
                        {c.user
                          ? `${c.user.name} (${c.user.email})`
                          : c.vendor
                          ? `${c.vendor.name} (${c.vendor.email})`
                          : "Unknown"}
                      </p>

                      <p className="text-xs text-gray-400">
                        {new Date(c.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      {c.status !== "Resolved" && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {c.status !== "In Review" && (
                            <button
                              onClick={() =>
                                updateComplaintStatus({
                                  variables: { id: c.id, status: "In Review" },
                                })
                              }
                              className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs hover:bg-yellow-600"
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
                            className="bg-green-600 text-white px-3 py-1 rounded-full text-xs hover:bg-green-700"
                          >
                            Mark as Resolved
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
