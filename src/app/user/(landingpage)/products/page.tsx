"use client";
import { useQuery, gql } from "@apollo/client";
import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "react-toastify";
import { cartItemsVar } from "@/shared/lib/apolloClient";
import { likedItemsVar } from "@/shared/lib/apolloClient";
import { useReactiveVar } from "@apollo/client";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import Image from "next/image";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($limit: Int!, $offset: Int!) {
    allProducts(limit: $limit, offset: $offset) {
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

type FeaturedProduct = {
  id: string;
  name: string;
  price: number;
  averageRating: number;
  totalReviews: number;
  description: string;
  category: string;
  stock: number;
  images: string[];
  slug: string;
};

const AllProductsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 12; // Set limit to 12 products per page
  const offset = (page - 1) * limit;

  console.log("Query Variables:", { limit, offset });

  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS, {
    variables: { limit, offset }, 
  });

  const likedItems = useReactiveVar(likedItemsVar);

  const handleAddToCart = (product: FeaturedProduct) => {
    const existing = cartItemsVar();
    const alreadyExists = existing.find((item) => item.id === product.id);

    if (!alreadyExists) {
      cartItemsVar([...existing, product]);
      toast.success("Product added to cart!");
      return;
    }
    toast.info("Product already in cart");
  };

        const toggleLike = (product: FeaturedProduct) => {
          const isLiked = likedItems.some((item) => item.id === product.id);
        
          if (isLiked) {
            likedItemsVar(likedItems.filter((item) => item.id !== product.id));
            toast.info("Removed from Likes");
          } else {
            likedItemsVar([...likedItems, product]);
            toast.success("Added to Likes");
          }
        };
        
       if (loading) return <p className="text-center">Loading...</p>
        if (error) { return <p>Error: {error.message}</p>;}

    return (
      <>
      <div className="bg-[#f8f8f8]">
        <h1 className="text-start text-3xl mt-2 font-bold ml-20">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center mt-6 ">
        
          {data?.allProducts?.map((product: FeaturedProduct) => {
            const { averageRating = 0, price, stock } = product;
            const fullStars = Math.floor(averageRating);
            const hasHalfStar = averageRating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            

    
            return (
              <div key={product.id} className="w-[240px] pb-[20px] pt-[10px] rounded-[10px] bg-white">
                <div className="flex h-[140px] justify-between">
                  <div className="w-[205px] h-[140px] relative">
                  {stock === 0 && (
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
                  {stock === 0 ? (
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

                    <AiOutlineEye className="cursor-pointer hover:text-[#00bfff]"/>
                    {stock === 0 ? (
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
                    <p className="font-sans text-[16px] font-[600] mt-[15px]">NGN {price.toLocaleString()}</p>
                    <p className="text-[16px] font-[600] font-sans text-right">
                      {stock === 0 ? (
                        <span className="text-red-500">Out of Stock</span>
                      ) : (
                        <span className="text-[#FF4C3B]">{stock} available</span>
                      )}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
       </div>   


              <div className="flex justify-center mt-8 gap-4">
       <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-6 py-2 rounded-full border-2 border-[#007BFF] text-[#007BFF] font-semibold transition-all duration-200 flex items-center gap-2 mb-2 ${
            page === 1
              ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
              : "bg-white hover:bg-[#007BFF] hover:text-white"
          }`}
        >
          <BsArrowLeft />
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={data?.allProducts?.length < limit}
          className={`px-6 py-2 rounded-full border-2 border-[#007BFF] text-[#007BFF] font-semibold transition-all duration-200 flex items-center gap-2 mb-2 ${
            data?.allProducts?.length < limit
              ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
              : "bg-white hover:bg-[#007BFF] hover:text-white"
          }`}
        >
          Next
          <BsArrowRight />
        </button>
      </div>
      </div>
    
</>
  );
};

export default AllProductsPage;