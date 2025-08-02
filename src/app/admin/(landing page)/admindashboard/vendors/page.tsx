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

  if (loading) return <div className="mt-10 text-center">Loading...</div>;
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
    <div className="w-[90%] mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">All Vendors</h2>

      <input
        placeholder="Search vendors..."
        className="mb-6 w-full px-4 py-2 rounded bg-white shadow"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500">No vendors found.</div>
      ) : (
        <div className="grid gap-4 h-screen overflow-hidden overflow-y-scroll">
          {filtered.map((vendor: any) => (
            <Link href={`/admin/admindashboard/vendors/${vendor.id}`} key={vendor.id}>
              <div className="p-4 bg-white rounded shadow hover:bg-gray-50 transition cursor-pointer">
                <div className="font-semibold">{vendor.businessName || vendor.name}</div>
                <div className="text-sm text-gray-600">{vendor.email}</div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded inline-block mt-1
                    ${
                      vendor.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : vendor.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : vendor.status === "SUSPENDED"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {vendor.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
