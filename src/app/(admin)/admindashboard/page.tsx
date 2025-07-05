"use client";

import { LuSearch } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

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
  }`
;

const AdminDashboard = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

 useEffect(() => {
  const cookieToken = Cookies.get("admintoken");
  if (!cookieToken) {
    router.replace("/adminlogin");
    return;
  }
  setToken(cookieToken);
 }, [router]);


 const { data, loading, error } = useQuery(GET_DASHBOARD_DATA, {
  skip: !token, // prevent query from running until token is set
  variables: { limit: 20, offset: 0 },
  context: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
  onError: (err) => {
    console.error("GraphQL Error:", err.message);
    if (err.message.includes("Unauthorized")) {
      Cookies.remove("admintoken");
      router.replace("/adminlogin");
    }
  },
});



  if (loading) return <div>Loading...</div>;
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

      <div className="w-[95%] mx-auto flex items-center justify-between mt-[40px]">
        <div className="w-[19%] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
          <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">
            Active users
          </p>
          <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">
            {metrics.totalUsers}
          </h2>
        </div>

        <div className="w-[19%] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
          <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">
            Total Products
          </p>
          <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">
            {products.length}
          </h2>
        </div>

        <div className="w-[19%] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
          <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">
            Total Vendors
          </p>
          <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">
            {metrics.totalVendors}
          </h2>
        </div>

        <div className="w-[19%] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
          <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">
            Total Orders
          </p>
          <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">
            {orders.length}
          </h2>
        </div>
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

      <div className="w-[95%] mx-auto mt-[30px] flex justify-between">
        <div className="border-[#CCE5FF] border-[1px] h-[215px] w-[235px] rounded-[10px]"></div>
        <div className="border-[#CCE5FF] border-[1px] h-[215px] w-[235px] rounded-[10px]"></div>
        <div className="border-[#CCE5FF] border-[1px] h-[215px] w-[235px] rounded-[10px]"></div>
      </div>
    </div>
  );
};

export default AdminDashboard;