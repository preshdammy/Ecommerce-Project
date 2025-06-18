
const Notification = () => {
    return ( 
        <div className=" min-h-screen">
      
      
<div className="mt-20">
    {/* Notifications Section */}
      <main className="max-w-3xl mx-auto p-4 mt-10 bg-white ">
        <h2 className="text-xl font-semibold font-Merriweather text-blue-600 mb-4">My Notifications</h2>
        <div className="space-y-4">
          
            <div
             
              className="flex items-start justify-between border px-4 py-3 rounded-md border-gray-400 bg-cyan-50"
            >
              <div className="flex items-start space-x-4">
                <img className="bg-gray-300 w-10 h-10 rounded-full" src="/figma images/Frame 188.png" />
                <div>
                  <p className="text-blue-600 font-medium">Your password has been successfully changed</p>
                  <p className="text-sm text-gray-500">December 19, 2022</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-11">30 mins ago</p>
            </div>
        
        </div>
      </main>

</div>
      {/* Notifications Section
      <main className="max-w-3xl mx-auto p-4 mt-10 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">My Notifications</h2>
        <div className="space-y-4">
          
            <div
             
              className="flex items-start justify-between border px-4 py-3 rounded-md border-purple-600"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-gray-300 w-10 h-10 rounded-full" />
                <div>
                  <p className="text-blue-600 font-medium"></p>
                  <p className="text-sm text-gray-500"></p>
                </div>
              </div>
              <p className="text-sm text-gray-400"></p>
            </div>
        
        </div>
      </main> */}

   
    </div>
     );
}
 
export default Notification;