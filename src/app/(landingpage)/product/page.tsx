
const ProductUpload = () => {
    return (  
        <div className="">

            <div className="min-h-screen  py-8 ">
                <div className="w-full mx-auto h-[190vh] bg-gray-100 mb-[-30px]  ">
                    <h2 className=" font-Merriweather text-2xl font-medium ml-18 text-blue-600 mb-6 ">
  Upload Products
</h2>

                    <form className="grid grid-cols-1 md:grid-cols-3 px-[80px]">
                        {/* Main Image Upload */}
  {/* Main Image Upload */}
 <div className="md:col-span-2">
  <label
    htmlFor="mainImage"
    className="cursor-pointer flex flex-col justify-center items-center  h-[360px] w-[696px] bg-blue-50 relative rounded-[16px]  hover:bg-blue-100 transition-all duration-200"
  >
    <input
      id="mainImage"
      type="file"
      className="absolute inset-0 opacity-0 cursor-pointer"
    />
    <div className="text-center text-gray-500 pointer-events-none">
      <img
        src="/figma images/share.png"
        alt=""
        className="mx-auto h-8 w-8 mb-3"
      />
      <p className="text-black ">Upload Image</p>
    </div>
  </label>
</div>


             {/* 4 Additional Thumbnails */}
<div className="grid grid-cols-2 gap-2">
  {Array.from({ length: 4 }).map((_, idx) => (
    <label
      key={idx}
      className="h-[152px] w-[184px] rounded-[16px] flex items-center justify-center bg-white cursor-pointer relative"
    >
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <div className="pointer-events-none text-center">
        <img
          src="/figma images/image-03.png"
          alt="Thumbnail placeholder"
          className="h-6 w-6 mx-auto"
        />
      </div>
    </label>
  ))}
</div>


                        {/* Input Fields */}
                        <div className=" ml-[-20px]  mt-4 ">
                          <form action="" className="space-y-4">
                         <div className="grid grid-cols-2 gap-4 ml-[30px]">
      <div>
        <label className=" block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input
          type="text"
          className="bg-white w-[696px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
      <div className="ml-[560px]">
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">Category</label>
        <input
          type="text"
          className="bg-white w-[384px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
    </div>

     <div className="grid grid-cols-2 gap-4 ml-[30px]">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
        <input
          type="text"
          className="bg-white w-[696px] h-[176px] rounded-[16px] px-4"
          placeholder=""
          aria-rowspan={3}
        />
      </div>
      <div className="ml-[560px]">
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-3 w-[100px]">Sub-category</label>
        <input
          type="text"
          className="bg-white w-[384px] h-[176px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
    </div>
                          
       <div className="grid grid-cols-2 gap-4 ml-[30px]">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <input
          type="text"
          className="bg-white w-[696px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
      <div className="ml-[560px]">
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">Condition</label>
        <input
          type="text"
          className="bg-white w-[384px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
    </div>
                            
     <div className="grid grid-cols-3 gap-1 ml-[30px]">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum order</label>
        <input
          type="number"
          className="bg-white w-[304px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
      <div className="ml-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-3">Price</label>
        <input
          type="number"
          className="bg-white w-[304px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
       <div className="ml-[500px] mt-[16px]">
  <button
    type="submit"
    className="w-[385px] h-[92px] rounded-[100px] bg-red-500 text-white pt-[32px] pb-[32px] pr-[100.5px] pl-[100.5px] hover:bg-red-600 transition-all"
  >
    Upload product
  </button>
</div>

    </div>
                          </form>
                          
                        </div>

                       
                       
                    </form>
                </div>
            </div>
        </div>
    );
}
 
export default ProductUpload;
