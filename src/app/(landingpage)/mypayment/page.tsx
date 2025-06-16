const MyPayment = () => {
    return ( <>

    <div className="max-w-[1536px] bg-[#F8F8F8] pb-[20vh]">

        <div className="w-[85%] font-sans mx-auto pt-[20vh]">

            <div className="w-full">

                <h2 className="font-[400] text-[40px] text-[#55A7FF]">My Payments</h2>
                <div className="w-full mt-[8vh]">

                    <div className="border-[#CCE5FF] w-[85%] mx-auto border-[1px]  rounded-[10px] bg-white py-[30px]">
                        <h2 className="font-[400] text-[24px] text-[#939090] ml-[35px]"> Total Wallet Balance</h2>

                        <p className="text-center text-[#007BFF] text-[64px] mt-[20px] ">₦21,579.24</p>
                        <div className="flex gap-[25px] items-center justify-center mt-[30px]">
                            <button className="bg-[#FF4C3B] border-[4px] border-[#F8F8F8]  font-[600] text-[24px] py-[20px] px-[56px] rounded-[60px]">Fund Wallet</button>
                            <button className="border-[#FF4C3B] border-[4px] font-[600] text-[24px] py-[20px] px-[56px] rounded-[60px]">Withdraw Funds</button>
                        </div>
                    </div>


                </div>

            </div>

            <div className="w-full mt-[20vh]">
                <h2 className="text-[#939090] font-[600] text-[24px]">Payment History</h2>

                <div className="w-full flex justify-between mt-[5vh]">
                    <div className="w-[47%] border-[1px] border-[#007BFF] pb-[10vh] rounded-[15px]">

                        <div className="h-[95px] bg-[#007BFF] flex items-center rounded-t-[15px]">
                            <span className="font-[600] text-[24px] text-white ml-[20px] ">My spending history</span>
                        </div>

                        <div className="w-full mt-[8vh] h-[480px] overflow-y-auto ">
                       <GroceryShoppingDiv/>
                       <GroceryShoppingDiv/>
                       <GroceryShoppingDiv/>
                       <GroceryShoppingDiv/>
                       <GroceryShoppingDiv/>
                       <GroceryShoppingDiv/>

                        </div>

                    </div>

                    <div className="w-[47%] border-[1px] border-[#007BFF] pb-[10vh] rounded-[15px]">

                    <div className="h-[95px] bg-[#007BFF] flex items-center rounded-t-[15px]">
                        <span className="font-[600] text-[24px] text-white ml-[20px] ">My spending history</span>
                    </div>

                    <div className="w-full mt-[8vh] h-[480px] overflow-y-auto ">
                    <GroceryShoppingDiv/>
                    <GroceryShoppingDiv/>
                    <GroceryShoppingDiv/>
                    <GroceryShoppingDiv/>
                    <GroceryShoppingDiv/>
                    <GroceryShoppingDiv/>

                    </div>

                    </div>

                </div>

            </div>



        </div>

    </div>
    
    
    
    </> );
}
 
export default MyPayment;



export const  GroceryShoppingDiv = () => {
    return ( 
        <div className="flex items-center justify-between w-[85%] mx-auto border-b-[1px] border-[#D9D9D9] py-[5px]">
        <div className="flex items-center gap-[10px]">
            <div className="w-[82px] h-[82px] bg-[#D9D9D9] rounded-[50%]"></div>
            <div>
                <p className="text-[#55A7FF] font-[600] text-[16px]">Grocery Shopping</p>
                <p className="text-[#939090] font-[400] text-[16px]">16th Nov. 2022</p>
            </div>
        </div>

        <div>
            <span className="font-[600] text-[20px]">₦9,480.00</span>
        </div>
    </div>
     );
}
 
