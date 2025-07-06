"use client";

import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect } from "react";

type Complaint = {
  id: string;
  message: string;
  createdAt: string;
  user?: { id: string; name: string; email: string };
  vendor?: { id: string; name: string; email: string };
};

const GET_COMPLAINTS = gql`
  query {
    complaints {
      id
      message
      createdAt
      user {
        id
        name
        email
      }
      vendor {
        id
        name
        email
      }
    }
  }
`;

export default function ComplaintsPage() {
  const router = useRouter();
  const token = Cookies.get("admintoken");


useEffect(() => {
  if (!token) {
    router.replace("/adminlogin");
  }
}, [token, router]);


  const { data, loading, error } = useQuery(GET_COMPLAINTS);

  if (loading) return <div>Loading complaints…</div>;
  if (error) {
    console.error(error);
    return <div>Error fetching complaints</div>;
  }

  const complaints: Complaint[] = data.complaints;

  return (
    <div className="w-full font-sans p-8">
      <h1 className="text-3xl mb-6">Complaints</h1>
      {complaints.map((c) => (
        <div
          key={c.id}
          className="mb-4 border p-4 rounded-lg flex justify-between"
        >
          <div className="flex-1">
            <p className="mb-2 text-gray-800">{c.message}</p>
            <p className="text-sm text-gray-500">
              Filed by{" "}
              {c.user
                ? `${c.user.name} (${c.user.email})`
                : c.vendor
                ? `${c.vendor.name} (${c.vendor.email})`
                : "Unknown"}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center">
            <IoIosArrowDown className="text-xl text-gray-400" />
          </div>
        </div>
      ))}
      {complaints.length === 0 && <p>No complaints yet.</p>}
    </div>
  );
}
