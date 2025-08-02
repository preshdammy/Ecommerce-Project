import Image from "next/image";
import timeShoppyLogo from "../../../../../public/figma images/WhatsApp Image 2022-11-27 at 14.35 1.png";
import { PiHouse } from "react-icons/pi";
import { IoWarningOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";
import { GoFileCode } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { AiOutlineProduct } from "react-icons/ai";
import { FaShop } from "react-icons/fa6";
import { CiShoppingBasket } from "react-icons/ci";
import Link from "next/link";


const  Sidebar  = () => {
    return ( 

    <div className="w-[25%] font-sans min-h-screen flex flex-col justify-between py-[20px] items-center">
        <div className="flex flex-col gap-[8vh]">
            <div className="flex flex-col gap-[10px] items-center">
            <Image className="h-[57px] w-[220px]" src={timeShoppyLogo} alt="" />
            <h2>Admin Dashboard</h2>
            </div>

            <div className="w-[100%] flex flex-col pl-[30px] gap-[30px]">
                <div className="flex gap-[16px] items-center">
                    <PiHouse className="text-[26px]" />
                    <Link href="/admin/admindashboard" className="text-[24px] font-[300] ">Dashboard</Link>
                </div>

                <div className="flex gap-[16px] items-center">
                    <IoWarningOutline  className="text-[26px]" />
                    <Link href="/admin/admindashboard/reports" className="text-[24px] font-[300]">Reports</Link>
                </div>

                <div className="flex gap-[16px] items-center">
                    <BsPeople className="text-[26px]" />
                    <Link  href="/admin/admindashboard/complaints" className="text-[24px] font-[300]">Complaints</Link>
                </div>

                <div className="flex gap-[16px] items-center">
                <CiShoppingBasket  className="text-[26px]" />
                    <Link href="/admin/admindashboard/orders" className="text-[24px] font-[300]">Orders</Link>
                </div>

                <div className="flex gap-[16px] items-center">
                    <CiUser  className="text-[26px]" />
                    <Link href="/admin/admindashboard/users" className="text-[24px] font-[300]">Users</Link>
                </div>

                <div className="flex gap-[16px] items-center">
                    <AiOutlineProduct  className="text-[26px]" />
                    <Link href="/admin/admindashboard/products" className="text-[24px] font-[300]">Products</Link>
                </div>
                <div className="flex gap-[16px] items-center">
                    <FaShop  className="text-[26px]" />
                    <Link href="/admin/admindashboard/vendors" className="text-[24px] font-[300]">Vendors</Link>
                </div>
            </div>

        </div>

        <div>
            <button className="font-[600] text-[24px] py-[16px] px-[100px] bg-[#FF4C3B] rounded-[10px] text-white">Log out</button>
        </div>
        </div>
     );
}
 
export default Sidebar  ;