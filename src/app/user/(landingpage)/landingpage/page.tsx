"use client"

import Image from "next/image";
import int98 from "../../../../../public/figma images/INT (98) 1.png"
import bagPexel from "../../../../../public/figma images/pexels-george-dolgikh-1666067 1.png"
import { BsCart3 } from "react-icons/bs";
import { BsBookmarkCheck } from "react-icons/bs";
import { LuRotateCw } from "react-icons/lu";
import { IoIosHeartEmpty } from "react-icons/io";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import iphoneImage from "../../../../../public/figma images/Frame 479.png"
import { IoCartOutline } from "react-icons/io5";
import laptopLogo from "../../../../../public/figma images/bram-naus-N1gUD_dCvJE-unsplash-removebg-preview 1.png"
import starLogo from "../../../../../public/figma images/Frame 498.png"
import tamanna from "../../../../../public/figma images/tamanna-rumee-eD1RNYzzUxc-unsplash 1.png"
import cosmetics from "../../../../../public/figma images/Frame 493 2.png"
import clothing from "../../../../../public/figma images/Frame 493 (1).png"
import furniture from "../../../../../public/figma images/Frame 493 (2).png"
import automobile from "../../../../../public/figma images/Frame 493 (3).png"
import food from "../../../../../public/figma images/Frame 493 (4).png"
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import react, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify"
import { cartItemsVar } from "@/shared/lib/apolloClient";
import { likedItemsVar } from "@/shared/lib/apolloClient";
import { useReactiveVar } from "@apollo/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { AnimatePresence, motion } from "framer-motion";
import { FaAngleDown } from "react-icons/fa6";

