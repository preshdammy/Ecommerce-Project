"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronDown, ChevronUp, Eye } from "lucide-react";

const GET_USER_DETAILS = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      name
      email
      profilePicture
      address
      state
      city
      gender
      dateOfBirth
      walletBalance
      status
      suspendedUntil
      createdAt
      actions {
        action
        performedBy
        performedAt
        notes
      }
      complaints {
        id
        message
        status
        createdAt
      }
      orders {
        id
        totalAmount
        status
        createdAt
        items {
          product {
            name
            price
          }
          quantity
        }
      }
    }
  }
`;

const SUSPEND_USER = gql`
  mutation SuspendUser($UserId: ID!, $until: DateTime!) {
    suspendUser(UserId: $UserId, until: $until) {
      id
      status
      suspendedUntil
      actions {
        action
        performedBy
        performedAt
        notes
      }
    }
  }
`;

const UNSUSPEND_USER = gql`
  mutation UnsuspendUser($UserId: ID!) {
    unsuspendUser(UserId: $UserId) {
      id
      status
      suspendedUntil
      actions {
        action
        performedBy
        performedAt
        notes
      }
    }
  }
`;

const BAN_USER = gql`
  mutation BanUser($UserId: ID!) {
    banUser(UserId: $UserId) {
      id
      status
      actions {
        action
        performedBy
        performedAt
        notes
      }
    }
  }
