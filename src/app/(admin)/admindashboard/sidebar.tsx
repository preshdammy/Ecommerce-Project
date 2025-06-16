import Image from "next/image";
import timeShoppyLogo from "../../../../public/figma images/WhatsApp Image 2022-11-27 at 14.35 1.png";
import { PiHouse } from "react-icons/pi";
import { IoWarningOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";
import { GoFileCode } from "react-icons/go";

const  Sidebar  = () => {
    return ( 

    <div className="w-[25%] font-sans min-h-screen flex flex-col justify-between py-[20px] items-center">
        <div className="flex flex-col gap-[8vh]">
            <div className="flex flex-col gap-[10px] items-center">
            <Image className="h-[57px] w-[220px]" src={timeShoppyLogo} alt="" />
            <h2>Admin Dashboard</h2>
            </div>

            <div className="w-[100%] flex flex-col pl-[30px] gap-[25px]">
                <div className="flex gap-[16px] items-center">
                    <PiHouse className="text-[26px]" />
                    <button className="text-[24px] font-[300] ">Dashboard</button>
                </div>

                <div className="flex gap-[16px] items-center">
                    <IoWarningOutline  className="text-[26px]" />
                    <button className="text-[24px] font-[300]">Reports</button>
                </div>

                <div className="flex gap-[16px] items-center">
                    <BsPeople className="text-[26px]" />
                    <button className="text-[24px] font-[300]">Compliants</button>
                </div>

                <div className="flex gap-[16px] items-center">
                    <GoFileCode  className="text-[26px]" />
                    <button className="text-[24px] font-[300]">Transactions</button>
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