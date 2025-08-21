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

<<<<<<< HEAD

const  Sidebar  = () => {
    return ( 

    <div className="w-[25%] font-sans min-h-screen flex flex-col justify-between py-[20px] items-center">
        <div className="flex flex-col gap-[4vh]">
            <div className="flex flex-col gap-[10px] items-center">
            <Image className="h-[57px] w-[220px]" src={timeShoppyLogo} alt="" />
            <h2>Admin Dashboard</h2>
            </div>

            <div className="w-[100%] flex flex-col pl-[30px] gap-[25px]">
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
                    <FaShop  className="text-[26px]" />
                    <Link href="/admin/admindashboard/vendors" className="text-[24px] font-[300]">Vendors</Link>
                </div>
                <div className="flex gap-[16px] items-center">
                    <CiUser  className="text-[26px]" />
                    <Link href="/admin/admindashboard/users" className="text-[24px] font-[300]">Users</Link>
                </div>

                <div className="flex gap-[16px] items-center">
                    <AiOutlineProduct  className="text-[26px]" />
                    <Link href="/admin/admindashboard/products" className="text-[24px] font-[300]">Products</Link>
                </div>
            </div>

=======
const Sidebar = ({ closeSidebar }: { closeSidebar?: () => void }) => {
  return (
    <div className="w-full font-sans min-h-screen flex flex-col justify-between py-5 items-center bg-white border-r border-gray-200">
      <div className="flex flex-col gap-4 justify-center items-center w-full px-4">
        <div className="flex flex-col gap-2 items-center w-full py-4 border-b border-gray-200">
          <Image 
            className="h-[57px] w-[220px]" 
            src={timeShoppyLogo} 
            alt="TimeShoppy Logo" 
          />
          <h2 className="text-lg font-medium">Admin Dashboard</h2>
>>>>>>> ead4fdcfbb6995e8b0afbd9c62767b11b6986646
        </div>

        <div className="w-full flex flex-col gap-2">
          <Link 
            href="/admin/admindashboard" 
            className="flex gap-3 items-center p-3 rounded-lg hover:bg-gray-100"
            onClick={closeSidebar}
          >
            <PiHouse className="text-xl" />
            <span className="text-lg font-light">Dashboard</span>
          </Link>

          <Link 
            href="/admin/admindashboard/reports" 
            className="flex gap-3 items-center p-3 rounded-lg hover:bg-gray-100"
            onClick={closeSidebar}
          >
            <IoWarningOutline className="text-xl" />
            <span className="text-lg font-light">Reports</span>
          </Link>

          <Link 
            href="/admin/admindashboard/complaints" 
            className="flex gap-3 items-center p-3 rounded-lg hover:bg-gray-100"
            onClick={closeSidebar}
          >
            <BsPeople className="text-xl" />
            <span className="text-lg font-light">Complaints</span>
          </Link>

          <Link 
            href="/admin/admindashboard/orders" 
            className="flex gap-3 items-center p-3 rounded-lg hover:bg-gray-100"
            onClick={closeSidebar}
          >
            <CiShoppingBasket className="text-xl" />
            <span className="text-lg font-light">Orders</span>
          </Link>

          <Link 
            href="/admin/admindashboard/users" 
            className="flex gap-3 items-center p-3 rounded-lg hover:bg-gray-100"
            onClick={closeSidebar}
          >
            <CiUser className="text-xl" />
            <span className="text-lg font-light">Users</span>
          </Link>

          <Link 
            href="/admin/admindashboard/products" 
            className="flex gap-3 items-center p-3 rounded-lg hover:bg-gray-100"
            onClick={closeSidebar}
          >
            <AiOutlineProduct className="text-xl" />
            <span className="text-lg font-light">Products</span>
          </Link>

          <Link 
            href="/admin/admindashboard/vendors" 
            className="flex gap-3 items-center p-3 rounded-lg hover:bg-gray-100"
            onClick={closeSidebar}
          >
            <FaShop className="text-xl" />
            <span className="text-lg font-light">Vendors</span>
          </Link>
        </div>
      </div>

      <div className="w-full px-4">
        <button className="w-full font-semibold text-lg py-4 px-6 bg-[#FF4C3B] rounded-lg text-white hover:bg-[#e04435] transition-colors">
          Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;