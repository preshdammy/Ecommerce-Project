
const ProductUpload = () => {
    return (  
        <div>

            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-5xl mx-auto bg-white p-6 rounded-md shadow-sm">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-6">Upload Products</h2>

                    <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Image Upload */}
  {/* Main Image Upload */}
 <div className="md:col-span-2">
  <label
    htmlFor="mainImage"
    className="cursor-pointer flex flex-col justify-center items-center h-48 bg-blue-50 relative rounded-xl  hover:bg-blue-100 transition-all duration-200"
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
      className="h-20 w-full border border-gray-300 rounded-md flex items-center justify-center bg-gray-100 cursor-pointer relative"
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
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <input type="text" placeholder="Product Name" className="input-field" />
                            <input type="text" placeholder="Category" className="input-field" />
                            <textarea placeholder="Product Description" rows={3} className="input-field md:col-span-1" />
                            <input type="text" placeholder="Sub-category" className="input-field" />
                            <input type="text" placeholder="Color" className="input-field" />
                            <input type="text" placeholder="Condition" className="input-field" />
                            <input type="number" placeholder="Minimum order" className="input-field" />
                            <input type="number" placeholder="Price" className="input-field" />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-3 mt-6">
                            <button
                                type="submit"
                                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-all"
                            >
                                Upload product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
 
export default ProductUpload;
