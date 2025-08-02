"use client";

import { useState, useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client";
import Image from "next/image";

const GET_USER_DETAILS = gql`
  query GetUserDetails($userId: ID!) {
    user(id: $userId) {
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
      isBanned
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
        product {
          id
          name
        }
      }
    }
  }
`;

const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      id
      name
      email
    }
  }
`;

interface User {
  name: string | null;
  email: string | null;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [getUserDetails, { data, loading, error }] = useLazyQuery(GET_USER_DETAILS);
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_ALL_USERS, {
    fetchPolicy: "network-only",
  });

  const [banUser] = useMutation(gql`
    mutation BanUser($id: ID!) {
      banUser(id: $id) {
        id
        isBanned
      }
    }
  `);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSelectedUserId(null);
      setUserNotFound(false);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const timeoutId = setTimeout(() => {
      if (!usersData?.allUsers) return;

      const user = usersData.allUsers.find((u: User) =>
        (u.name?.toLowerCase().includes(lowerSearch) ?? false) ||
        (u.email?.toLowerCase().includes(lowerSearch) ?? false)
      );

      if (user?.id) {
        setSelectedUserId(user.id);
        setUserNotFound(false);
        getUserDetails({ variables: { userId: user.id } });
      } else {
        setSelectedUserId(null);
        setUserNotFound(true);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, usersData, getUserDetails]);

  const handleBanUser = async () => {
    if (!selectedUserId) return;
    
    try {
      await banUser({ 
        variables: { id: selectedUserId },
        refetchQueries: [
          { query: GET_USER_DETAILS, variables: { userId: selectedUserId } },
          { query: GET_ALL_USERS }
        ]
      });
      alert(`User ${data?.user?.name || ''} has been banned`);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error banning user: ${error.message}`);
      } else {
        alert("Error banning user: Unknown error");
      }
    }
  };

  const handleSuspendUser = async () => {
    alert(`User ${data?.user?.name || 'Unknown'} suspended.`);
  };

  if (usersLoading) return <div>Loading users...</div>;
  if (usersError) return <div>Error: {usersError.message}</div>;

  return (
    <div className="w-[95%] mx-auto font-sans mt-[20px]">
      <h1 className="font-[400] text-[32px]">Manage Users</h1>

      <div className="w-[380px] h-[56px] border-[#D4D3D3] border-[1px] rounded-[10px] flex items-center mt-[40px]">
        <LuSearch className="text-[24px] text-[#939090] ml-[15px]" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-full outline-none ml-[10px] text-[16px]"
        />
      </div>

      {userNotFound && (
        <p className="mt-4 text-red-500">User not found</p>
      )}

      {loading && <div>Loading user details...</div>}
      {error && <div>Error: {error.message}</div>}

      {selectedUserId && data?.user && (
        <div className="mt-[30px] border-[1px] border-[#CCE5FF] p-4 rounded-[10px]">
          {/* Profile Picture Display */}
          <div className="flex items-center gap-4 mb-4">
            {data.user.profilePicture ? (
              <Image
                src={data.user.profilePicture}
                alt={data.user.name || "User profile"}
                width={80}
                height={80}
                className="rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Photo</span>
              </div>
            )}
            <h2 className="font-[500] text-[24px]">{data.user.name || 'Unknown User'}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Email:</strong> {data.user.email || 'N/A'}</p>
              <p><strong>Address:</strong> {data.user.address || 'N/A'}</p>
              <p><strong>City:</strong> {data.user.city || 'N/A'}</p>
              <p><strong>State:</strong> {data.user.state || 'N/A'}</p>
            </div>
            <div>
              <p><strong>Gender:</strong> {data.user.gender || 'N/A'}</p>
              <p><strong>Date of Birth:</strong> {data.user.dateOfBirth || 'N/A'}</p>
              <p><strong>Wallet Balance:</strong> ₦{(data.user.walletBalance?.balance || 0).toLocaleString()}</p>
              <p><strong>Banned:</strong> {data.user.isBanned ? "Yes" : "No"}</p>
            </div>
          </div>

          <h3 className="font-[500] text-[20px] mt-4">Orders</h3>
          {data.user.orders?.map((order: any) => (
            <div key={order.id} className="ml-4">
              <p>Order ID: {order.id}, Amount: ₦{order.totalAmount.toLocaleString()}, Status: {order.status}, Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              {order.items?.map((item: any, index: number) => (
                <p key={index} className="ml-4">Item: {item.product.name || 'N/A'}, Qty: {item.quantity || 0}, Price: ₦{(item.product.price || 0).toLocaleString()}</p>
              ))}
            </div>
          )) || <p>No orders</p>}

          <h3 className="font-[500] text-[20px] mt-4">Complaints</h3>
          {data.user.complaints?.map((complaint: any) => (
            <p key={complaint.id} className="ml-4">ID: {complaint.id}, Message: {complaint.message || 'N/A'}, Status: {complaint.status || 'N/A'}, Date: {new Date(complaint.createdAt).toLocaleDateString()}</p>
          )) || <p>No complaints</p>}

          <div className="mt-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleBanUser}
              disabled={!selectedUserId || data?.user?.isBanned}
            >
              {data?.user?.isBanned ? 'Already Banned' : 'Ban User'}
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={handleSuspendUser}
            >
              Suspend User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;