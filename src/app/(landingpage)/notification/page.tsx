
const Notification = () => {
    return ( 
        <div className=" min-h-screen bg-gray-100 ">
      
      
<div className="">
    {/* Notifications Section */}
      <div className="max-w-3xl mx-auto  min-h-screen ml-20  ">
        <div className=" pt-30 h-auto ">
<h2 className="text-xl font-semibold font-Merriweather  text-blue-600 mb-4">My Notifications</h2>
        <div className="space-y-4">
          
          <div
  className=" w-[816px] h-[120px] flex items-start justify-between px-4 py-3 rounded-[16px] border bg-[#F5FAFF] border-[#CCE5FF] "
>

              <div className="flex items-start space-x-4">
                <img className="bg-gray-300 w-10 h-10 rounded-full" src="/figma images/Frame 188.png" />
                <div>
                  <p className="text-blue-600 font-medium">Your password has been successfully changed</p>
                  <p className="text-sm text-gray-500 mt-3">December 19, 2022</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-17">30 mins ago</p>
            </div>
        
        </div>
        </div>
        
      </div>

</div>
      

   
    </div>
     );
}
 
export default Notification;