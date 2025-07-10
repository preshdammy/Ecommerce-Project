"use client";
import React, { useState } from "react";
import {gql, useQuery, useMutation} from "@apollo/client"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { RiShoppingCart2Line } from "react-icons/ri";
import { IoChatboxOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { toast } from "react-toastify"; 
import { IoIosHeartEmpty } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import iphoneImage from "../../../../../../../public/figma images/Frame 479.png"
import { IoCartOutline } from "react-icons/io5";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import starLogo from "../../../../../../../public/figma images/Frame 498.png"
import treeImage from "../../../../../../../public/figma images/0fee51f546b9f6d8a608af5d000da6ed 1.png"
import bagImage from "../../../../../../../public/figma images/robert-gomez-vXduK0SeYjU-unsplash-removebg-preview 1.png"


const get_products_by_slug = gql`query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      slug
      description
      price
      images
      seller {
        id
        name
      }
    }
  }`


  const create_review_mutation = gql`
  mutation CreateReview($productId: ID!, $rating: Int!, $comment: String!) {
    createReview(productId: $productId, rating: $rating, comment: $comment) {
      id
      comment
      rating
      createdAt
      user {
        id
        name
      }
      product {
        id
        name
      }
    }
  }
`;

const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($productId: ID!, $limit: Int!) {
    relatedProducts(productId: $productId, limit: $limit) {
      id
      name
      slug
      price
      images
      description
      stock
      averageRating
      totalReviews
    }
  }
`;

type RelatedProduct = {
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
    description: string;
    stock: number;
    averageRating: number;
    totalReviews: number;
  };
  
  
const ProductDescription = ({slug}:{slug: string}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isModalOpen, setIsModalOpen] = useState(false);


  const {data, loading, error} = useQuery(get_products_by_slug, {variables:{slug: slug}})
  console.log("Product Data:", data);


  const product = data?.productBySlug;

  const { data: relatedData, loading: relatedLoading, error: relatedError } = useQuery(GET_RELATED_PRODUCTS, {
  variables: {
      productId: product?.id,
      limit: 8
  },
  skip: !product?.id 
  });

  const [createReview, {loading: creatingReview}] = useMutation(create_review_mutation)
  
    
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({
      content: ""
  });
  const [rating, setRating] = useState(0);
  const handleReview = async () => {
      if (rating === 0) {
          toast.error("Please select a rating.");
          return;
        }
        if (!review.content.trim()) {
          toast.error("Please write a comment.");
          return;
        }
        
      try {
          const res = await createReview({variables: {
              productId: data.productBySlug.id,
              rating: rating,
              comment: review.content
          }})
          setReview({ content: "" });
          setRating(0);
          toast.success("Review sent successfully!");
          console.log("Review created:", res.data.createReview);
      } catch (error: any) {
          console.log("Error creating review:", error?.message);
          
      }
          
          
      }
      console.log("Related Products Data:", relatedData);
      

  return (
    <>
      <div className="max-w-[1536px]">
        <div className="full bg-[#F8F8F8] py-[10vh]">
          <div className="w-[85%] mx-auto">
            <div className="w-full flex gap-[8%] pb-[10vh]">
              {/* Left Image Block */}
              <div className="w-[45%]">
                <div className="w-full flex justify-center bg-white rounded-[10px] ">
                  <Image className="w-[265px] h-[350px]" src={bagImage} alt="" />
                </div>

                <div className="flex w-full justify-between mt-[15px]">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="bg-white w-[48%] flex justify-center rounded-[10px]">
                      <Image className="h-[175px] w-[133px]" src={bagImage} alt="" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Product Details */}
              <div className="flex flex-col gap-[25px]">
                <h2 className="w-[504px] font-sans text-[32px] font-[600]">
                  Durable Bronze and Black Twin Suitcase
                </h2>
                <p className="w-[504px] text-[16px] font-[500] font-sans text-[#939090]">
                  Stylish bronze and black twin suitcase set for modern travelers. Durable,
                  scratch-resistant exterior.
                </p>
                <p className="font-[700] font-sans text-[20px]">₦ 72,000</p>

                <div className="font-[600] text-[12px] flex justify-between items-center">
                  <div>
                    <span className="bg-[#55A7FF] rounded-[3px] py-[7px] px-[12px] text-white">-</span>
                    <span className="rounded-[3px] py-[7px] px-[12px] bg-white">2</span>
                    <span className="bg-[#55A7FF] rounded-[3px] py-[7px] px-[12px] text-white">+</span>
                  </div>
                  <CiHeart className="text-[24px] text-blue-500" />
                </div>

                <button className="flex gap-[8px] py-[10px] w-[150px] rounded-[5px] px-[16px] bg-[#FF4C3B] font-[600] items-center text-[16px] text-white">
                  <span>Add to cart</span>
                  <RiShoppingCart2Line className="text-[18px] font-[700]" />
                </button>

                <div className="bg-[#F5FAFF] font-sans w-[340px] h-[75px] ">
                  <div className="flex h-[100%] w-[100%] justify-around items-center">
                    <div className="w-[160px] h-[42px] flex">
                      <Image className="w-[45px] h-[45px] rounded-[50%]" src={treeImage} alt="" />
                      <div className="flex flex-col justify-between ml-2">
                        <p className="font-[600] text-[12px]">Luxurious Travels</p>
                        <p className="text-[#939090] font-[400] text-[10px]">(4.2) Ratings</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center py-[10px] px-[12px] gap-[8px] cursor-pointer hover:bg-blue-100 rounded transition"
                    >
                      <span className="font-[600] text-[12px]">Message Seller</span>
                      <IoChatboxOutline className="text-[16px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

                       {/* Tabs */}
                       <div className="bg-white pt-[20px] w-full">
              <div className="font-[500] text-[24px] border-[#F8F8F8] border-b-[3px] font-sans flex items-center justify-between h-[50px] w-[95%] mx-auto">
                {["details", "reviews", "seller"].map((tab) => (
                  <div
                    key={tab}
                    className={`h-[100%] flex items-center ${
                      activeTab === tab ? "border-blue-500 border-b-[3px]" : ""
                    }`}
                  >
                    <button onClick={() => setActiveTab(tab)}>
                      {tab === "details"
                        ? "Product Details"
                        : tab === "reviews"
                        ? "Product Reviews"
                        : "Seller Information"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Tab Content */}
              <div className="w-[95%] h-[40vh] overflow-auto mx-auto text-[16px] font-sans flex flex-col gap-[10px] mt-[20px]">
                {activeTab === "details" && (
                  <>
                    <p>Introducing our sleek and stylish bronze and black twin suitcase...</p>
                    <p>
                      Made from durable materials, these suitcases are built to withstand the rigors
                      of travel...
                    </p>
                    <p>Inside, you'll find a spacious and well-organized interior...</p>
                    <p>
                      Maneuvering through crowded airports is a breeze with the smooth-rolling
                      spinner wheels...
                    </p>
                    <p>
                      Upgrade your travel gear with our bronze and black twin suitcase set...
                    </p>
                  </>
                )}

                {activeTab === "reviews" && (
                  <>
                    <p className="font-semibold text-lg">Customer Reviews:</p>
                    {[
                      {
                        name: "Jane Doe",
                        rating: 5,
                        text:
                          "This suitcase set is absolutely fantastic. Durable and stylish. I've used it for 3 trips now with no issues at all!",
                      },
                      {
                        name: "John Smith",
                        rating: 4,
                        text:
                          "Great quality. Only wish the smaller one had a bit more room, but overall very satisfied!",
                      },
                      {
                        name: "Amaka Benson",
                        rating: 4,
                        text: "Very durable and elegant. Got lots of compliments at the airport!",
                      },
                    ].map((review, i) => (
                      <div key={i} className="bg-[#f9f9f9] p-4 rounded-md shadow mt-2">
                        <p className="font-medium">{review.name}</p>
                        <p>{"⭐️".repeat(review.rating)}</p>
                        <p>{review.text}</p>
                      </div>
                    ))}
                  </>
                )}

                {activeTab === "seller" && (
                  <>
                    <p className="font-semibold text-lg">Seller Information:</p>
                    <div className="bg-[#f9f9f9] p-4 rounded-md shadow">
                      <p className="font-medium">Luxurious Travels</p>
                      <p>Email: luxurious@travels.com</p>
                      <p>Phone: +234 801 234 5678</p>
                      <p className="text-sm mt-2">
                        We provide high-end travel gear tailored for fashion-conscious and
                        functionality-driven individuals. Reach out to us for inquiries, product
                        customization, or bulk orders.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Review Form */}
            <div className="w-[95%] mt-[30px] ">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => setShowReviewForm(!showReviewForm)}
                            >
                                {showReviewForm ? "Cancel Review" : "Leave a Review"}
                            </button>

                            {showReviewForm && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                                    <textarea
                                        placeholder="Write your review..."
                                        value={review.content}
                                        onChange={(e) => setReview({...review, content:e.target.value})}
                                        className="w-full h-[100px] p-2 border rounded mb-2"
                                    />
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`cursor-pointer text-2xl ${rating >= star ? "text-yellow-500" : "text-gray-400"}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <button onClick={handleReview} className="bg-green-600 text-white px-6 py-2 rounded">
                                        { creatingReview? "processing...": "Submit Review" }
                                    </button>
                                </div>
                            )}
                            </div>
            {/* Related Products */}
            <div className="w-full bg-[#F8F8F8] pt-[12vh] pb-[10vh]">
                    <h1 className="font-[500] text-[32px] font-sans w-[85%] ">Related Products</h1>
           
                    <div className="bg-[#F8F8F8] w-[85%] mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                         <ProductFrame data={{ relatedProducts: data?.relatedProducts?.slice(0, 8) || [] }} />
                    </div>
                    </div>

      

            {/* Modal with Framer Motion */}
            <AnimatePresence>
              {isModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 bg-opacity-40 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg p-6 w-[90%] max-w-[400px] shadow-xl relative"
                  >
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                    >
                      ✕
                    </button>
                    <h2 className="text-xl font-semibold mb-4">Send a Message to Seller</h2>
                    <textarea
                      rows={5}
                      placeholder="Type your message..."
                      className="w-full p-2 border border-gray-300 rounded mb-4"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
                      Send Message
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDescription;

import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export const ProductFrame = ({ data }: { data: { relatedProducts: RelatedProduct[] } }) => {
    return (
      <>
        {data?.relatedProducts?.map((product: RelatedProduct) => {
          const { averageRating = 0, price, stock } = product;
          const fullStars = Math.floor(averageRating);
          const hasHalfStar = averageRating % 1 >= 0.5;
          const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
          return (
            <div key={product.id} className="w-[240px] pb-[20px] pt-[10px] rounded-[10px] bg-white">
              <div className="flex h-[140px] justify-between ">
                <div className="w-[205px] h-[140px] relative">
                  <Image
                    src={product.images[0] || iphoneImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
  
                <div className="w-[35px] flex flex-col gap-[12px] justify-center items-center text-[24px] h-[140px]">
                  <IoIosHeartEmpty />
                  <AiOutlineEye />
                  <IoCartOutline />
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
                  <p className="text-[16px] font-[600] font-sans text-right text-[#FF4C3B]">
                    {stock + " available"}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </>
    );
  };