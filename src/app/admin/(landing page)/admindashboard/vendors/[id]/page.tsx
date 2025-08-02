"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp } from "lucide-react"; 
import { useState } from "react";
import Swal from "sweetalert2";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const GET_VENDOR_DETAILS = gql`
  query GetVendorById($id: ID!) {
    getVendorById(id: $id) {
      id
      name
      email
      businessName
      status
      suspendedUntil
      createdAt
      stats {
        totalSales
        productCount
        ratingAverage
        salesPerMonth {
          month
          total
        }
      }
      actions {
        action
        performedBy
        performedAt
      }
      products {
        id
        name
        price
      }
    }
  }
`;
const APPROVE_VENDOR = gql`
  mutation ApproveVendor($vendorId: ID!) {
    approveVendor(vendorId: $vendorId) {
      id
      status
    }
  }
`;

const SUSPEND_VENDOR = gql`
  mutation SuspendVendor($vendorId: ID!, $until: DateTime!) {
    suspendVendor(vendorId: $vendorId, until: $until) {
      id
      status
      suspendedUntil
    }
  }
`;

const BAN_VENDOR = gql`
  mutation BanVendor($vendorId: ID!) {
    banVendor(vendorId: $vendorId) {
      id
      status
    }
  }
`;

const UNSUSPEND_VENDOR = gql`
  mutation UnsuspendVendor($vendorId: ID!) {
    unsuspendVendor(vendorId: $vendorId) {
      id
      status
      suspendedUntil
    }
  }
`;

