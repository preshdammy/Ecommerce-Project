"use client";

import { LuSearch } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const GET_DASHBOARD_DATA = gql`
  query GetDashboardAndProducts($limit: Int!, $offset: Int!) {
    adminProfile {
      name
      email
    }
    getDashboardMetrics {
      totalUsers
      totalVendors
      totalOrders
      totalSales
    }
    allProducts(limit: $limit, offset: $offset) {
      id
      name
      price
    }
    allOrders {
      id
      status
      totalAmount
    }
  }
`;

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  subCategory: string;
  color: string;
  condition: string;
  minimumOrder: number;
  stock: number;
  price: number;
  images: string[];
};


const AdminDashboard = () => {
  const { data, loading, error } = useQuery(GET_DASHBOARD_DATA, {
    variables: { limit: 20, offset: 0 },
    fetchPolicy: "network-only", // always re-fetch
  ssr: false, 
  });

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const admin = data?.adminProfile;
  const metrics = data?.getDashboardMetrics || {};
  const products = data?.allProducts || [];
  const orders = data?.allOrders || [];

  return (
    <div className="w-full font-sans">
      <h1 className="font-[400] text-[32px] w-[95%] mx-auto mt-[20px]">
        Welcome, {admin?.name}
      </h1>

      <div className="w-[95%] mx-auto flex flex-wrap gap-4 mt-[40px]">
        <MetricCard label="Active Users" value={metrics.totalUsers} />
        <MetricCard label="Total Products" value={products.length} />
        <MetricCard label="Total Vendors" value={metrics.totalVendors} />
        <MetricCard label="Total Orders" value={orders.length} />
      </div>

      <div className="w-[95%] mx-auto mt-[10vh]">
        <div className="w-[380px] h-[56px] border-[#D4D3D3] border-[1px] rounded-[10px] flex items-center">
          <LuSearch className="text-[24px] text-[#939090] ml-[15px]" />
          <input
            className="placeholder:text-[16px] ml-[10px] w-[70%] h-[60%] outline-0 placeholder:font-[300] placeholder:text-[#939090]"
            type="text"
            placeholder="Search User accounts"
          />
        </div>
      </div>

      <div className="w-[95%] mx-auto mt-[30px] flex flex-wrap gap-4">
        {products.slice(0, 3).map((product: Product) => (
          <div
            key={product.id}
            className="border-[#CCE5FF] border-[1px] h-[215px] w-[235px] rounded-[10px] flex items-center justify-center"
          >
            <p className="text-center">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const MetricCard = ({ label, value }: { label: string; value: number }) => (
  <div className="w-[19%] min-w-[180px] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
    <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">
      {label}
    </p>
    <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">{value}</h2>
  </div>
);

export default AdminDashboard;
