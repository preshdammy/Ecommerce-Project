"use client";

import { useReactiveVar } from "@apollo/client";
import { cartItemsVar, likedItemsVar } from "@/shared/lib/apolloClient";
import { toast } from "react-toastify";
import { AiFillHeart, AiFillStar, AiOutlineEye, AiOutlineStar } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";
import { IoIosHeartEmpty } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react"
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"


interface ProductType {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  images: string[];
  averageRating: number;
  stock: number;
  seller: {
    id: string;
  };
  totalReviews?: number;
}

interface Props {
  products: ProductType[];
  formattedCategory: string;
}

const CategoryClientComponent = ({ products, formattedCategory }: Props) => {
  const cartItems = useReactiveVar(cartItemsVar);
  const likedItems = useReactiveVar(likedItemsVar);
  const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const offset = (page - 1) * limit;
  
    useEffect(() => {
      const updateLimit = () => {
        const width = window.innerWidth;
    
        if (width < 640) setLimit(4);       
        else if (width < 768) setLimit(4);  
        else if (width < 1024) setLimit(6); 
        else if (width < 1280) setLimit(8);
        else setLimit(8);                  
      };
    
      updateLimit(); 
      window.addEventListener("resize", updateLimit);
    
      return () => window.removeEventListener("resize", updateLimit);
    }, []);
  
    const disableNext = products?.length < limit || !products;

  const handleAddToCart = (product: ProductType) => {
    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    const exists = cartItems.some((item) => item.id === product.id);
    if (exists) {
      toast.info("Already in cart");
    } else {
      cartItemsVar([...cartItems, product]);
      toast.success("Added to cart");
    }
  };

  const toggleLike = (product: ProductType) => {
    if (product.stock === 0) {
      toast.error("Cannot like out-of-stock product");
      return;
    }

    const isLiked = likedItems.some((item) => item.id === product.id);
    if (isLiked) {
      likedItemsVar(likedItems.filter((item) => item.id !== product.id));
      toast.info("Removed from likes");
    } else {
      likedItemsVar([...likedItems, product]);
      toast.success("Added to likes");
    }
  };

  const renderStars = (averageRating: number, totalReviews?: number) => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center text-[#FFB800] text-[16px] mt-[8px]">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => <AiFillStar key={`full-${i}`} />)}
        {hasHalfStar && <AiFillStar className="opacity-50" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => <AiOutlineStar key={`empty-${i}`} />)}
        <span className="text-sm text-gray-600 ml-1">({totalReviews ?? 0})</span>
      </div>
    );
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen relative pt-[2vh] overflow-x-hidden">
      <h1 className="text-xl md:text-2xl font-semibold px-4 mt-6">Products in: {formattedCategory}</h1>

      <div className="container mx-auto px-1 py-8">
        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No products found in this category.</p>
        ) : (
          <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
  {products.map((product) => {
    const isLiked = likedItems.some((item) => item.id === product.id);

    return (
      <div
        key={product.id}
        className="pb-[20px] pt-[0px] w-[15rem] rounded-[10px] bg-white md:w-full"
      >
        <div className="flex h-[140px] justify-between relative">
          <div className="relative w-full max-w-[205px] h-[140px]">
            {product.stock === 0 && (
              <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">Out of Stock</span>
              </div>
            )}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="w-[35px] flex flex-col gap-[12px] items-center justify-center h-[140px] z-20">
            <button onClick={() => toggleLike(product)} disabled={product.stock === 0}>
              {isLiked ? (
                <AiFillHeart className="text-red-500 text-[24px]" />
              ) : (
                <IoIosHeartEmpty
                  className={`text-[24px] ${
                    product.stock === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-400"
                  }`}
                />
              )}
            </button>

            <AiOutlineEye className="cursor-pointer hover:text-[#00bfff] text-[24px]" />

            <IoCartOutline
              className={`text-[24px] ${
                product.stock === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "cursor-pointer hover:text-[#00bfff]"
              }`}
              onClick={() => handleAddToCart(product)}
            />
          </div>
        </div>

        <Link href={`/user/landingpage/product/${product.slug}`} className="cursor-pointer">
          <div className="mx-auto w-[90%]">
            <p className="text-[12px] font-[500] text-[#007BFF] font-sans mt-[10px]">{product.name}</p>
            <p className="font-sans font-[400] text-[16px] mt-[10px]">
              {product.description.length > 39
                ? product.description.slice(0, 39) + "..."
                : product.description}
            </p>

            {renderStars(product.averageRating, product.totalReviews)}

            <p className="font-sans text-[16px] font-[600] mt-[15px]">
              NGN {product.price.toLocaleString()}
            </p>

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
</div>

        )}
      </div>
      <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-6 py-2 rounded-full border-2 border-[#007BFF] text-[#007BFF] font-semibold transition-all duration-200 flex items-center gap-2 mb-2 ${page === 1 ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed" : "bg-white hover:bg-[#007BFF] hover:text-white" }`} >
                <BsArrowLeft />
                Previous
            </button>
          <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={disableNext}
                className={`px-6 py-2 rounded-full border-2 border-[#007BFF] text-[#007BFF] font-semibold transition-all duration-200 flex items-center gap-2 mb-2 ${
                  disableNext
                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                    : "bg-white hover:bg-[#007BFF] hover:text-white"
                }`}
              >
                Next
                <BsArrowRight />
              </button>
      
      </div>
      
    </div>

  );
};

export default CategoryClientComponent;