export default function VendorDetails() {
  const [showProducts, setShowProducts] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);
  const params = useParams();
  const id = params?.id as string;

  const { data, loading, error, refetch } = useQuery(GET_VENDOR_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const [approveVendor] = useMutation(APPROVE_VENDOR, {
    onCompleted: () => {
      toast.success("Vendor approved");
      refetch();
    },
  });

  const [suspendVendor] = useMutation(SUSPEND_VENDOR, {
    onCompleted: () => {
      toast.success("Vendor suspended");
      refetch();
    },
  });

  const [banVendor] = useMutation(BAN_VENDOR, {
    onCompleted: () => {
      toast.success("Vendor banned");
      refetch();
    },
  });

  const [unsuspendVendor] = useMutation(UNSUSPEND_VENDOR, {
    onCompleted: () => {
      toast.success("Vendor unsuspended");
      refetch();
    },
  });

  const handleSuspend = async () => {
    const result = await Swal.fire({
      title: "Suspend Vendor",
      html: `<input type="date" id="suspendDate" class="swal2-input">`,
      preConfirm: () => {
        const date = (document.getElementById("suspendDate") as HTMLInputElement).value;
        if (!date) return Swal.showValidationMessage("Date is required");
        return date;
      },
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      suspendVendor({
        variables: {
          vendorId: id,
          until: new Date(result.value).toISOString(),
        },
      });
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading vendor...</p>;
  if (error || !data?.getVendorById) return <p className="mt-10 text-center text-red-500">Vendor not found.</p>;

  const v = data.getVendorById;
  console.log("Vendor full data:", v);

  return (
    <div className="w-[90%] mx-auto mt-10 h-screen overflow-hidden overflow-y-scroll">
      <h2 className="text-2xl font-bold mb-4">{v.businessName || v.name}</h2>
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100 ">
      <div className="grid grid-cols-2 gap-4">
        <p><span className="font-medium text-gray-600">Email:</span> {v.email}</p>
        <p><span className="font-medium text-gray-600">Status:</span> <span className={`font-semibold ${v.status === 'APPROVED' ? 'text-green-600' : v.status === 'BANNED' ? 'text-red-600' : 'text-yellow-600'}`}>{v.status}</span></p>
        {v.suspendedUntil && (
          <p><span className="font-medium text-gray-600">Suspended Until:</span> {new Date(v.suspendedUntil).toLocaleDateString()}</p>
        )}
        <p><span className="font-medium text-gray-600">Joined:</span> {new Date(Number(v.createdAt)).toLocaleDateString()}</p>
        <p><span className="font-medium text-gray-600">Total Sales:</span> {v.stats.totalSales.toLocaleString()}</p>
        <p><span className="font-medium text-gray-600">Product Count:</span> {v.stats.productCount}</p>
        <p><span className="font-medium text-gray-600">Average Rating:</span> {typeof v.stats.ratingAverage === "number" ? v.stats.ratingAverage.toFixed(2) : "N/A"}</p>
      </div>
    </div>

    <div className="flex gap-4 mb-6">
        {v.status === "PENDING" && (
          <button
            className="bg-green-100 text-green-700 px-4 py-2 rounded"
            onClick={() => approveVendor({ variables: { vendorId: id } })}
          >
            Approve Vendor
          </button>
        )}

        {v.status !== "BANNED" && (
          <>
            {v.suspendedUntil && new Date(v.suspendedUntil) > new Date() ? (
              <button
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded"
                onClick={() =>
                  Swal.fire({
                    title: "Unsuspend Vendor?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Yes, unsuspend",
                  }).then((r) => {
                    if (r.isConfirmed) {
                      unsuspendVendor({ variables: { vendorId: id } });
                    }
                  })
                }
              >
                Unsuspend Vendor
              </button>
            ) : (
              <button
                className="bg-orange-100 text-orange-800 px-4 py-2 rounded"
                onClick={handleSuspend}
              >
                Suspend Vendor
              </button>
            )}

            <button
              className="bg-red-100 text-red-700 px-4 py-2 rounded"
              onClick={() =>
                Swal.fire({
                  title: "Are you sure?",
                  text: "This vendor will be permanently banned!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Yes, ban",
                  cancelButtonText: "Cancel",
                }).then((r) => {
                  if (r.isConfirmed) {
                    banVendor({ variables: { vendorId: id } });
                  }
                })
              }
            >
              Ban Vendor
            </button>
          </>
        )}
      </div>


      <h3 className="text-xl font-semibold mb-2">Monthly Sales</h3>
      <div className="h-64 bg-white p-4 rounded shadow mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={v.stats.salesPerMonth}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-xl font-semibold mb-2">Admin Actions</h3>

      <div
      className={`bg-white p-4 rounded-2xl shadow-sm transition-all duration-300 ${
        showAllActions ? "max-h-72 overflow-y-auto" : "max-h-48 overflow-hidden"
      }`}
    >
      <ul className="divide-y divide-gray-200">
        {Array.isArray(v.actions) && v.actions.length > 0 ? (
          (showAllActions ? v.actions : v.actions.slice(0, 3)).map((a: any, i: number) => (
            <li key={i} className="py-2">
              <p className="text-xs text-gray-400 mb-1">
                {new Date(a.performedAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{a.action}</span> by{" "}
                <span className="italic">{a.performedBy}</span>
              </p>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">No admin actions yet.</p>
        )}
      </ul>
    </div>

    {v.actions.length > 3 && (
      <button
        onClick={() => setShowAllActions((prev) => !prev)}
        className="mt-2 text-xs text-gray-500 hover:text-gray-700 transition"
      >
        {showAllActions ? "Show less" : "View all actions"}
      </button>
    )}
      <div className="bg-white p-6 rounded-2xl shadow-md mt-[20px] border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">Products</h3>
        <button
          className="text-gray-600 hover:text-black transition"
          onClick={() => setShowProducts((prev) => !prev)}
        >
          {showProducts ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {showProducts && (
        <ul className="space-y-2 mt-4">
          {Array.isArray(v.products) && v.products.length > 0 ? (
            v.products.map((p: any) => (
              <li
                key={p.id}
                className="flex justify-between items-center py-3 bg-gray-50 shadow-sm last:border-b-0 hover:bg-gray-50 transition rounded-md px-2"
              >
                <div>
                  <p className="font-medium text-gray-800">{p.name}</p>
                  <p className="text-sm text-gray-500">₦{Number(p.price).toLocaleString()}</p>
                </div>
                <button className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded hover:bg-indigo-200 transition">
                  Action
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No products yet.</p>
          )}
        </ul>
      )}
    </div>
    </div>
  );
}
