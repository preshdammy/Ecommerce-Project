"use client";

import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Complaint = {
  id: string;
  message: string;
  createdAt: string;
  user?: { id: string; name: string; email: string };
  vendor?: { id: string; name: string; email: string };
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = Cookies.get("token");
      if (!token) return router.replace("/adminlogin");

      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              complaints {
                id
                message
                createdAt
                user { id name email }
                vendor { id name email }
              }
            }
          `,
        }),
      });

      const { data, errors } = await res.json();
      if (errors) {
        console.error(errors);
        return;
      }

      setComplaints(data.complaints);
      setLoading(false);
    };

    fetchComplaints();
  }, [router]);

  if (loading) return <div>Loading complaints…</div>;

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
