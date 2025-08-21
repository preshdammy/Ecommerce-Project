"use client";
import { useQuery } from "@apollo/client";
import React from "react";
import { gql } from '@apollo/client';
import { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"

export const GET_BEST_DEALS = gql`
  query GetBestDeals($dealsLimit: Int!) {
  bestDeals(limit: $dealsLimit) {
      id
      name
      price
      originalPrice
      description
      averageRating
      totalReviews
      category
      stock
      images
      slug
    }
  }
`;

type DealProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  averageRating: number;
  totalReviews: number;
  stock: number;
  images: string[];
  slug: string;
};



const BestDealsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { loading, error, data } = useQuery(GET_BEST_DEALS, {
    variables: { dealsLimit: 100 }, // fetch enough to paginate manually
  });

   if (loading) {
    return (
      <div className="flex justify-center h-[50vh] items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) return <p>Error loading deals: {error.message}</p>;

  const offset = (page - 1) * limit;
  const allDeals = data?.bestDeals || [];
  const paginatedDeals = allDeals.slice(offset, offset + limit);

  return (
    <div className="w-full bg-[#F8F8F8] pt-[12vh] pb-[10vh]">
      <h1 className="font-[500] text-[32px] font-sans w-[85%] mx-auto">Best Selling Products</h1>
               
            <div className="bg-[#F8F8F8] w-[85%] mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"> 
              <ProductFrameOne data={{ bestDeals: paginatedDeals }} />
      </div>

       {allDeals.length > limit && (
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
             className={`px-6 py-2 rounded-full border-2 border-[#007BFF] text-[#007BFF] font-semibold transition-all duration-200 flex items-center gap-2 mb-2 ${page === 1 ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed" : "bg-white hover:bg-[#007BFF] hover:text-white" }`} >
                <BsArrowLeft />
                Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={offset + limit >= allDeals.length}
           className={`px-6 py-2 rounded-full border-2 border-[#007BFF] text-[#007BFF] font-semibold transition-all duration-200 flex items-center gap-2 mb-2 ${ data?.allProducts?.length < limit ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed" : "bg-white hover:bg-[#007BFF] hover:text-white" }`} >
              Next
              <BsArrowRight />
              </button>
        </div>
      )}
    </div>
     
    
  );
};

export default BestDealsPage;

import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "react-toastify"
import { cartItemsVar } from "@/shared/lib/apolloClient";
import { likedItemsVar } from "@/shared/lib/apolloClient";
import { useReactiveVar } from "@apollo/client";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import Image from "next/image";


export const ProductFrameOne = ({ data }: { data: { bestDeals: DealProduct[] } }) => {
  const handleAddToCart = (product: DealProduct) => {
    const existing = cartItemsVar();
    const alreadyExists = existing.find((item) => item.id === product.id);
  
    if (!alreadyExists) {
            cartItemsVar([...existing, product]);
            toast.success("Product added to cart!");
            return
          }
          toast.info("Product already in cart")
        };

        const likedItems = useReactiveVar(likedItemsVar);

        const toggleLike = (product: DealProduct) => {
          const isLiked = likedItems.some((item) => item.id === product.id);
        
          if (isLiked) {
            likedItemsVar(likedItems.filter((item) => item.id !== product.id));
            toast.info("Removed from Likes");
          } else {
            likedItemsVar([...likedItems, product]);
            toast.success("Added to Likes");
          }
        };

  return (
    <>
      {data.bestDeals?.map((product: DealProduct) => {
        const { price, originalPrice, averageRating = 0 } = product;
        const discountPercent =
          originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0;

        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
          <div key={product.id} className="w-[240px] pb-[20px] pt-[10px] rounded-[10px] bg-white">
            <div className="flex h-[140px] justify-between">
              <div className="w-[205px] h-[140px] relative">
              {product.stock === 0 && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black/70 bg-opacity-50 flex items-center justify-center z-10">
                      <span className="text-white text-sm font-semibold">Out of Stock</span>
                    </div>
                  )}

                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="w-[35px] flex flex-col gap-[12px] justify-center items-center text-[24px] h-[140px]">
              {product.stock === 0 ? (
                    <button
                      onClick={() => toast.error("Cannot like out-of-stock product")}
                      disabled
                    >
                      <IoIosHeartEmpty className="text-gray-300 text-[24px] cursor-not-allowed" />
                    </button>
                  ) : (
                    <button onClick={() => toggleLike(product)}>
                      {likedItems.some((item) => item.id === product.id) ? (
                        <AiFillHeart className="text-red-500 text-[24px]" />
                      ) : (
                        <IoIosHeartEmpty className="text-gray-400 text-[24px]" />
                      )}
                    </button>
                  )}

                <AiOutlineEye className="cursor-pointer hover:text-[#00bfff]" />
                {product.stock === 0 ? (
                  <IoCartOutline
                    className="text-gray-400 cursor-not-allowed"
                    onClick={() => toast.error("Product is out of stock")}
                  />
                ) : (
                  <IoCartOutline
                    className="cursor-pointer hover:text-[#00bfff]"
                    onClick={() => handleAddToCart(product)}
                  />
                )}

              </div>
            </div>

            <Link href={`landingpage/product/${product.slug}`} className="cursor-pointer">
              <div className="mx-auto w-[90%]">
                <p className="text-[12px] font-[500] text-[#007BFF] font-sans mt-[10px]">
                  {product.name}
                </p>

                <p className="font-sans font-[400] text-[16px] mt-[10px]">
                  {product.description.length > 39
                    ? product.description.slice(0, 39) + "..."
                    : product.description}
                </p>

                <div className="flex items-center text-[#FFB800] text-[16px] mt-[8px]">
                  {Array(fullStars)
                    .fill(0)
                    .map((_, i) => (
                      <AiFillStar key={`full-${i}`} />
                    ))}
                  {hasHalfStar && <AiFillStar className="opacity-50" />}
                  {Array(emptyStars)
                    .fill(0)
                    .map((_, i) => (
                      <AiOutlineStar key={`empty-${i}`} />
                    ))}
                  <span className="text-sm text-gray-600 ml-1">({product.totalReviews})</span>
                </div>

                <p className="font-sans text-[16px] font-[600] mt-[15px] text-black">
                  {"NGN " + price.toLocaleString()}
                </p>

                {originalPrice && originalPrice > price && (
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] text-gray-500 line-through">
                      NGN {originalPrice.toLocaleString()}
                    </p>
                    <span className="text-[#FF4C3B] text-[14px] font-semibold">
                      {discountPercent}% off
                    </span>
                  </div>
                )}

                  <p className="text-[16px] font-[600] font-sans text-right">
                    {product.stock === 0 ? (
                      <span className="text-red-500">Out of Stock</span>
                    ) : (
                      <span className="text-[#FF4C3B]">{product.stock} available</span>
                    )}
                  </p>

              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
};

