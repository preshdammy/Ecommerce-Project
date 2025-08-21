"use client";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";

const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      id
      name
      email
      status  
      walletBalance
      createdAt
    }
  }
`;

export default function UserList() {
  const { data, loading, error } = useQuery(GET_ALL_USERS);
  const [search, setSearch] = useState("");

  if (loading) {
    return (
      <div className="flex justify-center h-[50vh] items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading users...</p>
      </div>
    );
  }
  if (error) {
    console.error("GraphQL error:", error);
    return <div className="mt-10 text-center text-red-500">Failed to load users</div>;
  }

  const users = data?.allUsers || [];

  const filtered = users.filter((u: any) =>
    (u.name?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
    (u.email?.toLowerCase() ?? "").includes(search.toLowerCase())
  );

  return (
    <div className="w-full mx-auto p-4 mt-4 md:mt-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">All Users</h2>

      <input
        placeholder="Search users..."
        className="mb-4 md:mb-6 w-full px-3 py-2 md:px-4 md:py-2 rounded bg-white shadow"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500">No users found.</div>
      ) : (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-6 flex flex-col"> 
            {filtered.map((user: any) => (
              <Link href={`/admin/admindashboard/users/${user.id}`} key={user.id}>
                <div className="p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition cursor-pointer flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      user.status === 'BANNED' ? "bg-red-100 text-red-800" : 
                      user.status === 'SUSPENDED' ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {user.status}
                    </span>
                    <span className="text-xs text-gray-500 hidden md:block">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}