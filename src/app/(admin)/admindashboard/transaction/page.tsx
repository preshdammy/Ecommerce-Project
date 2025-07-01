import { LuSearch } from "react-icons/lu";

const Transactions  = () => {

    return ( 
        <div className="w-full font-sans">
            <h1 className="font-[400] text-[32px] w-[95%] mx-auto mt-[20px] ">Transactions</h1>
            

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
                    <p className="text-[#939090] font-[400] text-[16px] mt-[13px] ml-[20px]">Admin users</p>
                    <h2 className="text-[#007BFF] font-[500] text-[40px] text-center">8</h2>
                </div>
            </div>

            <div className="w-[95%] mx-auto mt-[10vh] ">
                <div className="w-[380px] h-[56px] border-[#D4D3D3] border-[1px] rounded-[10px] flex items-center">
                <LuSearch className="text-[24px] text-[#939090] ml-[15px]" />
                <input className="placeholder:text-[16px] ml-[10px] w-[70%] h-[60%] outline-0 placeholder:font-[300] placeholder:text-[#939090] " type="text" placeholder="Search User accounts" />
                </div>
            </div>

        </div>
    );
}

export default Transactions;