const GET_LANDING_PRODUCTS = gql`
  query GetLandingProducts($featuredLimit: Int!, $dealsLimit: Int!) {
    autoFeaturedProducts(limit: $featuredLimit) {
      id
      name
      price
      averageRating
      totalReviews
      description
      category
      stock
      images
      slug
    }
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

  const categories = [
  {
    id: 1,
    name: "Computers & Laptops",
    slug: "computers-laptops",
    image: laptopLogo
  },
  {
    id: 2,
    name: "Cosmetics & Body Care",
    slug: "cosmetics-body-care",
    image: cosmetics
  },
  {
    id: 3,
    name: "Clothing & Shoes",
    slug: "clothing-shoes",
    image: clothing
  },
  {
    id: 4,
    name: "Furniture & Outdoors",
    slug: "furniture-outdoors",
    image: furniture
  },
  {
    id: 5,
    name: "Automobiles & Parts",
    slug: "automobiles-parts",
    image: automobile
  },
  {
    id: 6,
    name: "Food & Groceries",
    slug: "food-groceries",
    image: food
  }
];

type FAQItemProps = {
  faq: {
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onClick: () => void;
};

const AccordionItem = ({ faq, isOpen, onClick }: FAQItemProps) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onClick}
      className="w-full text-left py-3 sm:py-4 h-auto sm:h-[85px] md:h-[100px] lg:h-[115px] bg-[#F5FAFF] lg px-3 sm:px-4 flex justify-between items-center"
    >
      <span className="font-normal text-[14px] sm:text-[14px] md:text-[16px] lg:text-[20px] xl:text-[24px] font-sans">
        {faq.question}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <FaAngleDown className="text-lg sm:text-xl md:text-2xl lg:text-[24px]" />
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="px-3 sm:px-4 pb-3 sm:pb-4 my-2 sm:my-[10px] text-sm sm:text-base md:text-lg lg:text-xl xl:text-[20px] overflow-hidden"
        >
          {faq.answer}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

 const faqData = [
    {
      question: "What is Time Shoppy?",
      answer:
        "Time Shoppy is an online marketplace that connects sellers and buyers, offering a wide range of products with fast and reliable delivery.",
    },
    {
      question: "How much does it cost to upload products for sale?",
      answer:
        "Uploading products is completely free. However, a small commission is charged only when a sale is successfully completed.",
    },
    {
      question: "What happens if a delivery is not made on time?",
      answer:
        "If a delivery is delayed, Time Shoppy will notify the buyer and offer compensation in the form of coupons or partial refunds depending on the situation.",
    },
    {
      question: "How many days does it take for an order to be delivered?",
      answer:
        "Orders are typically delivered within 3–5 business days. Delivery times may vary depending on the buyer's location and the product type.",
    },
    {
      question: "How many days does it take for an order to be delievered?",
      answer:
        "Delivery usually takes 3–5 business days, but high-demand periods may extend it slightly. Real-time tracking is available for every order.",
    },
    {
      question: "How many days does it take for an order to be delievered?",
      answer:
        "Standard delivery is 3–5 days, while express shipping options are available at checkout for faster delivery.",
    },
    {
      question: "How many days does it take for an order to be delievered?",
      answer:
        "We aim to deliver within 3 to 5 working days. You'll get updates via email and SMS as your package moves.",
    },
  ];

const LandingPage = ({featuredLimit = 8, dealsLimit = 4}) => {
   const [openIndex, setOpenIndex] = useState<number | null>(null);
    const { data, loading, error } = useQuery(GET_LANDING_PRODUCTS, {
        variables: { featuredLimit, dealsLimit },
      });
    
    const router = useRouter();

    const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };


    const handleCategoryClick = (category: string) => {
      const slug = category
        .replace(/&/g, "and")
        .replace(/\s+/g, "-")
        .toLowerCase();
    
      router.push(`/user/category/${slug}`);
    };

    if (loading) {
    return (
      <div className="flex justify-center h-[20vh] items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 bg-red-50 p-4 rounded-lg text-center font-medium">
        Error: {error.message}
      </p>
    );
  }
    
    const featuredProducts = data?.autoFeaturedProducts || [];
    const bestDeals = data?.bestDeals || [];

    return ( 
        <>
        
        <div className="mx-auto bg-[white] md:bg-[#F8F8F8] flex flex-col">

             <div className="w-full h-[300px] md:h-[500px] lg:h-[550px] bg-[#f5f8fd] md:bg-[#cbe5fe] relative overflow-hidden">
              {/* Main product image */}
              <Image 
                className="h-[100%] w-auto absolute bottom-0 right-[2%] object-contain opacity-30 sm:opacity-30 md:opacity-50 lg:opacity-100 transition-opacity duration-300" 
                src={int98} 
                alt="Main product showcase" 
                priority
              />
              
              {/* Decorative images */}
              <Image 
                className="opacity-30 left-0 sm:left-[7%] -rotate-[165deg] absolute top-[-70px] w-[300px] h-[200px] sm:w-[500px] sm:h-[300px] md:w-[600px] md:h-[350px] lg:w-[700px] lg:h-[420px] object-cover" 
                src={bagPexel} 
                alt="Decorative background" 
              />
              <Image 
                className="absolute bottom-0 right-[3%] w-[150px] h-auto sm:w-[200px] md:w-[250px] opacity-70" 
                src={bagPexel} 
                alt="Secondary decorative element" 
              />
              
              {/* Text */}
              <div className="absolute inset-0 flex items-center justify-center sm:justify-start sm:items-center z-10 px-4 ">
                <div className="text-center sm:text-left w-3/4 sm:w-3/4 h-auto lg:mt-20 md:mt-16 sm:h-[70%] max-w-[410px] sm:ml-[10%] md:ml-[15%] flex flex-col justify-start items-center sm:items-start gap-4 sm:gap-4 md:gap-5 lg:gap-8 xl:gap-10 2xl:gap-12">
                  <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[48px] text-[#272222] leading-tight font-serif">
                    Shop near you easily & on-time
                  </h2>
                  <p className="text-sm sm:text-sm md:text-lg lg:text-xl font-light font-sans text-[#272222]">
                    Variety of stores with unique and ordinary products just for you!
                  </p>
                  <button 
                    className="font-semibold text-xs sm:text-sm md:text-base lg:text-2xl text-white px-5 py-3 md:px-10 md:py-3 lg:px-7 lg:py-4 rounded-full sm:rounded-full lg:rounded-lg bg-[#FF4C3B] font-sans sm:self-start"
                    onClick={() => router.push('/user/products')}
                  >
                    Explore products
                  </button>
                </div>
              </div>
            </div>

           <div className="w-full bg-[#F8F8F8]">
             <div className="w-[85%] p-6 md:flex-row justify-between mx-auto h-auto md:h-[100px] px-[30px] bg-white rounded-[20px] gap-4 hidden md:flex lg:flex xl:flex 2xl:flex md:gap-0 my-[25px]">
                <div className="flex items-center gap-[14px]">
                    <div className="text-[64px] text-blue-500"><BsCart3 /></div>
                    <div>
                        <p className="text-[16px] font-[500] font-sans" >24hr Delivery</p>
                        <p className="text-[16px] font-[500] font-sans text-[#939090]">Get goods delivered within 24hrs</p>
                    </div>
                </div>

                <div className="flex items-center gap-[14px]">
                    <div className="text-[64px] text-blue-500"><LuRotateCw /></div>
                    <div>
                        <p className="text-[16px] font-[500] font-sans" >Daily Surprise Offers</p>
                        <p className="text-[16px] font-[500] font-sans text-[#939090]">Save up to 25% off</p>
                    </div>
                </div>

                <div className="flex items-center gap-[14px]">
                    <div className="text-[64px] text-blue-500"><BsBookmarkCheck /></div>
                    <div>
                        <p className="text-[16px] font-[500] font-sans" >Secure payments</p>
                        <p className="text-[16px] font-[500] font-sans text-[#939090]">100% protected transactions</p>
                    </div>
                </div>
             </div>
           </div>

           <div className="w-full bg-[#F8F8F8] hidden sm-md:block md:block lg:block xl:block 2xl:block">

              <div className="w-[85%] mx-auto flex flex-wrap justify-between bg-white py-[30px] rounded-[20px] gap-y-[20px]">
                  <div
                    onClick={() => handleCategoryClick("Computers & Laptops")}
                    className="flex items-center justify-center sm:w-1/2 md:w-1/3 gap-[10px] py-[12px] cursor-pointer"
                  >
                    <Image className="top-[-70px] w-[105px] h-[110px]" src={laptopLogo} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Computers & Laptops</p>
                  </div>

                  <div
                    onClick={() => handleCategoryClick("Cosmetics & Body care")}
                    className="flex items-center justify-center sm:w-1/2 md:w-1/3 gap-[10px] py-[12px] border-x-[1px] border-[#e9e8e8] cursor-pointer"
                  >
                    <Image className="top-[-70px] w-[105px] h-[110px]" src={cosmetics} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Cosmetics & Body care</p>
                  </div>

                  <div
                    onClick={() => handleCategoryClick("Clothing & Shoes")}
                    className="flex items-center justify-center sm:w-1/2 md:w-1/3 gap-[10px] py-[12px] cursor-pointer"
                  >
                    <Image className="top-[-70px] w-[105px] h-[110px]" src={clothing} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Clothing & Shoes</p>
                  </div>

                  <div
                    onClick={() => handleCategoryClick("Furniture & Outdoors")}
                    className="flex items-center justify-center sm:w-1/2 md:w-1/3 gap-[10px] py-[12px] cursor-pointer"
                  >
                    <Image className="top-[-70px] w-[105px] h-[110px]" src={furniture} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Furniture & Outdoors</p>
                  </div>

                  <div
                    onClick={() => handleCategoryClick("Automobiles & Spare parts")}
                    className="flex items-center justify-center sm:w-1/2 md:w-1/3 gap-[10px] py-[12px] border-x-[1px] border-[#e9e8e8] cursor-pointer"
                  >
                    <Image className="top-[-70px] w-[105px] h-[110px]" src={automobile} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Automobiles & Spare parts</p>
                  </div>

                  <div
                    onClick={() => handleCategoryClick("Food, Grocery & Beverages")}
                    className="flex items-center justify-center sm:w-1/2 md:w-1/3 gap-[10px] py-[12px] cursor-pointer"
                  >
                    <Image className="top-[-70px] w-[105px] h-[110px]" src={food} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Food, Grocery & Beverages</p>
                  </div>
                </div>


           </div>

                       
             <section 
              className="py-8 lg:hidden md:hidden block"
               style={{
                background: 'linear-gradient(to right, #007BFF66 0%, #007BFF33 30%, #007BFF33 60%, #6f9fd333 100%)'
              }}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-medium leading-[100%] font-serif mb-6 text-center text-[#3f3c3c]">
                  Explore Popular Categories
                </h2>

                <div className="">
                  <Swiper
                    modules={[Pagination]}
                     pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        dynamicMainBullets: 3 // This limits the visible bullets to 3
                      }}
                    spaceBetween={16}
                    slidesPerView={2}
                    breakpoints={{
                      360: { slidesPerView: 1.8 },
                      480: { slidesPerView: 2.5 },
                      640: { slidesPerView: 3 },
                    }}
                    className="h-[300px]"
                  >
                    {categories.map((category) => (
                      <SwiperSlide key={category.id}>
                        <div
                          onClick={() => handleCategoryClick(category.name)}
                          className="flex flex-col bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer w-[200px] h-[250px]"
                        >
                          <div className=" relative w-full h-[180px] border-b-1 border-gray-400 rounded-t-xl overflow-hidden">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className=" w-[100%] h-[100%]"
                            />
                          </div>
                        <div className="w-full h-[70px] flex items-center justify-center bg-white rounded-b-xl">
                          <p className="text-sm font-medium text-[#272222] leading-[100%] font-sans">
                            {category.name}
                          </p>
                        </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </section>


            <div className="w-full bg-[#F8F8F8] pt-[12vh] pb-[10vh] hidden md:block lg:block xl:block 2xl:block">
              <h1 className="font-[500] text-[32px] font-sans w-[85%] mx-auto px-4 sm:px-0">Best Deals</h1>
              <div className="bg-[#F8F8F8] w-full sm:w-[85%] mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 sm:p-4 justify-items-center">
                <ProductFrameOne data={{ bestDeals: data?.bestDeals?.slice(0, 4) || [] }} />
              </div>
            </div>

             <section className="py-12 bg-white lg:hidden md:hidden block">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-medium leading-[100%] font-serif mb-2 text-center text-[#007BFF]">
                  Shop Popular Items
                </h2>
                <p className="text-sm font-light leading-[100%] font-sans mb-6 text-center text-[#474444]]">Our highest sold products of the week</p>

                <Swiper
                  modules={[Pagination]}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                      dynamicMainBullets: 3 // This limits the visible bullets to 3
                    }}
                  spaceBetween={16}
                  slidesPerView={2}
                  breakpoints={{
                    360: { slidesPerView: 1.8 },
                    480: { slidesPerView: 2.5 },
                    640: { slidesPerView: 3.5 },
                  }}
                  className="h-[310px]"
                >
                  {(data?.bestDeals || []).map((product: DealProduct) => {
                    const { averageRating = 0 } = product;
                    const fullStars = Math.floor(averageRating);
                    const hasHalfStar = averageRating % 1 >= 0.5;
                    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                    
                    return (
                      <SwiperSlide key={product.id}>
                        <div className="flex flex-col bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer w-[200px] h-[250px]">
                          <div className="relative w-full h-[160px] overflow-hidden rounded-t-xl">
                            <Image
                              src={product.images[0] || iphoneImage}
                              alt={product.name}
                              fill
                              className=" w-[100%] h-[100%]r"
                            />
                          </div>
                          <div className="w-full h-[90px] flex flex-col items-start px-3 justify-center bg-white rounded-b-xl">
                            <p className="text-sm font-medium text-[#272222] leading-[100%] font-sans">
                            {product.name}
                          </p>
                          <div className="flex items-center text-[#FF4C3B] text-[12px] mt-1">
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
                            <p className="text-xs text-gray-600 ml-1">({product.totalReviews})</p>
                          </div>
                          <p className="text-sm text-[black] font-bold mt-1">NGN {product.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
          </section>

                      
           <div className="w-full bg-[#F8F8F8] pt-[6vh] hidden md:block lg:block xl:block 2xl:block">
            <h1 className="font-[500] text-[32px] font-sans w-[85%] mx-auto ">Popular Events</h1>
            <div className="w-[85%] mx-auto mt-[20px] flex flex-col md:flex-row rounded-[10px] justify-between bg-white py-[10px]">
                <div className="flex justify-center">
                  <Image className="w-[280px] sm:w-[350px] md:w-[420px] h-auto aspect-[3/2] md:ml-[70px]" src={iphoneImage} alt="" />
                </div>
                <div className="flex items-center justify-center md:justify-end px-4 md:px-0 md:mr-[130px]">
                  <p className="font-[500] text-2xl md:text-[32px] font-sans my-4 md:mt-[60px] text-center md:text-left">Iphone 14pro max 8/256gb</p>
                </div>
            </div>
           </div>
                
  
           <div className="w-full bg-[#F8F8F8] pt-[12vh] pb-[20vh] hidden md:block lg:block xl:block 2xl:block">
              <h1 className="font-[500] text-[32px] font-sans w-[85%] mx-auto">Featured Products</h1>
      
              <div className="bg-[#F8F8F8] w-[85%] mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                    <ProductFrameTwo data={{ featuredProducts: data?.autoFeaturedProducts?.slice(0, 8) || [] }} />
              </div>
           </div>

           <div className="w-[85%] my-[10px] md:my-0 lg:w-full h-[350px] md:h-[450px] relative bg-[white] md:bg-[#F8F8F8] mx-auto ">
             <Image className="h-[100%] absolute top-0 w-full object-cover rounded-2xl lg:rounded-none" src={tamanna} alt="" />
             <div className="relative w-[85%] pt-[5vh] mx-auto flex flex-col items-center justify-center rounded-lg lg:rounded-none h-full lg:items-start lg:justify-start">
                <p className="text-[32px] md:text-[48px] font-serif font-[400] w-[85%] md:max-w-[400px] text-white text-center ">This is how good vendors find good customers</p>
                <button className="bg-[#FF4C3B] px-8 md:px-[56px] py-3 md:py-[17px] mt-[30px] rounded-full lg:rounded-[16px]  text-white font-sans font-[600] text-lg md:text-[24px]">
                    Learn more
                </button>
             </div>
           </div>

           <div className="w-full bg-[white] pt-[5vh] pb-[5vh]">
            <div className="w-[85%] mx-auto flex items-center flex-col py-[10vh] gap-[20px] px-4 border border-[#CCE5FF] rounded-[20px] lg:border-none lg:rounded-none lg:px-0">
              <p className="font-[400] text-3xl md:text-[40px] font-sans text-[#007BFF] text-center">Why Time Shoppy?</p>
              <p className="text-xl md:text-[32px] font-[400] font-sans max-w-[1000px] text-center">
                Our mission is fast and seamless delivery. Vendors deserve to get their payments on time, just as our shoppers deserve to have their products delivered within 24 hours.
              </p>
              <button className="bg-[#FF4C3B] px-8 md:px-[56px] py-3 md:py-[17px] mt-[30px] rounded-[16px] text-white font-sans font-[600] text-lg md:text-[24px]">
                Go to About Us
              </button>
           </div>
           </div>

           <div className="w-full bg-[white] block lg:hidden md:hidden pt-[5vh] pb-[8vh]">
           <div className="w-[85%] mx-auto my-6 sm:my-8 md:my-10 lg:my-[40px] border border-[#CCE5FF] rounded-3xl p-5">
          <h2 className="font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-center font-serif text-[#55A7FF]">
            Frequently Asked Questions
          </h2>

          <div className="w-full sm:w-[90%] md:w-[85%] mx-auto mt-4 sm:mt-6 md:mt-8 flex flex-col gap-4 rounded-lg sm:rounded-lg md:rounded-xl">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => toggle(index)}
              />
            ))}
          </div>
        </div>
        </div>

           <div className="w-full bg-[#F8F8F8] h-auto md:h-[350px] items-center py-8 md:py-0 hidden md:flex lg:flex xl:flex 2xl:flex">
            <div className="h-auto md:h-[170px] flex flex-col md:flex-row items-center bg-[#007BFF] w-[85%] mx-auto justify-between p-6 md:px-[50px] rounded-[10px] gap-4 md:gap-0">
                <div className="h-full flex items-center">
                    <p className="text-xl md:text-[32px] font-sans font-[500] max-w-[430px] text-white text-center md:text-left">
                      Subscribe to get news and letters with amazing offers!
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-[20px] w-full sm:w-auto">
                    <input 
                      className="w-full sm:w-[255px] h-[42px] placeholder:font-sans pl-4 bg-white rounded-[5px] placeholder:text-[#939090] placeholder:text-[16px]" 
                      type="text" 
                      placeholder="Enter email address" 
                    />
                    <button className="bg-[#FF4C3B] w-full sm:w-auto px-4 sm:px-[28px] py-2 sm:py-[9px] rounded-[5px] text-white font-sans font-[600] text-[16px]">
                      Submit
                    </button>
                </div>
            </div>
           </div>
        </div>
        </>
     );
}

export default LandingPage;

import { AiFillStar, AiOutlineStar } from "react-icons/ai";

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
                  src={product.images[0] || iphoneImage}
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

export const ProductFrameTwo = ({ data }: { data: { featuredProducts: FeaturedProduct[] } }) => {
  const handleAddToCart = (product: FeaturedProduct) => {
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

    return (
      <>
        {data?.featuredProducts?.map((product: FeaturedProduct) => {
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
                      <span className="text-red-500">Out of Stock </span>
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