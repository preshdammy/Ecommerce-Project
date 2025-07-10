"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { gql, useQuery, useMutation } from "@apollo/client";

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

const GET_MY_COMPLAINTS = gql`
  query GetMyComplaints {
    myComplaints {
      id
      message
      status
      createdAt
    }
  }
`;

export default function ComplaintsPage() {
  const [message, setMessage] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_MY_COMPLAINTS);
  const [addComplaint] = useMutation(ADD_COMPLAINT, {
    onCompleted: () => {
      toast.success("Complaint submitted successfully!");
      setMessage("");
      refetch();
    },
    onError: () => toast.error("Failed to submit complaint."),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a complaint.");
      return;
    }
    await addComplaint({ variables: { message } });
  };

  const complaints = data?.myComplaints ?? [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Customer Complaints</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your complaint here..."
          className="w-full p-3 border border-gray-300 rounded-md resize-none h-32"
        />
        <button
          type="submit"
          className="mt-3 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Complaint
        </button>
      </form>

      <h2 className="text-lg font-medium mb-2">Your Complaints</h2>

      {loading && <p>Loading complaints...</p>}
      {error && <p className="text-red-500">Error loading complaints.</p>}

      {!loading && !error && (
        <ul className="space-y-4">
          {Array.isArray(complaints) && complaints.length > 0 ? (
            complaints.map((c) => (
              <li key={c.id} className="p-4 border rounded-md bg-gray-50">
                <p className="text-gray-800">{c.message}</p>
                <span
                  className={`text-sm mt-1 block ${
                    c.status === "Resolved"
                      ? "text-green-600"
                      : c.status === "In Review"
                      ? "text-orange-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {c.status}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleString()
                    : "Unknown date"}
                </p>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">No complaints found.</li>
          )}
        </ul>
      )}
    </div>
  );
}
