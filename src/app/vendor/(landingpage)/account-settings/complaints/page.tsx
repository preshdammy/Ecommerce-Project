"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { gql, useQuery, useMutation } from "@apollo/client";
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

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
  const [showComplaints, setShowComplaints] = useState(false);

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
  <>

     <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 tracking-tight">
        Vendor Complaints
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your complaint here..."
          className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg resize-none h-32 sm:h-36 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
        />
        <button
          type="submit"
          className="mt-3 sm:mt-4 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 sm:py-3 rounded-full font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
        >
          Submit Complaint
        </button>
      </form>

      <div className="flex justify-end">
        <button
          onClick={() => setShowComplaints(!showComplaints)}
          className={`font-semibold px-5 py-1 shadow-md transition-all duration-300
            ${
              showComplaints
                ? "bg-blue-300 text-white hover:bg-blue-500"
                : "bg-blue-100 text-blue-500 hover:bg-blue-300 hover:text-white"
            }`
          }
        >
          {showComplaints ? "Hide Complaints" : "Show Complaints"}
        </button>
      </div>

      {showComplaints && (
        <>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Complaints</h2>

          {loading && (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600">Loading complaints...</p>
            </div>
          )}
          {error && (
            <p className="text-red-500 bg-red-50 p-4 rounded-lg text-center">
              Error loading complaints.
            </p>
          )}

          {!loading && !error && (
            <ul className="space-y-4">
              {Array.isArray(complaints) && complaints.length > 0 ? (
                complaints.map((c) => (
                  <li
                    key={c.id}
                    className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <p className="text-gray-800 text-base leading-relaxed">
                      {c.message}
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                        c.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : c.status === "In Review"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Status: {c.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-2">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Unknown date"}
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg text-center">
                  No complaints found.
                </li>
              )}
            </ul>
          )}
        </>
      )}
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