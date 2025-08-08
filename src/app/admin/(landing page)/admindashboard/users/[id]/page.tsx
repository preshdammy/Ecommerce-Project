
"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
        notes: (document.getElementById('suspendNotes') as HTMLTextAreaElement).value
      };
    }
  });

  if (formValues) {
    try {
      const result = await suspendUser({
        variables: {
          UserId: data.user.id,  
          until: new Date(formValues.date).toISOString()
        }
      });
      console.log("Sending variables:", {
      UserId: data.user.id,
      until: new Date(formValues.date).toISOString()
    });
      
      if (result.data?.suspendUser) {
        refetch(); // Refresh user data
      }
    } catch (err:any) {
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

  if (loading) return <p className="mt-10 text-center">Loading user...</p>;
  if (error || !data?.user) return <p className="mt-10 text-center text-red-500">User not found.</p>;

  const u = data.user;
  const isUpdating = suspending || unsuspending || banning ;

  return (
    
    <div className="w-[90%] mx-auto mt-10 h-screen overflow-hidden overflow-y-scroll">
      <Link 
          href="/admin/admindashboard/users"
          className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
      <h2 className="text-2xl font-bold mb-4">{u.name}</h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
              <div className="flex items-start gap-6">
                {u.profilePicture ? (
                  <Image
                    src={u.profilePicture}
                    alt={u.name || "User profile"}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Photo</span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <p><span className="font-medium text-gray-600">Email:</span> {u.email}</p>
                  <p><span className="font-medium text-gray-600">Status: </span> 
                      <span className={`font-semibold ${
                        u.status === 'BANNED' ? 'text-red-600' : 
                        u.status === 'SUSPENDED' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {u.status || 'ACTIVE'}
                        {isUpdating && <span className="text-xs ml-2">(updating...)</span>}
                      </span>

                    {u.status === 'SUSPENDED' && u.suspendedUntil && (
                      <span className="text-xs text-gray-500 ml-2">
                        (until {new Date(u.suspendedUntil).toLocaleDateString()})
                      </span>
                    )}
                  </p>
                  <p><span className="font-medium text-gray-600">Wallet Balance:</span> ₦{Number(u.walletBalance || 0).toLocaleString()}</p>
                  <p><span className="font-medium text-gray-600">Joined:</span> {new Date(u.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium text-gray-600">Address:</span> {u.address || 'N/A'}</p>
                  <p><span className="font-medium text-gray-600">City/State:</span> {u.city || 'N/A'}, {u.state || 'N/A'}</p>
                  <p><span className="font-medium text-gray-600">Gender:</span> {u.gender || 'N/A'}</p>
                  <p><span className="font-medium text-gray-600">Date of Birth:</span> {u.dateOfBirth || 'N/A'}</p>
                </div>
              </div>
            </div>

      <div className="flex gap-4 mb-6">
        {u.status !== 'BANNED' && (
          <button
            className="bg-red-100 text-red-700 px-4 py-2 rounded"
            onClick={handleBan}
            disabled={isUpdating}
          >
            {banning ? "Processing..." : "Ban User"}
          </button>
        )}
      
        
        {u.status !== 'SUSPENDED' && u.status !== 'BANNED' && (
          <button
            className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded"
            onClick={handleSuspend}
            disabled={isUpdating}
          >
            {suspending ? "Processing..." : "Suspend User"}
          </button>
        )}
        
        {u.status === 'SUSPENDED' && (
          <button
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded"
            onClick={handleUnsuspend}
            disabled={isUpdating}
          >
            {unsuspending ? "Processing..." : "Unsuspend User"}
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
        <h3 className="text-xl font-semibold mb-4">Admin Actions</h3>
        <div className={`transition-all duration-300 ${
          showAllActions ? "max-h-[500px]" : "max-h-[200px]"
        } overflow-hidden`}>
          <ul className="divide-y divide-gray-200">
            {u.actions?.length > 0 ? (
              (showAllActions ? u.actions : u.actions.slice(0, 3)).map((action: any, i: number) => (
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
              ))
            ) : (
              <p className="text-gray-500 py-3">No admin actions yet</p>
            )}
          </ul>
        </div>
        {u.actions?.length > 3 && (
          <button
            onClick={() => setShowAllActions(!showAllActions)}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
          >
            {showAllActions ? 'Show Less' : 'View All Actions'}
          </button>
        )}
      </div>

      {/* Orders Section - Always Visible */}
<div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
  <h3 className="text-xl font-semibold mb-4">Order History</h3>
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
          
          <p className="text-xs text-gray-400 mt-2">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No orders yet.</p>
  )}
  {u.orders?.length > 2 && (
    <button
      onClick={() => setShowAllOrders(!showAllOrders)}
      className="mt-2 text-sm text-blue-500 hover:text-blue-700"
    >
      {showAllOrders ? 'Show Less' : 'View All Orders'}
    </button>
  )}
</div>

{/* Complaints Section - Always Visible */}
<div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
  <h3 className="text-xl font-semibold mb-4">Complaints</h3>
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
  {u.complaints?.length > 2 && (
    <button
      onClick={() => setShowAllComplaints(!showAllComplaints)}
      className="mt-2 text-sm text-blue-500 hover:text-blue-700"
    >
      {showAllComplaints ? 'Show Less' : 'View All Complaints'}
    </button>
  )}
</div>

    </div>
  );
}