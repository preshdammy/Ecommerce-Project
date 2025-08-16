
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

  if (loading) return <div className="mt-10 text-center">Loading...</div>;
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
    <div className="w-[90%] mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      <input
        placeholder="Search users..."
        className="mb-6 w-full px-4 py-2 rounded bg-white shadow"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500">No users found.</div>
      ) : (
        <div className="grid gap-4 h-screen overflow-hidden overflow-y-scroll">
          {filtered.map((user: any) => (
            <Link href={`/admin/admindashboard/users/${user.id}`} key={user.id}>
              <div className="p-4 bg-white rounded shadow hover:bg-gray-50 transition cursor-pointer">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="flex justify-between mt-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded inline-block ${
                    user.status === 'BANNED' ? "bg-red-100 text-red-800" : 
                    user.status === 'SUSPENDED' ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {user.status}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
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