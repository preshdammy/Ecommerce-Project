"use client";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BsCart2 } from "react-icons/bs";
import { CiStar, CiLocationOn } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import watch from "../../../../public/figma images/watch.png";
import Link from "next/link";

const CategoryPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);


  const products = Array(12).fill({
    seller: "Dele Electronics",
    title: "iPhone 14 Pro Max 256GB SSD and 8GB RAM...",
    price: "₦ 768,000",
    location: "Lagos, Gbagada",
    sold: "20 sold",
    rating: 4,
  });

  const locations = [
    "Ajah", "Alimosho", "Apapa", "Agege", "Badagry", "Epe", "Ikeja", "Ikorodu", "Surulere",
    "Yaba", "Victoria Island", "Lekki", "Ogudu", "Ikoyi", "Maryland", "Ojodu", "Ojota",
    "Ketu", "Magodo", "Festac", "Mushin", "Isolo", "Oshodi", "Egbeda", "Ilupeju", "Anthony",
    "Bariga", "Gbagada"
  ];

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) =>
        i < rating ? (
          <FaStar key={i} className="text-[#FABE22] text-[14px]" />
        ) : (
          <CiStar key={i} className="text-[#FABE22] text-[14px]" />
        )
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen relative">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-[#007BFF] text-2xl md:text-3xl font-normal mb-6">
          Furniture Products
        </h1>

        {/* Locations */}
        <div className="flex items-center mb-6 overflow-x-auto overflow-hidden pb-2 w-full">
          <IoIosArrowBack className="text-[#007BFF] text-2xl mr-2" />
          <div className="flex space-x-2">
            {locations.map((loc, i) => (
              <button
                key={i}
                className="px-3 py-1 bg-[#F1F1F1] rounded-full text-[#007BFF] text-xs hover:bg-[#007BFF] hover:text-white whitespace-nowrap"
              >
                {loc}
              </button>
            ))}
          </div>
          <IoIosArrowForward className="text-[#007BFF] text-2xl ml-2" />
        </div>


         <div className="md:hidden flex gap-4 mb-4">
          <button
            className="w-full py-2 bg-gray-200 text-sm rounded"
            onClick={() => setIsLocationOpen(true)}
          >
            Location
          </button>
          <button
            className="w-full py-2 bg-gray-200 text-sm rounded"
            onClick={() => setIsFilterOpen(true)}
          >
            Filter
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-md p-3 border border-gray-200 cursor-pointer hover:shadow"
            >
              <div className="flex">
                <div className="w-[90%] h-40 relative">
                  <Image
                    src={watch}
                    alt={product.title}
                    fill
                    className="rounded object-cover"
                  />
                </div>
                <div className="w-[10%] flex flex-col items-center justify-start gap-3 pt-2">
                  <FaRegHeart className="text-gray-400 text-lg" />
                  <MdOutlineRemoveRedEye className="text-gray-400 text-lg" />
                  <BsCart2 className="text-gray-400 text-lg" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[#007BFF] text-xs font-medium">
                  {product.seller}
                </span>
                <p className="text-[#272222] text-sm mt-1">{product.title}</p>
                {renderStars(product.rating)}
                <span className="text-[#272222] text-base font-semibold block mt-1">
                  {product.price}
                </span>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[#007BFF] text-xs flex items-center">
                    <CiLocationOn className="mr-1" />
                    {product.location}
                  </span>
                  <span className="text-[#FF4C3B] text-xs font-semibold">
                    {product.sold}
                  </span>
                </div>

              
                    <Link href={`/category/${index}`}>
                      <button className="text-[#007BFF] mt-2 text-sm underline">See more</button>
                   </Link>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  num === 1
                    ? "bg-[#007BFF] text-white border border-[#007BFF]"
                    : "text-[#007BFF] border border-[#007BFF] hover:bg-[#007BFF] hover:text-white"
                }`}
              >
                {num}
              </button>
            ))}
            <button className="text-[#007BFF] ml-2 flex items-center">
              Next <IoIosArrowForward className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* See More Modal */}
      {selectedProduct && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-[90%] max-w-md p-6 shadow-xl overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>
            <Image
              src={watch}
              alt="Preview"
              width={300}
              height={200}
              className="mx-auto rounded-md"
            />
            <h2 className="text-lg font-semibold mt-4">
              {selectedProduct.title}
            </h2>
            <p className="text-sm text-gray-500">{selectedProduct.seller}</p>
            <div className="my-2">{renderStars(selectedProduct.rating)}</div>
            <p className="text-[#007BFF] font-bold text-lg">
              {selectedProduct.price}
            </p>
            <p className="text-xs mt-2">{selectedProduct.location}</p>
            <p className="text-xs mt-1 text-[#FF4C3B] font-semibold">
              {selectedProduct.sold}
            </p>
          </div>
        </div>
      )}

  

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 px-4 py-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#007BFF] text-2xl font-semibold">Filter by</h2>
            <AiOutlineClose
              className="text-2xl cursor-pointer"
              onClick={() => setIsFilterOpen(false)}
            />
          </div>
          {/* Filter content goes here */}
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold mb-2">Color</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-full border">Blue</button>
                <button className="px-3 py-1 rounded-full border">Brown</button>
                <button className="px-3 py-1 rounded-full border">Black</button>
              </div>
            </div>
            <div>
              <p className="font-bold mb-2">Condition</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-full border">New</button>
                <button className="px-3 py-1 rounded-full border">Used</button>
              </div>
            </div>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full mt-8 bg-[#007BFF] text-white py-3 rounded-full font-semibold"
            >
              Show 351 results
            </button>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {isLocationOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 px-4 py-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#007BFF] text-2xl font-semibold">
              Select location
            </h2>
            <AiOutlineClose
              className="text-2xl cursor-pointer"
              onClick={() => setIsLocationOpen(false)}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {locations.map((loc, i) => (
              <button
                key={i}
                className="px-3 py-2 border rounded-full hover:bg-blue-100"
              >
                {loc}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsLocationOpen(false)}
            className="w-full mt-8 bg-[#007BFF] text-white py-3 rounded-full font-semibold"
          >
            Show 351 results
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
