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

  if (loading) return <div>Loading complaints…</div>;
  if (error) return <div>Error loading complaints</div>;

  return (
    <div className="w-full font-sans p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-6">Complaints</h1>

      {complaints.length === 0 ? (
        <p className="text-gray-600">No complaints yet.</p>
      ) : (
        complaints.map((c: any) => (
          <div
            key={c.id}
            className="mb-4 border p-4 rounded-lg flex justify-between"
          >
            <div className="flex-1">
              <p className="mb-2 text-gray-800">{c.message}</p>
              <p className="text-sm text-gray-500">
                Filed by{" "}
                {c.user
                  ? `${c.user.name} (${c.user.email})`
                  : c.vendor
                  ? `${c.vendor.name} (${c.vendor.email})`
                  : "Unknown"}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    c.status === "Resolved"
                      ? "text-green-600"
                      : c.status === "In Review"
                      ? "text-yellow-600"
                      : "text-orange-500"
                  }`}
                >
                  {c.status}
                </span>
              </p>

              <div className="flex items-center gap-2 mt-2">
                {c.status === "Resolved" ? (
                   <></> // No buttons, no extra message
                ) : (
                  <>
                    {c.status !== "In Review" && (
                      <button
                        onClick={() =>
                          updateComplaintStatus({
                            variables: { id: c.id, status: "In Review" },
                          })
                        }
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
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
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Mark as Resolved
                    </button>
                  </>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center">
              <IoIosArrowDown className="text-xl text-gray-400" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
