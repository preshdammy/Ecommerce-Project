"use client";
import React, { useState } from "react";
import {gql, useQuery, useMutation} from "@apollo/client"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { RiShoppingCart2Line } from "react-icons/ri";
import { IoChatboxOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { AiFillHeart } from "react-icons/ai";
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
import { cartItemsVar } from "@/shared/lib/apolloClient";
import { likedItemsVar } from "@/shared/lib/apolloClient";
import { useReactiveVar } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { FaStore } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"





const get_products_by_slug = gql`query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      slug
      description
      extendedDescription
      price
      images
      stock
      averageRating
      totalReviews
      seller {
        id
        name
        email
        phone
        businessDescription
        businessName
        profilePicture
        joinedDate
        location
      }
    }
  }`

const get_reviews = gql`
      query GetProductReviews($productId: ID!) {
          productReviews(productId: $productId) {
            id
            rating
            comment
            user {
              name
            }
          }
        }
`
const get_my_products = gql`query GetMyProducts {
  myProducts {
    id
    slug
    
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

const SEND_MESSAGE = gql`
  mutation SendMessage($senderId: ID!, $receiverId: ID!, $content: String!) {
    sendMessage(senderId: $senderId, receiverId: $receiverId, content: $content) {
      id
      senderId
      receiverId
      content
      createdAt
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

  type ProductDescription = {
    id: string;
    name: string;
    slug: string;
    description: string;
    extendedDescription: string;
    price: number;
    images: string[];
    averageRating: number;
    totalReviews: number;
    seller: {
      id: string;
      name: string;
      email: string;
      phone: string;
      businessName: string;
      businessDescription: string;
      image?: string;
      joinedDate: string;
    };
  };
  
  
  
const ProductDescription = ({slug}:{slug: string}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [activeButton, setActiveButton] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE);


  const userInfoString = Cookies.get("userinfo"); 
  let currentUserId: string | null = null;

  if (userInfoString) {
    try {
      const userInfo = JSON.parse(userInfoString);
      currentUserId = userInfo.id; 
    } catch (error) {
      console.error("Failed to parse user info from cookie:", error);
    }
  }


  const handleSendMessage = async () => {
  
    if (!message.trim() || !currentUserId) return;

  try {
    const sellerId = data.productBySlug.seller.id;

    await sendMessage({
      variables: {
        senderId: currentUserId,
        receiverId: sellerId,
        content: message,
      },
    });

    // Optionally: Show toast or alert here
    setMessage("");
    setIsModalOpen(false);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
  };
  
  
  



  const {data, loading, error} = useQuery(get_products_by_slug, {variables:{slug: slug}})
  console.log("Product Data:", data);


  const product = data?.productBySlug;
  console.log(product);
  

  const { data: relatedData, loading: relatedLoading, error: relatedError } = useQuery(GET_RELATED_PRODUCTS, {
  variables: {
      productId: product?.id || product?._id,
      limit: 8
  },
  skip: !(product?.id || product?._id)
  });
  const { data: myProductData } = useQuery(get_my_products)

  const { data: getReviews, loading: reviewLoading, error: reviewError } = useQuery(get_reviews, {
    variables: 
      product?.id ? { productId: product.id } : undefined,
    skip: !product?.id, 
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
      const [quantity, setQuantity] = useState(1);

      const increaseQty = () => setQuantity((prev) => prev + 1);
      const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
      const handleAddToCart = () => {
        const currentCart = cartItemsVar();
      
        const isAlreadyInCart = currentCart.some((item) => item.id === product.id);
      
        if (isAlreadyInCart) {
          toast.info("Product already in cart");
          return;
        }
      
        const newItem = {
          ...product,
          quantity,
          totalPrice: product.price * quantity,
        };
      
        cartItemsVar([...currentCart, newItem]);
        toast.success("Product added to cart!");
      };

      const likedItems = useReactiveVar(likedItemsVar);
      const isLiked = likedItems.some((item) => item.id === product.id);

      const toggleLike = (product: ProductDescription) => {
        const isLiked = likedItems.some((item) => item.id === product.id);
      
        if (isLiked) {
          likedItemsVar(likedItems.filter((item) => item.id !== product.id));
          toast.info("Removed from Likes");
        } else {
          likedItemsVar([...likedItems, product]);
          toast.success("Added to Likes");
        }
      }; 
      const [currentSlide, setCurrentSlide] = useState(0)
      const [loaded, setLoaded] = useState(false)
      const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        mode: "snap",
        slides: {
          perView: 1,
          spacing: 5,
        },
        slideChanged(slider) {
          setCurrentSlide(slider.track.details.rel)
        },
        created() {
          setLoaded(true)
        },
      })

  return (
    <>
      <div className="max-w-[1536px] ">
        <div className=" bg-[#F8F8F8] py-[5vh] px-[3vh] md:py-[10vh] overflow-x-hidden">
        <div className="w-full flex flex-col items-center pb-4 bg-white rounded-[10px] md:hidden">
      {product?.images?.length > 0 && (
        <>
          <div ref={sliderRef} className="keen-slider w-full">
            {product.images.map((img: any, i: any) => (
              <div key={i} className="keen-slider__slide flex h-[37%] justify-center overflow-x-hidden">
                <Image
                  className="object-contain w-full h-full"
                  src={img}
                  alt={`Product image ${i + 1}`}
                  width={265}
                  height={37}
                />
              </div>
            ))}
          </div>

          {/* Dots */}
          {loaded && instanceRef.current && (
            <div className="flex space-x-2">
              {product.images.map((_: any, idx: any) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`w-2.5 h-2.5  rounded-full transition-colors ${
                    currentSlide === idx ? "bg-black" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
          <div className="w-full md:w-[85%] mx-auto">
            <div className="w-full block md:flex gap-[8%] pb-[10vh]">
             {/* Left Image Block */}
              <div className="md:w-[45%] hidden md:block">
                {/* Large Main Image */}
                <div className="w-full flex justify-center bg-white rounded-[10px] ">
                  {product?.images?.[0] && (
                    <Image
                      className="w-[265px] h-[350px] object-contain"
                      src={product.images[0]}
                      alt="Main product image"
                      width={265}
                      height={350}
                    />
                  )}
                </div>

                {/* Two Smaller Thumbnails */}
                <div className="flex w-full justify-between mt-[15px]">
                  {product?.images?.slice(1, 3).map((img: string, i: number) => (
                    <div key={i} className="bg-white w-[48%] flex justify-center rounded-[10px]">
                      <Image
                        className="h-[175px] w-[133px] object-contain"
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        width={133}
                        height={175}
                      />
                    </div>
                  ))}
                </div>
              </div>


              {/* Right Product Details */}
              
              {product && (
                
                          <div className="flex flex-col gap-[25px] relative mt-[5vh] md:mt-[0vh]">
                            {product.stock === 0 && (
                              <div className="absolute top-1 md:top-3 right-0 bg-red-500 text-white text-[12px] font-semibold px-3 py-1 rounded-bl z-10">
                                Out of Stock
                              </div>
                            )}

                            <h2 className="w-full font-sans text-[24px] font-400 md:text-[32px] md:font-[600]">
                              {product.name}
                            </h2>

                            <p className="hidden md:flex w-full text-[16px] font-[500] font-sans text-[#939090]">
                              {product.description}
                            </p>


                            {(() => {
                              const { averageRating = 0, totalReviews = 0 } = product;
                              const fullStars = Math.floor(averageRating);
                              const hasHalfStar = averageRating % 1 >= 0.5;
                              const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                              return (
                                <p className="w-full -mt-[20px] flex items-center md:hidden text-[16px] text-[#ff4c3b]">
                                  {Array(fullStars).fill(0).map((_, i) => (
                                    <AiFillStar key={`full-${i}`} />
                                  ))}
                                  {hasHalfStar && <AiFillStar className="opacity-50" />}
                                  {Array(emptyStars).fill(0).map((_, i) => (
                                    <AiOutlineStar key={`empty-${i}`} />
                                  ))}
                                  <span className="text-sm text-gray-600 ml-1">({totalReviews})</span>
                                </p>
                              );
                            })()}


                            <p className="font-[700] -mt-[20px] md:-mt-[0px] font-sans text-[20px]">
                              ₦ {(product.price * quantity).toLocaleString()}
                            </p>

                            <div className="font-[600] hidden text-[12px] md:flex justify-between items-center">
                              <div>
                                <span
                                  onClick={product.stock > 0 ? decreaseQty : undefined}
                                  className={`rounded-[3px] py-[7px] px-[12px] ${
                                    product.stock > 0 ? "bg-[#55A7FF] text-white cursor-pointer" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  }`}
                                >
                                  -
                                </span>
                                <span className="rounded-[3px] py-[7px] px-[12px] bg-white">
                                  {quantity}
                                </span>
                                <span
                                  onClick={product.stock > quantity ? increaseQty : undefined}
                                  className={`rounded-[3px] py-[7px] px-[12px] ${
                                    product.stock > quantity ? "bg-[#55A7FF] text-white cursor-pointer" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  }`}
                                >
                                  +
                                </span>
                              </div>

                              <div
                                onClick={() =>
                                  product.stock > 0
                                    ? toggleLike(product)
                                    : toast.error("Cannot like out-of-stock product")
                                }
                                className={`cursor-pointer ${product.stock === 0 ? "pointer-events-none opacity-40" : ""}`}
                              >
                                {isLiked ? (
                                  <AiFillHeart className="text-red-500 text-[24px]" />
                                ) : (
                                  <CiHeart className="text-[24px] text-blue-500" />
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                product.stock > 0
                                  ? handleAddToCart()
                                  : toast.error("Product is out of stock")
                              }
                              className={`hidden md:flex gap-[8px] py-[10px] w-[150px] rounded-[5px] px-[16px] font-[600] items-center text-[16px] text-white ${
                                product.stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF4C3B]"
                              }`}
                              disabled={product.stock === 0}
                            >
                              <span>Add to cart</span>
                              <RiShoppingCart2Line className="text-[18px] font-[700]" />
                            </button>

                            <div className="hidden md:flex bg-[#F5FAFF] font-sans w-[340px] h-[75px]">
                              <div className="flex h-[100%] w-[100%] justify-around items-center">
                                <div className="w-[180px] h-[42px] flex">
                                  <Image
                                    className="w-[45px] h-[45px] rounded-[50%]"
                                    src={product.seller.profilePicture}
                                    alt=""
                                    width={45}
                                    height={45}
                                  />
                                  <div className="flex flex-col justify-between ml-2">
                                    <p className="font-[600] text-[12px]">
                                      {product.seller.businessName}
                                    </p>
                                    <p className="text-[#939090] font-[400] text-[10px]">
                                      {getReviews?.productReviews?.length
                                        ? `(${(
                                            getReviews.productReviews.reduce(
                                              (sum: number, review: any) => sum + review.rating,
                                              0
                                            ) / getReviews.productReviews.length
                                          ).toFixed(1)} ⭐)`
                                        : "(No ratings yet)"}
                                    </p>
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
                        )}
                        </div>

                       {/* Tabs */}
                       <div className="hidden md:block bg-white pt-[20px] w-full">
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
              {activeTab === "details" && product?.extendedDescription && (
                    <>
                      {product.extendedDescription
                        .split('\n')
                        .map((paragraph: string, index: number) => (
                          <p key={index} className="mt-2">{paragraph.trim()}</p>
                        ))}
                    </>
                  )}

                  {activeTab === "reviews" && (
                    <>
                      <p className="font-semibold text-lg">Customer Reviews:</p>

                      {reviewLoading ? (
                        <p>Loading reviews...</p>
                      ) : reviewError ? (
                        <p className="text-red-500">Error loading reviews.</p>
                      ) : getReviews?.productReviews.length === 0 ? (
                        <p>No reviews yet for this product.</p>
                      ) : (
                        getReviews.productReviews.map((review: any, i: number) => (
                          <div key={i} className="bg-[#f9f9f9] p-4 rounded-md shadow mt-2">
                            <p className="font-medium">{review.user.name}</p>
                            <p>{"⭐️".repeat(review.rating)}</p>
                            <p>{review.comment}</p>
                          </div>
                        ))
                      )}
                    </>
                  )}

              {activeTab === "seller" && product?.seller && (
                <>
                  {[product.seller].map((seller, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start bg-white px-6 py-4 "
                    >
                      {/* Left side: Shop Info */}
                      <div className="flex flex-col space-y-2 max-w-[52%]">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-lg font-semibold">{seller.businessName}</span>
                          <div className="flex items-center gap-1 text-gray-500 text-[12px]">
                            <span>({product.averageRating.toFixed(2)}) Ratings</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-800 leading-[1.4]">
                        Luxury Travels is a high-end travel company that provides exclusive, bespoke travel experiences for romantic getaways,
                        family vacations, and corporate retreats. They offer expert travel advice and concierge services, focusing on luxury and
                        exclusivity, to create personalized travel itineraries for their clients.
                        </p>
                      </div>

                      {/* Right side: Stats and Button */}
                      <div className="flex flex-col items-start justify-between text-sm text-gray-700 min-w-[170px]">
                        <p>
                           <span className="font-medium">Joined On:</span>{" "}
                          {seller.joinedDate}
                        </p>
                        <p>
                          <span className="font-medium">Total Products:</span>{" "}
                          {myProductData?.myProducts?.length || 0}
                        </p>
                        <p>
                          <span className="font-medium">Total Reviews:</span>{" "}
                          {getReviews?.productReviews?.length || 0}
                        </p>
                        <button
                          className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Visit Shop
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
              </div>
              </div>

              <div className="w-full -mt-[6vh] px-4 md:hidden">
                {/* Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    className={`border rounded-lg text-[16px] px-4 py-3 w-1/2 ${
                      activeButton === "description"
                        ? "bg-[#007bff] text-white border-[#007bff]"
                        : "bg-transparent text-[#007bff] border-[#cce5ff]"
                    }`}
                    onClick={() => setActiveButton("description")}
                  >
                    Description
                  </button>

                  <button
                    className={`border rounded-lg text-[16px] px-4 py-3 w-1/2 ${
                      activeButton === "seller"
                        ? "bg-[#007bff] text-white border-[#007bff]"
                        : "bg-transparent text-[#007bff] border-[#cce5ff]"
                    }`}
                    onClick={() => setActiveButton("seller")}
                  >
                    Seller's Details
                  </button>
                </div>

                {/* Tab Content */}
                  {activeButton === "description" && (
                <div className="mt-4 border border-[#cce5ff] rounded-lg p-4 text-[15px] leading-relaxed">

                    <div>
                      <h2 className="font-semibold mb-2">Product Description</h2>
                      {product && (
                      <p>
                        {product.description}
                      </p>
                       )}
                    </div>
                    </div>
                  )}

                {activeButton === "seller" && (
                <div className="mt-4 border border-[#cce5ff] rounded-lg p-4 text-[15px] leading-relaxed">

                  <div className=" p-4 flex flex-col shadow-sm w-full">
                    {product.seller &&
                      [product.seller].map((seller: any, index: number) => (
                        <React.Fragment key={index}>
                          <div className="flex gap-[2vh]">
                          <Image
                            src={seller.profilePicture}
                            width={18}
                            height={18}
                            alt={seller.name}
                            className="w-18 h-18 rounded-full object-cover"
                          />
                          <div className="flex-col">
                          <h3 className="mt-2 font-semibold text-[16px]">{seller.name}</h3>
                          <p className="text-gray-500 text-sm">{seller.location}</p>
                          </div>
                          </div>

                         

                          <div className="flex gap-2 mt-4 justify-center">
                            <button onClick={()=>setIsModalOpen(true)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-[12px] px-4 py-2 rounded">
                              <MdEmail size={16} />
                              Message
                            </button>
                            <button className="flex items-center gap-1 border border-blue-500 text-blue-500 text-[12px] px-4 py-2 rounded hover:bg-blue-50">
                              <FaStore size={16} />
                              View Shop
                            </button>
                          </div>

                          <button className="mt-3 flex justify-end gap-1 text-red-500 text-xs hover:underline">
                            ⚠ Report this account
                          </button>
                        </React.Fragment>
                      ))}
                  </div>
              </div>

                )}

              </div>

            {/* Review Form */}
            <div className="w-[95%] mt-[15px] md:mt-[30px] ">
                            <button
                                className="bg-none text-[#007bff] underline md:no-underline  hover:text-black md:hover:bg-blue-700 md:bg-[#007bff] md:text-white px-4 py-2 rounded"
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
            <div className="w-full -mt-[7vh] md:-mt-[0vh] bg-[#F8F8F8] pt-[12vh] pb-[10vh]">
                    <h1 className="text-[20px] font-[700] md:font-[500] md:text-[32px] font-sans w-[85%] ">Related Products</h1>
           
                    <div className="bg-[#F8F8F8] w-[100%] mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                         <ProductFrame data={{ relatedProducts: relatedData?.relatedProducts?.slice(0, 8) || [] }} />
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
                    className="bg-white rounded-lg p-6 w-[80%] max-w-[400px] shadow-xl relative"
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
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button  onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
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
  const handleAddToCart = (product: RelatedProduct) => {
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
    
            const toggleLike = (product: RelatedProduct) => {
              const isLiked = likedItems.some((item) => item.id === product.id);
            
              if (isLiked) {
                likedItemsVar(likedItems.filter((item) => item.id !== product.id));
                toast.info("Removed from Likes");
              } else {
                likedItemsVar([...likedItems, product]);
                toast.success("Added to Likes");
              }
            };
            console.log("relatedProducts", data?.relatedProducts);

  
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
                {stock === 0 && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/70 bg-opacity-50 flex items-center justify-center z-10">
                    <span className="text-white text-sm font-semibold">Out of Stock</span>
                  </div>
                )}

                  <Image
                    src={product.images[0] || iphoneImage}
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
      </>
    );
  };