import { LuSearch } from "react-icons/lu";

const Report = () => {
    return ( 
        <div className="w-full font-sans">
        <h1 className="font-[400] text-[32px] w-[95%] mx-auto mt-[20px] ">Reports</h1>

        <div className="w-[95%] mx-auto mt-[30vh] ">
            <div className="w-[380px] h-[56px] border-[#D4D3D3] border-[1px] rounded-[10px] flex items-center">
            <LuSearch className="text-[24px] text-[#939090] ml-[15px]" />
            <input className="placeholder:text-[16px] ml-[10px] w-[70%] h-[60%] outline-0 placeholder:font-[300] placeholder:text-[#939090] " type="text" placeholder="Search User accounts" />
            </div>
        </div>


    </div>
     );
}
 
export default Report;