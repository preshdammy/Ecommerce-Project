import { LuSearch } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";

const Compliants = () => {

    return ( 
        <div className="w-full font-sans">
            <h1 className="font-[400] text-[32px] w-[95%] mx-auto mt-[20px] ">Compliants</h1>

            <div className="w-[95%] mx-auto mt-[5vh] border-[#D4D3D3] border-[1px] h-[100px] justify-center  items-center flex">

                <p className=" w-[85%] mx">
                I tried logging into my account, but they were telling me Error 898. I have no idea what that means and I was supposed to deliver an order in the next 24 hours. Please I need your assistance.
                </p>
               
               <div className="w-[10%]">
               <IoIosArrowDown />
               </div>
                

            </div>
            


        </div>
    );
}

export default Compliants;