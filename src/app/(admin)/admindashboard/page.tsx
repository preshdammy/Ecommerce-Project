"use client";

import { LuSearch } from "react-icons/lu";
import { useEffect, useState } from 'react';
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";


const AdminDashboard = () => {
     const router = useRouter()
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState([]);
 const [orders, setOrders] = useState([]);

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalVendors: 0
  });

  
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        router.replace("/adminlogin");
        return;
      }
        const limit = 20
        const offset = 0
      const timestamp = Date.now();
      
      const profileRes = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
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
    `,
    variables: { limit, offset },
  }),
})

      const result = await profileRes.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setAdmin(result.data.adminProfile);
      setMetrics({
        totalUsers: result.data.getDashboardMetrics.totalUsers,
        totalVendors: result.data.getDashboardMetrics.totalVendors,
        totalProducts: result.data.getDashboardMetrics.totalOrders || 0,
        
      });
      setProducts(result.data.allProducts);
      setOrders(result.data.allOrders);

    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
      if (err.message.includes("Unauthorized")) {
        Cookies.remove("token");
        router.replace("/adminlogin");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  
  const interval = setInterval(fetchData, 30000); 
  
  return () => clearInterval(interval);
}, [router]); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!admin) return <div>No admin data found</div>;

    return ( 
        <div className="w-full font-sans">
            <h1 className="font-[400] text-[32px] w-[95%] mx-auto mt-[20px] ">
                 {loading ? 'Loading...' : ` Welcome, ${admin.name}`}
            </h1>
            

            <div className=" w-[95%] mx-auto flex items-center justify-between mt-[40px]">
                <div className="w-[19%] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
                    <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">Active users</p>
                    <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">{metrics.totalUsers}</h2>
                </div>

                <div className="w-[19%] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
                    <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">Total Products</p>
                    <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">{products.length}</h2>
                </div>

                <div className="w-[19%] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
                    <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">Total Vendors</p>
                    <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">{metrics.totalVendors}</h2>
                </div>

                <div className="w-[19%] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
                    <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">Total Orders</p>
                    <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">{orders.length}</h2>
                </div>
                </div>

            <div className="w-[95%] mx-auto mt-[10vh] ">
                <div className="w-[380px] h-[56px] border-[#D4D3D3] border-[1px] rounded-[10px] flex items-center">
                <LuSearch className="text-[24px] text-[#939090] ml-[15px]" />
                <input className="placeholder:text-[16px] ml-[10px] w-[70%] h-[60%] outline-0 placeholder:font-[300] placeholder:text-[#939090] " type="text" placeholder="Search User accounts" />
                </div>
            </div>

            <div className="w-[95%] mx-auto mt-[30px] flex justify-between">

                <div className="  border-[#CCE5FF] border-[1px] h-[215px] w-[235px] rounded-[10px]">

                </div>
                
                <div className="  border-[#CCE5FF] border-[1px] h-[215px] w-[235px] rounded-[10px]">

                </div>
                
                <div className="  border-[#CCE5FF] border-[1px] h-[215px] w-[235px] rounded-[10px]">

                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;