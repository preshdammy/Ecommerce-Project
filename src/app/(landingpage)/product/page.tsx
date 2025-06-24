
const ProductUpload = () => {
    return (  
        <div className="">

            <div className="min-h-screen  py-8 ">
                <div className="w-full mx-auto h-[240vh] bg-gray-100 mb-[-30px]  ">
                  <div className="pt-[200px] ">
                    <h2 className=" font-Merriweather text-[40px] w-[325px] h-[50px] font-medium ml-20 text-[#55A7FF] mb-6 ">
  Upload Products
</h2>

                  </div>

                    <form className="grid grid-cols-1 md:grid-cols-3 px-[90px]">
                        {/* Main Image Upload */}
  {/* Main Image Upload */}
 <div className="md:col-span-2 ">
  <label
    htmlFor="mainImage"
    className="cursor-pointer flex flex-col justify-center items-center  h-[55vh] w-[80%] bg-blue-50 relative rounded-[16px]  hover:bg-blue-100 transition-all duration-200"
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
        className="mx-auto h-10 w-10 mb-3"
      />
      <p className="text-black text-[20px] ">Upload Image</p>
    </div>
  </label>
</div>


             {/* 4 Additional Thumbnails */}
<div className="grid grid-cols-2 ml-[-150px]">
  {Array.from({ length: 4 }).map((_, idx) => (
    <label
      key={idx}
      className="h-[190px] w-[280px] rounded-[16px] flex items-center justify-center bg-white cursor-pointer relative"
    >
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer ml-[-100px] "
      />
      <div className="pointer-events-none text-center  ">
        <img
          src="/figma images/image-03.png"
          alt="Thumbnail placeholder"
          className="h-10 w-10 mx-auto "
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
        <label className=" block text-sm font-medium text-gray-700 mb-1 text-[24px]">Product Name</label>
        <input
          type="text"
          className="bg-white w-[800px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
      <div className="ml-[600px]">
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-3 text-[24px]" >Category</label>
        <input
          type="text"
          className="bg-white w-[584px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
    </div>

     <div className="grid grid-cols-2 gap-4 ml-[30px]">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-[24px]">Product Description</label>
        <input
          type="text"
          className="bg-white w-[800px] h-[176px] rounded-[16px] px-4"
          placeholder=""
          aria-rowspan={3}
        />
      </div>
      <div className="ml-[600px]">
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-3 w-[200px] text-[24px]">Sub-category</label>
        <input
          type="text"
          className="bg-white w-[584px] h-[176px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
    </div>
                          
       <div className="grid grid-cols-3 gap-4 ml-[30px]">
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-[24px] w-[200px]">Color</label>
        <input
          type="text"
          className="bg-white w-[374px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
      <div className="ml-[260px]">
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-3 text-[24px]">stock</label>
        <input
          type="number"
          className="bg-white w-[374px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
      <div className="ml-[520px]">
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-3 text-[24px]">Condition</label>
        <input
          type="text"
          className="bg-white w-[584px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
    </div>
                            
     <div className="grid grid-cols-3 gap-1 ml-[30px]">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-[24px] w-[200px]">Minimum order</label>
        <input
          type="number"
          className="bg-white w-[374px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
      <div className="ml-[260px]">
        <label className="block text-sm font-medium text-gray-700 mb-1 ml-3 text-[24px]">Price</label>
        <input
          type="number"
          className="bg-white w-[374px] h-[88px] rounded-[16px] px-4"
          placeholder=""
        />
      </div>
       <div className="ml-[530px] mt-[16px]">
  <button
    type="submit"
    className="w-[585px] h-[92px] mt-3 rounded-[100px] text-[24px] font-WorkSans font-semibold bg-[#FF4C3B] text-[#FFFFFF] pt-[32px] pb-[32px] pr-[100.5px] pl-[100.5px] hover:bg-red-600 transition-all"
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
