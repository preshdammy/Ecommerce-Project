import React from 'react';
import Image from 'next/image';
import share from '../../../../public/figma images/share.png'
import image from '../../../../public/figma images/image-03.png';

const ProductUpload = () => {
  return (
    <>
    <div className="">
      <div className="min-h-screen py-8 bg-gray-100">
        <div className="w-full mx-auto min-h-[240vh] ">
          <div className="pt-36 px-6 sm:px-8 md:px-20 lg:px-32">
            <h2 className="font-Merriweather text-3xl sm:text-4xl font-medium text-[#55A7FF] mb-6 mt-[-80px]">
              Upload Products
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Image Upload */}
              <div className="md:col-span-2">
                <label
                  htmlFor="mainImage"
                  className="cursor-pointer flex flex-col justify-center items-center h-[365px] md:h-[265px] lg:h-[365px] w-full bg-blue-50 rounded-[16px] hover:bg-blue-100 transition-all duration-200"
                >
                  <input
                    id="mainImage"
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="text-center text-gray-500 pointer-events-none">
                    <Image
                      src={share}
                      alt=""
                      className="mx-auto h-10 w-10 mb-3"
                    />
                    <p className="text-black text-lg">Upload Image</p>
                  </div>
                </label>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <label
                    key={idx}
                    className="h-[150px] sm:h-[175px] md:h-[125px] lg:h-[175px]  w-full rounded-[16px] flex items-center justify-center bg-white cursor-pointer relative"
                  >
                    <div
                  
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    ></div>
                    <div className="pointer-events-none text-center">
                      <Image
                        src={image}
                        alt="Thumbnail"
                        className="h-10 w-10 mx-auto"
                      />
                    </div>
                  </label>
                ))}
              </div>

              {/* Input Fields */}
              <div className="md:col-span-3 mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Product Description
                    </label>
                    <input
                      type="text"
                      className="bg-white w-full h-[176px] rounded-[16px] px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Sub-category
                    </label>
                    <input
                      type="text"
                      className="bg-white w-full h-[176px] rounded-[16px] px-4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <input
                      type="text"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Minimum order
                    </label>
                    <input
                      type="number"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[20px] font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      className="bg-white w-full h-[88px] rounded-[16px] px-4"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full h-[92px] rounded-[100px] text-[20px] font-semibold bg-[#FF4C3B] text-white hover:bg-red-600 transition-all"
                    >
                      Upload product
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductUpload;
