import Headers from "../components/header/index"
import Footer from "../components/footer/index"

const ProductUpload = () => {
    return (  
        <div>
            <Headers/>

            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-5xl mx-auto bg-white p-6 rounded-md shadow-sm">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-6">Upload Products</h2>

                    <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Image Upload */}
                        <div className="md:col-span-2">
                            <label htmlFor="mainImage" className="cursor-pointer border-2 border-blue-400 border-dashed rounded-md flex justify-center items-center h-48 bg-blue-50 relative">
                                <input
                                    id="mainImage"
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="text-center text-gray-500 pointer-events-none">
                                    <svg
                                        className="mx-auto h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a1 1 0 001 1h3m10-2a1 1 0 001-1v-1m0-4a4 4 0 00-8 0m8 0a4 4 0 01-8 0m0 0V4m0 12H5a1 1 0 01-1-1v-1" />
                                    </svg>
                                    <p className="mt-2 text-sm">Upload Image</p>
                                </div>
                            </label>
                        </div>

                        {/* 4 Additional Thumbnails */}
                        <div className="grid grid-cols-2 gap-2">
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <label key={idx} className="h-20 w-full border border-gray-300 rounded-md flex items-center justify-center bg-gray-100 cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <svg className="h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
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

            <Footer/>
        </div>
    );
}
 
export default ProductUpload;
