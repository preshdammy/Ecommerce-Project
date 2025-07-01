"use client";

import { LuSearch } from "react-icons/lu";
import { useEffect, useState } from 'react';


const AdminDashboard = () => {
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAdmin = async () => {
   
    const stored = localStorage.getItem('adminData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAdmin(parsed); 
    }

  
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              adminProfile {
                name
                email
              }
            }
          `,
        }),
      });

      const result = await res.json();

      if (result.data?.adminProfile) {
        setAdmin(result.data.adminProfile); 
      }

    } catch (error) {
      console.error('❌ Error fetching admin profile:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchAdmin();
}, []);

    return ( 
        <div className="w-full font-sans">
            <h1 className="font-[400] text-[32px] w-[95%] mx-auto mt-[20px] ">
                 {loading ? 'Loading...' : `Welcome, Admin ${admin?.name}`}
            </h1>
            

            <div className=" w-[95%] mx-auto flex items-center justify-between mt-[40px]">
                <div className="w-[32%] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
                    <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">Active users</p>
                    <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">14,876</h2>
                </div>

                <div className="w-[32%] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
                    <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">Inactive users</p>
                    <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">26</h2>
                </div>

                <div className="w-[32%] border-[1px] border-[#D4D3D3] rounded-[5px] h-[140px]">
                    <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">Total Vendors</p>
                    <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">8</h2>
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