`;

export default function UserDetails() {
  const [showAllActions, setShowAllActions] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllComplaints, setShowAllComplaints] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const params = useParams();
  const id = params?.id as string;

  const { data, loading, error, refetch } = useQuery(GET_USER_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const [suspendUser, { loading: suspending }] = useMutation(SUSPEND_USER, {
    onCompleted: () => {
      toast.success("User suspended successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error suspending user: ${error.message}`);
    },
    update: (cache, { data }) => {
      cache.modify({
        id: cache.identify(data.suspendUser),
        fields: {
          status: () => data.suspendUser.status,
          suspendedUntil: () => data.suspendUser.suspendedUntil,
        },
      });
    },
  });

  const [unsuspendUser, { loading: unsuspending }] = useMutation(UNSUSPEND_USER, {
    onCompleted: () => {
      toast.success("User unsuspended successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error unsuspending user: ${error.message}`);
    },
  });

  const [banUser, { loading: banning }] = useMutation(BAN_USER, {
    onCompleted: () => {
      toast.success("User banned");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error banning user: ${error.message}`);
    },
  });

  const handleSuspend = async () => {
    if (!data?.user) {
      toast.error("User data not loaded");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Suspend User",
      html: `
        <input type="date" id="suspendDate" class="swal2-input" required>
        <textarea id="suspendNotes" class="swal2-textarea mt-2" 
        placeholder="Reason (optional)"></textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const dateInput = document.getElementById('suspendDate') as HTMLInputElement;
        if (!dateInput.value) {
          Swal.showValidationMessage("Suspension date is required");
          return null;
        }
        return {
          date: dateInput.value,
          notes: (document.getElementById('suspendNotes') as HTMLTextAreaElement).value,
        };
      },
    });

    if (formValues) {
      try {
        const result = await suspendUser({
          variables: {
            UserId: data.user.id,
            until: new Date(formValues.date).toISOString(),
          },
        });
        console.log("Sending variables:", {
          UserId: data.user.id,
          until: new Date(formValues.date).toISOString(),
        });

        if (result.data?.suspendUser) {
          refetch();
        }
      } catch (err: any) {
        toast.error(`Suspension failed: ${err.message}`);
        console.error("Full error:", err);
      }
    }
  };

  const handleBan = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be banned permanently from this platform!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, ban user",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        banUser({ variables: { UserId: id } });
      }
    });
  };

  const handleUnsuspend = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be unsuspended!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, unsuspend user",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        unsuspendUser({ variables: { UserId: id } });
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center h-[50vh] items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !data?.user) return <p className="mt-10 text-center text-red-500">User not found.</p>;

  const u = data.user;
  const isUpdating = suspending || unsuspending || banning;

  return (
    <div className="w-full mx-auto p-3 sm:p-6 mt-4 h-[100vh] overflow-y-auto">
     
      <Link
        href="/admin/admindashboard/users"
        className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Back
      </Link>

      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center md:text-left">{u.name}</h2>

      {/* User Profile Section */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-4 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image - Optimized for mobile */}
          <div className="w-full md:w-auto flex justify-center">
            {u.profilePicture ? (
              <Image
                src={u.profilePicture}
                alt={u.name || "User profile"}
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

          {/* User Details Grid - Desktop Only */}
          <div className="hidden md:grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="font-medium text-gray-600">Email:</p>
              <p>{u.email}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Status:</p>
              <p
                className={`font-semibold ${
                  u.status === 'BANNED' ? 'text-red-600' :
                  u.status === 'SUSPENDED' ? 'text-yellow-600' :
                  'text-green-600'
                }`}
              >
                {u.status || 'ACTIVE'}
                {isUpdating && <span className="text-xs ml-2">(updating...)</span>}
                {u.status === 'SUSPENDED' && u.suspendedUntil && (
                  <span className="block text-xs text-gray-500">
                    (until {new Date(u.suspendedUntil).toLocaleDateString()})
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Wallet Balance:</p>
              <p>₦{Number(u.walletBalance || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Joined:</p>
              <p>{new Date(u.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Address:</p>
              <p>{u.address || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">City/State:</p>
              <p>{u.city || 'N/A'}, {u.state || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Gender:</p>
              <p>{u.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Date of Birth:</p>
              <p>{u.dateOfBirth || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Mobile-only: View Details Button */}
        <div className="md:hidden mt-4">
          <button
            onClick={() => setShowUserDetails(!showUserDetails)}
            className="flex items-center justify-center w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-base font-medium transition-colors"
          >
            {showUserDetails ? 'Hide Details' : 'View User Details'}
            {showUserDetails ? <ChevronUp className="w-5 h-5 ml-2" /> : <ChevronDown className="w-5 h-5 ml-2" />}
          </button>

          {/* Mobile User Details - Smooth transition */}
          {showUserDetails && (
            <div className="mt-4 grid grid-cols-1 gap-3 p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-bold text-gray-700 text-lg">Email:</p>
                <p>{u.email}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">Status:</p>
                <p className={`font-semibold ${
                  u.status === 'BANNED' ? 'text-red-600' : 
                  u.status === 'SUSPENDED' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {u.status || 'ACTIVE'}
                  {isUpdating && <span className="text-xs ml-2">(updating...)</span>}
                  {u.status === 'SUSPENDED' && u.suspendedUntil && (
                    <span className="block text-xs text-gray-500">
                      (until {new Date(u.suspendedUntil).toLocaleDateString()})
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">Wallet Balance:</p>
                <p>₦{Number(u.walletBalance || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">Joined:</p>
                <p>{new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">Address:</p>
                <p>{u.address || 'N/A'}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">City/State:</p>
                <p>{u.city || 'N/A'}, {u.state || 'N/A'}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">Gender:</p>
                <p>{u.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">Date of Birth:</p>
                <p>{u.dateOfBirth || 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Reduced margin */}
      <div className="flex flex-wrap gap-3 mb-4 justify-center md:justify-start">
        {u.status !== 'BANNED' && (
          <button
            className="bg-red-100 text-red-700 px-5 py-3 rounded-lg font-medium text-base w-full sm:w-auto hover:bg-red-200 transition-colors"
            onClick={handleBan}
            disabled={isUpdating}
          >
            {banning ? "Processing..." : "Ban User"}
          </button>
        )}
        {u.status !== 'SUSPENDED' && u.status !== 'BANNED' && (
          <button
            className="bg-yellow-100 text-yellow-700 px-5 py-3 rounded-lg font-medium text-base w-full sm:w-auto hover:bg-yellow-200 transition-colors"
            onClick={handleSuspend}
            disabled={isUpdating}
          >
            {suspending ? "Processing..." : "Suspend User"}
          </button>
        )}
        {u.status === 'SUSPENDED' && (
          <button
            className="bg-blue-100 text-blue-700 px-5 py-3 rounded-lg font-medium text-base w-full sm:w-auto hover:bg-blue-200 transition-colors"
            onClick={handleUnsuspend}
            disabled={isUpdating}
          >
            {unsuspending ? "Processing..." : "Unsuspend User"}
          </button>
        )}
      </div>

      {/* Admin Actions Section */}
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
        
        <div className={`${showAllActions ? 'block' : 'hidden md:block'} transition-all duration-300 ${
          showAllActions ? "max-h-[9999px]" : "max-h-[200px]"
        } overflow-hidden mt-4`}>
          {u.actions?.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {(showAllActions ? u.actions : u.actions.slice(0, 3)).map((action: any, i: number) => (
                <li key={i} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{action.action}</p>
                      <p className="text-sm text-gray-600">{action.notes}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(action.performedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        by {action.performedBy}
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
        {u.actions?.length > 3 && (
          <button
            onClick={() => setShowAllActions(!showAllActions)}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700 hidden md:block"
          >
            {showAllActions ? 'Show Less' : 'View All Actions'}
          </button>
        )}
      </div>


      {/* Orders Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Order History</h3>
          <button
            onClick={() => setShowAllOrders(!showAllOrders)}
            className="md:hidden text-blue-500 hover:text-blue-700"
          >
            {showAllOrders ? <ChevronUp className="w-7 h-7" /> : <ChevronDown className="w-7 h-7" />}
          </button>
        </div>
        
        <div className={`${showAllOrders ? 'block' : 'hidden md:block'} mt-4`}>
          {u.orders?.length > 0 ? (
            <div className="space-y-4">
              {(showAllOrders ? u.orders : u.orders.slice(0, 2)).map((order: any) => (
                <div key={order.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        ₦{Number(order.totalAmount).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'DELIVERED' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium">Items:</p>
                    <ul className="ml-4 space-y-1">
                      {order.items.map((item: any, i: number) => (
                        <li key={i} className="text-sm text-gray-600">
                          {item.quantity}x {item.product.name} (₦{Number(item.product.price).toLocaleString()})
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    Ordered:{" "}
                    {new Date(parseInt(order.createdAt)).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No orders yet.</p>
          )}
        </div>
        {u.orders?.length > 2 && (
          <button
            onClick={() => setShowAllOrders(!showAllOrders)}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700 hidden md:block"
          >
            {showAllOrders ? 'Show Less' : 'View All Orders'}
          </button>
        )}
      </div>

      {/* Complaints Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Complaints</h3>
                <button
                  onClick={() => setShowAllComplaints(!showAllComplaints)}
                  className="md:hidden text-blue-500 hover:text-blue-700"
                >
                  {showAllComplaints ? <ChevronUp className="w-7 h-7" /> : <ChevronDown className="w-7 h-7" />}
                </button>
              </div>
              
              <div className={`${showAllComplaints ? 'block' : 'hidden md:block'} mt-4`}>
                {u.complaints?.length > 0 ? (
                  <div className="space-y-4">
                    {(showAllComplaints ? u.complaints : u.complaints.slice(0, 2)).map((complaint: any) => (
                      <div key={complaint.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">Complaint #{complaint.id}</p>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            complaint.status?.toUpperCase() === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                            complaint.status?.toUpperCase() === 'PENDING' ? 'bg-yellow-100 text-red-800' :
                            'bg-red-100  text-yellow-800'
                          }`}>
                            {complaint.status?.toUpperCase()}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-600">{complaint.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No complaints yet.</p>
                )}
              </div>
              {u.complaints?.length > 2 && (
                <button
                  onClick={() => setShowAllComplaints(!showAllComplaints)}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-700 hidden md:block"
                >
                  {showAllComplaints ? 'Show Less' : 'View All Complaints'}
                </button>
              )}
            </div>
    </div>
  );
}