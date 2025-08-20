"use client";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";

const GET_VENDORS = gql`
  query {
    vendors {
      id
      name
      businessName
      email
      status
      createdAt
    }
  }
`;

export default function VendorList() {
  const { data, loading, error } = useQuery(GET_VENDORS);
  const [search, setSearch] = useState("");

  if (loading) {
    return (
      <div className="flex justify-center h-[50vh] items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading vendors...</p>
      </div>
    );
  }
  if (error) {
    console.error("GraphQL error:", error);
    return <div className="mt-10 text-center text-red-500">Failed to load vendors</div>;
  }

  const vendors = data?.vendors || [];

  const filtered = vendors.filter((v: any) =>
    (v.businessName?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
    (v.email?.toLowerCase() ?? "").includes(search.toLowerCase())
  );

  return (
    <div className="w-full mx-auto p-4 mt-4 md:mt-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">All Vendors</h2>

      <input
        placeholder="Search vendors..."
        className="mb-4 md:mb-6 w-full px-3 py-2 md:px-4 md:py-2 rounded bg-white shadow"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500">No vendors found.</div>
      ) : (
        <div className="space-y-6 flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto">
          {filtered.map((vendor: any) => (
            <Link href={`/admin/admindashboard/vendors/${vendor.id}`} key={vendor.id}>
              <div className="p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition cursor-pointer flex justify-between items-center">
                <div>
                  <div className="font-semibold">{vendor.businessName || vendor.name}</div>
                  <div className="text-sm text-gray-600">{vendor.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    vendor.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : vendor.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : vendor.status === "SUSPENDED"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {vendor.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}