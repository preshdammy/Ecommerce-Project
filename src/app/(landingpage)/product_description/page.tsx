"use client";
import React, { useState } from "react";
import Image from "next/image";
import { RiShoppingCart2Line } from "react-icons/ri";
import { IoChatboxOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { ProductFrame } from "../landingpage/page";

import treeImage from "../../../../public/figma images/0fee51f546b9f6d8a608af5d000da6ed 1.png"
import bagImage from "../../../../public/figma images/robert-gomez-vXduK0SeYjU-unsplash-removebg-preview 1.png"

const ProductDescription = () => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    return (
    <>
    <div className="max-w-[1536px]">

        <div className="full bg-[#F8F8F8] py-[10vh]">

            <div className="w-[85%] mx-auto">

                <div className="w-[full] flex gap-[8%] pb-[10vh]">
                    <div className="w-[45%]">
                        <div className="w-full flex justify-center bg-white rounded-[10px] "><Image className="w-[265px] h-[350px] " src={bagImage} alt="" /></div>

                        <div className="flex w-full justify-between mt-[15px]">
                            <div className="bg-white w-[48%] flex justify-center rounded-[10px] "> <Image className="h-[175px] w-[133px]" src={bagImage} alt="" /></div>
                            <div className="bg-white w-[48%] flex justify-center rounded-[10px] "> <Image className="h-[175px] w-[133px]" src={bagImage} alt="" /></div>
                        
                        </div>
                    </div>
                    <div className="flex flex-col gap-[25px]" >
                        <h2 className="w-[504px] font-sans text-[32px] font-[600]">Durable Bronze and Black Twin Suitcase</h2>
                        <p className="w-[504px] text-[16px] font-[500] font-sans text-[#939090]">Stylish bronze and black twin suitcase set for modern travelers. Durable, scratch-resistant exterior. Well-organized interior with multiple pockets. Smooth-rolling spinner wheels and telescoping handle. Elegant color combination adds style to your travels. Upgrade your travel gear and travel in style!</p>
                        <p className="font-[700] font-sans text-[20px]">₦ 72,000</p>
                        <div className="font-[600] text-[12px] flex w-[full] justify-between items-center">
                            <div>
                            <span className="bg-[#55A7FF] rounded-[3px] py-[7px] px-[12px] text-white">-</span>
                            <span className="rounded-[3px] py-[7px] px-[12px] bg-white">2</span>
                            <span className="bg-[#55A7FF] rounded-[3px] py-[7px] px-[12px] text-white">+</span>
                            </div>

                            <div>
                            < CiHeart  className="text-[24px] text-blue-500" />
                            </div>
                          
                        </div>
                        <button className="flex gap-[8px] py-[10px] w-[150px] rounded-[5px] px-[16px] bg-[#FF4C3B] font-[600] items-center text-[16px] text-white"><span>Add to cart</span><RiShoppingCart2Line className="text-[18px] font-[700]" /></button>
                        <div className="bg-[#F5FAFF]  font-sans w-[340px] h-[75px] ">
                            <div className="flex h-[100%] w-[100%] justify-around items-center"> 
                                <div className="w-[160px] h-[42px] flex">
                                    <Image className="w-[45px] h-[45px] rounded-[50%] " src={treeImage} alt="" />
                                    <div className="flex flex-col justify-between">
                                        <p className="font-[600] text-[12px] ">Luxurious Travels</p>
                                        <p className="text-[#939090] font-[400] text-[10px]">{"(4.2) Ratings"}</p>
                                        
                                    </div>
                                </div>
                                <div className="flex items-center py-[10px] px-[12px] gap-[8px]">
                                    <span className="font-[600] text-[12px]">Message Seller</span>
                                    <IoChatboxOutline className="text-[16px]" />
                                </div>
                            </div>
                        </div>

                    
                    </div>
                </div>

                <div className="bg-white pt-[20px] w-full">

                    <div className="font-[500] text-[24px] border-[#F8F8F8] border-b-[3px] font-sans flex items-center justify-between h-[50px] w-[95%] mx-auto">
                        <div className="h-[100%] border-blue-500 border-b-[3px] flex items-center"><span>Product Details</span></div>
                        <div>Product Reviews</div>
                        <div>Seller Information</div>

                    </div>

                    <div className=" w-[95%] mx-auto text-[16px] font-sans flex flex-col gap-[10px] mt-[20px]">
                        <p>Introducing our sleek and stylish bronze and black twin suitcase, perfect for the modern traveler who demands both functionality and fashion. This suitcase set includes two matching suitcases, one in bronze and one in black, that are designed to accompany you on all your journeys, whether it's for business or leisure.</p>

                       <p>Made from durable materials, these suitcases are built to withstand the rigors of travel. The bronze and black exteriors are not only eye-catching, but also resistant to scratches and scuffs, ensuring your suitcase looks great even after multiple trips. The suitcases also feature sturdy zippers and a TSA-approved lock for added security and peace of mind.</p>

                       <p> Inside, you'll find a spacious and well-organized interior, designed to keep your belongings neat and secure. The interior includes multiple zippered pockets and compression straps, making it easy to pack and unpack. The suitcases also feature a convenient and expandable design, allowing you to adjust the packing capacity to suit your needs.</p>
                       <p> Maneuvering through crowded airports or busy streets is a breeze with the smooth-rolling, multi-directional spinner wheels and telescoping handle. The suitcases also have a top and side carry handle for easy lifting and handling. With their elegant bronze and black color combination, these suitcases are not only functional but also make a stylish statement.</p>
                       <p>They are perfect for the fashion-forward traveler who wants to travel in style without compromising on durability and functionality.
                       Upgrade your travel gear with our bronze and black twin suitcase set and embark on your next adventure with confidence and sophistication. Get yours now and travel in style with this exquisite suitcase set!</p>
                       
                    </div>
                   
                
                </div>

            </div>
            <div className="w-[95%] mx-auto mt-[30px] px-17">
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
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
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
                                    <button className="bg-green-600 text-white px-6 py-2 rounded">
                                        Submit Review
                                    </button>
                                </div>
                            )}
                            </div>


            
           <div className="w-full bg-[#F8F8F8] pt-[12vh] pb-[20vh]">
            <h1 className="font-[500] text-[32px] font-sans w-[85%] mx-auto ">Related Products</h1>
            <div className=" bg-[#F8F8F8] w-[85%] flex-wrap gap-y-[30px] mx-auto mt-[20px] flex  justify-between">

                <div className="w-1/4 p-2">
                   <ProductFrame/>
                </div>
                <div className="w-1/4 p-2">
                   <ProductFrame/>
                </div>
                <div className="w-1/4 p-2">
                   <ProductFrame/>
                </div>
                <div className="w-1/4 p-2">
                   <ProductFrame/>
                </div>
                <div className="w-1/4 p-2">
                   <ProductFrame/>
                </div>
                <div className="w-1/4 p-2">
                   <ProductFrame/>
                </div>
                <div className="w-1/4 p-2">
                   <ProductFrame/>
                </div>
                <div className="w-1/4 p-2">
                   <ProductFrame/>
                </div>
            </div>
           </div>

        </div>


    </div>
    
    </> );
}
 
export default ProductDescription;