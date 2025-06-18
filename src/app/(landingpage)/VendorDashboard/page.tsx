
const vendor = () => {
    return ( 
        <div className="bg-gray-100 min-h-screen">
      <section className="bg-blue-50 py-10 text-center">
        <div className="max-w-xl mx-auto  bg-blue">


            
            <img className="w-23.5 h-23.5 mx-auto " src="/figma images/Group 209.png" alt="" />
          
          <h2 className="text-[40px] leading-[100%] tracking-[0] font-bold font-Merriweather text-blue-800 mt-4">Soothe & Tie</h2>

          <p className="text-gray-600 mt-2">We design and deliver high quality luxury suits to people that want that easy life and comfort..</p>
          <p className="w-453px h-19px mt-2">Herbert Macaulay way, Off Ikeja Road. Lagos</p>
          <div className="mt-10 mx-auto space-x-15 flex ml-40">
      <img src="/figma images/Frame 240 (1).png" alt="message" />
      <img src="/figma images/Frame 241.png" alt="" />
          </div>
          <button className="mt-6 bg-red-600 text-white px-6 py-2 rounded-full">
            Add New Product
          </button>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h3 className="text-xl font-semibold mb-6">My Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  
            <div className="bg-white shadow-md rounded-md p-4">
              <img  className="w-full h-40 object-cover rounded" src="/figma images/Frame 89.png"/>
              <h4 className="text-lg font-medium mt-2">NGN 65,000</h4>
              <p className=" font-semibold">Exclusive Office table</p>
              <p className="text-sm text-gray-500 mt-1">Hardwood executive office table
with three drawers to place an...</p>
<div className="text-sm mt-3 flex space-x-2">
  <img src="/figma images/map-pin.png" alt="" />
<p className=" text-gray-500">Lagos, Gbagada</p>
</div>
            </div>
          
        </div>
      </section>
    </div>
     );
}
 
 
export default vendor;