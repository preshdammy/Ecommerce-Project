"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp, ChevronLeft } from "lucide-react"; 
import { useState } from "react";
import Swal from "sweetalert2";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Image from "next/image";
import Link from "next/link";

const GET_VENDOR_DETAILS = gql`
  query GetVendorById($id: ID!) {
    getVendorById(id: $id) {
      id
      name
      email
      businessName
      profilePicture
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
  const [showMonthlySales, setShowMonthlySales] = useState(false);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
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

  if (loading) {
    return (
      <div className="flex justify-center h-[50vh] items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !data?.getVendorById) return <p className="mt-10 text-center text-red-500">Vendor not found.</p>;

  const v = data.getVendorById;
  console.log("Vendor full data:", v);

  return (
    <div className="w-full mx-auto p-3 sm:p-6 mt-4 h-[100vh] overflow-y-auto">
      <Link 
        href="/admin/admindashboard/vendors"
        className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Back
      </Link>

      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center md:text-left">{v.businessName || v.name}</h2>

      {/* Vendor Profile Section */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-4 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="w-full md:w-auto flex justify-center">
            {v.profilePicture ? (
              <Image
                src={v.profilePicture}
                alt={v.businessName || v.name || "Vendor profile"}
                width={120}
                height={120}
                className="rounded-full object-cover w-32 h-32 sm:w-36 sm:h-36 md:w-32 md:h-32"
              />
            ) : (
              <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Photo</span>
              </div>
            )}
          </div>

          {/* Vendor Details Grid - Desktop Only */}
          <div className="hidden md:grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="font-medium text-gray-600">Email:</p>
              <p>{v.email}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Status:</p>
              <p className={`font-semibold ${v.status === 'APPROVED' ? 'text-green-600' : v.status === 'BANNED' ? 'text-red-600' : 'text-yellow-600'}`}>
                {v.status}
              </p>
            </div>
            {v.suspendedUntil && (
              <div>
                <p className="font-medium text-gray-600">Suspended Until:</p>
                <p>{new Date(v.suspendedUntil).toLocaleDateString()}</p>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-600">Joined:</p>
              <p>{new Date(Number(v.createdAt)).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Total Sales:</p>
              <p>{v.stats.totalSales.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Product Count:</p>
              <p>{v.stats.productCount}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Average Rating:</p>
              <p>{typeof v.stats.ratingAverage === "number" ? v.stats.ratingAverage.toFixed(2) : "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Mobile-only: View Details Button */}
        <div className="md:hidden mt-4">
          <button
            onClick={() => setShowVendorDetails(!showVendorDetails)}
            className="flex items-center justify-center w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-base font-medium transition-colors"
          >
            {showVendorDetails ? 'Hide Details' : 'View Vendor Details'}
            {showVendorDetails ? <ChevronUp className="w-5 h-5 ml-2" /> : <ChevronDown className="w-5 h-5 ml-2" />}
          </button>

          {/* Mobile Vendor Details */}
          {showVendorDetails && (
            <div className="mt-4 grid grid-cols-1 gap-3 p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-bold text-gray-700 text-lg">Email:</p>
                <p>{v.email}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">Status:</p>
                <p className={`font-semibold ${v.status === 'APPROVED' ? 'text-green-600' : v.status === 'BANNED' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {v.status}
                </p>
              </div>
              {v.suspendedUntil && (
                <div>
                  <p className="font-bold text-gray-700 text-lg">Suspended Until:</p>
                  <p>{new Date(v.suspendedUntil).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="font-bold text-gray-700 text-lg">Joined:</p>
                <p>{new Date(Number(v.createdAt)).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">Total Sales:</p>
                <p>{v.stats.totalSales.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">Product Count:</p>
                <p>{v.stats.productCount}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">Average Rating:</p>
                <p>{typeof v.stats.ratingAverage === "number" ? v.stats.ratingAverage.toFixed(2) : "N/A"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6 justify-center md:justify-start">
        {v.status === "PENDING" && (
          <button
            className="bg-green-100 text-green-700 px-5 py-3 rounded-lg font-medium text-base w-full sm:w-auto hover:bg-green-200 transition-colors"
            onClick={() => approveVendor({ variables: { vendorId: id } })}
          >
            Approve Vendor
          </button>
        )}

        {v.status !== "BANNED" && (
          <>
            {v.suspendedUntil && new Date(v.suspendedUntil) > new Date() ? (
              <button
                className="bg-blue-100 text-blue-800 px-5 py-3 rounded-lg font-medium text-base w-full sm:w-auto hover:bg-blue-200 transition-colors"
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
                className="bg-orange-100 text-orange-700 px-5 py-3 rounded-lg font-medium text-base w-full sm:w-auto hover:bg-orange-200 transition-colors"
                onClick={handleSuspend}
              >
                Suspend Vendor
              </button>
            )}

            <button
              className="bg-red-100 text-red-700 px-5 py-3 rounded-lg font-medium text-base w-full sm:w-auto hover:bg-red-200 transition-colors"
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

      {/* Monthly Sales Chart - Hidden by default on mobile */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Monthly Sales</h3>
          <button
            onClick={() => setShowMonthlySales(!showMonthlySales)}
            className="md:hidden text-blue-500 hover:text-blue-700"
          >
            {showMonthlySales ? <ChevronUp className="w-7 h-7" /> : <ChevronDown className="w-7 h-7" />}
          </button>
        </div>
        
        <div className={`${showMonthlySales ? 'block' : 'hidden md:block'} h-64 mt-4`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={v.stats.salesPerMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Admin Actions Section - Hidden by default on mobile */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Admin Actions</h3>
          <button
            onClick={() => setShowAllActions(!showAllActions)}
            className="md:hidden text-blue-500 hover:text-blue-700"
          >
            {showAllActions ? <ChevronUp className="w-7 h-7" /> : <ChevronDown className="w-7 h-7" />}
          </button>
        </div>
        
        <div className={`${showAllActions ? 'block' : 'hidden md:block'} mt-4`}>
          {Array.isArray(v.actions) && v.actions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {(showAllActions ? v.actions : v.actions.slice(0, 3)).map((a: any, i: number) => (
                <li key={i} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{a.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(a.performedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        by {a.performedBy}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 py-3">No admin actions yet</p>
          )}
        </div>
        {v.actions?.length > 3 && (
          <button
            onClick={() => setShowAllActions(!showAllActions)}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700 hidden md:block"
          >
            {showAllActions ? 'Show Less' : 'View All Actions'}
          </button>
        )}
      </div>

      {/* Products Section - Hidden by default on mobile */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Products</h3>
          <button
            onClick={() => setShowProducts(!showProducts)}
            className="md:hidden text-blue-500 hover:text-blue-700"
          >
            {showProducts ? <ChevronUp className="w-7 h-7" /> : <ChevronDown className="w-7 h-7" />}
          </button>
        </div>

        {showProducts && (
          <ul className="space-y-4 mt-4">
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