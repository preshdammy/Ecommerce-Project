
const vendor = () => {
    return ( 
        <div className="bg-gray-100 min-h-screen">
      <section className="bg-blue-50 py-10 text-center">
        <div className="max-w-xl mx-auto  bg-blue">
          <div className="w-24 h-24 mx-auto bg-blue-600 rounded-full border border-blue-600"> 

            
            <img className="w-23.5 h-23.5 mx-auto bg-gray-300 rounded-full" src="/figma images/soothie.jpg" alt="" />
          </div>
          <h2 className="text-2xl font-semibold text-blue-800 mt-4">Soothe & Tie</h2>
          <p className="text-gray-600 mt-2">We design comfortable and elegant suits to suit your everyday mood and event.</p>
          <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-md">
            Add New Product
          </button>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h3 className="text-xl font-semibold mb-6">My Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  
            <div className="bg-white shadow-md rounded-md p-4">
              <img  className="w-full h-40 object-cover rounded" />
              <h4 className="text-lg font-medium mt-2"></h4>
              <p className="text-blue-600 font-semibold"></p>
              <p className="text-sm text-gray-500 mt-1"></p>
            </div>
          
        </div>
      </section>
    </div>
     );
}
 
 
export default vendor;