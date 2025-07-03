"use client"

import Image from "next/image";
import int98 from "../../../../public/figma images/INT (98) 1.png"
import bagPexel from "../../../../public/figma images/pexels-george-dolgikh-1666067 1.png"
import { BsCart3 } from "react-icons/bs";
import { BsBookmarkCheck } from "react-icons/bs";
import { LuRotateCw } from "react-icons/lu";
import { IoIosHeartEmpty } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import iphoneImage from "../../../../public/figma images/Frame 479.png"
import { IoCartOutline } from "react-icons/io5";
import laptopLogo from "../../../../public/figma images/bram-naus-N1gUD_dCvJE-unsplash-removebg-preview 1.png"
import starLogo from "../../../../public/figma images/Frame 498.png"
import tamanna from "../../../../public/figma images/tamanna-rumee-eD1RNYzzUxc-unsplash 1.png"
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import react, { useState } from "react";
import Link from "next/link";

const get_all_products = gql`query GetAllProducts($limit: Int!, $offset:Int!) {
    allProducts(limit:$limit, offset:$offset) {
      id
      name
      slug
      description
      price
      images
      category
      subCategory
      condition
      averageRating
      stock
      createdAt
      seller {
        id
        name
        email
      }
    }
  }`

  type Product = {
    id: string;
    name: string;
    category: string;
    description: string;
    subCategory: string;
    color: string;
    condition: string;
    minimumOrder: number;
    stock: number;
    price: number;
    images: string[];
    slug: string;
    createdAt: string;
    seller: {
      id: string;
      name: string;
      email: string;
    };
}
  

const LandingPage = () => {
    const [page, setPage] = useState(1);
    const limit = 3;
    const offset = (page - 1) * limit;
    const { data, loading, error } = useQuery(get_all_products, {variables:{limit, offset}});
    const router = useRouter();
    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;
    console.log(data);
    
    return ( 
        
        <>
        <div className="max-w-[1536px] ">

            <div className="w-full h-[550px] bg-[#CCE5FF] relative -z-30">
             <Image className="h-[98%] w-[650px] absolute bottom-0 right-[2%] " src={int98} alt="" />
             <Image className="opacity-30 left-[7%]  -rotate-[165deg] absolute top-[-70px] -z-20 w-[700px] h-[420px]" src={bagPexel } alt="" />
             <Image className=" absolute bottom-0  right-[3%]" src={bagPexel} alt="" />
             <div>
            
                <div className="w-[410px] absolute top-[20%] left-[15%]">
                    <h2 className="font-[900] text-[48px]  ">Shop near you easily & on-time</h2>
                    <p className="text-[24px] font-[300] font-sans mt-[10px]">Variety of stores with unique and
                    ordinary products just for you!</p>
                    <button className="font-[600] text-[24px] text-white px-[40px] py-[15px] mt-[40px] rounded-[12px] bg-[#FF4C3B] font-sans"> Explore products</button>
                </div>
             </div>
           </div>

           <div className="w-full bg-[#F8F8F8] py-[20px]">
             
             <div className="w-[85%] flex justify-between mx-auto h-[100px] px-[30px] bg-white rounded-[20px]">

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

           <div className="w-full bg-[#F8F8F8]">

            <div className="w-[85%] mx-auto flex flex-wrap justify-between bg-white py-[30px] rounded-[20px] gap-y-[20px]">

                <div className="flex items-center justify-center sm:w-1/2 md:w-1/3 gap-[10px] py-[12px]">
                    <Image className="top-[-70px] w-[105px] h-[110px]" src={ laptopLogo} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Computers & Laptops</p>
                </div>

                <div className="flex items-center  sm:w-1/2 md:w-1/3 gap-[10px] justify-center py-[12px] border-x-[1px] border-[#e9e8e8]">
                    <Image className=" top-[-70px] w-[105px] h-[110px]" src={ laptopLogo} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Cosmetics & Body care</p>
                </div>
                <div className="flex items-center  sm:w-1/2 md:w-1/3 gap-[10px] justify-center py-[12px]">
                    <Image className=" top-[-70px] w-[105px] h-[110px]" src={ laptopLogo} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Clothing & Shoes</p>
                </div>
                <div className="flex items-center  sm:w-1/2 md:w-1/3 gap-[10px] justify-center py-[12px]">
                    <Image className=" top-[-70px]  w-[105px] h-[110px]" src={ laptopLogo} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Furniture & Outdoors</p>
                </div>
                <div className="flex items-center  sm:w-1/2 md:w-1/3 gap-[10px] justify-center py-[12px] border-x-[1px] border-[#e9e8e8]">
                    <Image className=" top-[-70px]  w-[105px] h-[110px]" src={ laptopLogo} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Automobiles & Spare parts</p>
                </div>
                <div className="flex items-center  sm:w-1/2 md:w-1/3 gap-[10px] justify-center py-[12px]">
                    <Image className=" top-[-70px] w-[105px] h-[110px]" src={ laptopLogo} alt="" />
                    <p className="text-[24px] font-[500] font-sans w-[190px]">Food, Grocery & Beverages</p>
                </div>

            </div>

           </div>

           <div className="w-full bg-[#F8F8F8] pt-[12vh]">
            <h1 className="font-[500] text-[32px] font-sans w-[85%] mx-auto ">Best Deals</h1>
            <div className=" bg-[#F8F8F8] w-[85%] mx-auto mt-[20px] flex  justify-between">
            <ProductFrame data={data} />
            <ProductFrame data={data} />
           

            </div>
           </div>

           <div className="w-full bg-[#F8F8F8] pt-[12vh]">
            <h1 className="font-[500] text-[32px] font-sans w-[85%] mx-auto ">Popular Events</h1>
            <div className=" w-[85%] mx-auto mt-[20px] flex rounded-[10px]  justify-between bg-white py-[10px]">
                <div><Image className=" top-[-70px] w-[420px] h-[280px] ml-[70px]" src={iphoneImage} alt="" /></div>
                <div><p className="font-[500] text-[32px]  font-sans mt-[60px] mr-[130px]">Iphone 14pro max 8/256gb </p></div>

       

            </div>
           </div>

           <div className="w-full bg-[#F8F8F8] pt-[12vh] pb-[20vh]">
            <h1 className="font-[500] text-[32px] font-sans w-[85%] mx-auto ">Featured Products</h1>
            <div className=" bg-[#F8F8F8] w-[85%] flex-wrap gap-y-[30px] mx-auto mt-[20px] flex  justify-between">

            <ProductFrame data={data} />
            <ProductFrame data={data} />
            <ProductFrame data={data} />
            <ProductFrame data={data} />
             
        


            </div>
           </div>


           <div className=" w-full h-[450px] relative">

           <Image className=" h-[100%] absolute top-0 w-full" src={tamanna} alt="" />

           <div className=" relative w-[85%] pt-[5vh] mx-auto">

            <p className="text-[48px] font-sans font-[400] w-[400px] text-white">This is how
                good vendors
                find good customers
            </p>

            <button className="bg-[#FF4C3B] px-[56px] py-[17px] mt-[30px] rounded-[16px] text-white font-sans font-[600] text-[24px]">
                Learn more
            </button>
           </div>

            
           </div>


           <div className="full flex items-center flex-col py-[10vh] gap-[20px]">
              <p className="font-[400] text-[40px] font-sans text-[#007BFF]">Why Time Shoppy?</p>

              <p className="text-[32px] font-[400] font-sans w-[1000px] text-center">Our mission is fast and seamless delivery. Vendors deserve to get their payments on time, just as our shoppers deserve to have their products delivered within 24 hours.</p>
              <button className="bg-[#FF4C3B] px-[56px] py-[17px] mt-[30px] rounded-[16px] text-white font-sans font-[600] text-[24px]">
              Go to About Us
            </button>

           </div>


           <div className="w-full bg-[#F8F8F8] h-[350px] flex items-center">

            <div className="h-[170px] flex items-center bg-[#007BFF] w-[85%] mx-auto justify-between px-[50px] rounded-[10px]">
                <div className="h-[100%] flex items-center">
                    <p className="text-[32px] font-sans font-[500] w-[430px] text-white">Subscribe to get news and
                    letters with amazing offers!</p>
                </div>

                <div className="flex items-center gap-[20px]">
                    <input className="w-[255px] h-[42px] placeholder:font-sans pl-4 bg-white rounded-[5px] placeholder:text-[#939090] placeholder:text-[16px]" type="text" placeholder="Enter email address" />
                    <button className="bg-[#FF4C3B] px-[28px] py-[9px]  rounded-[5px] text-white font-sans font-[600] text-[16px]">Submit</button>
                </div>
            </div>

           </div>

           


        </div>
            
        </>
     );
}
 
export default LandingPage;


export const ProductFrame = ({ data }: { data: { allProducts: Product[] } }) => {
    return (
        <>
            {data?.allProducts?.map((product: Product) => (
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
        <div className=" mx-auto w-[90%] ">
            
            <p className="text-[12px] font-[500] text-[#007BFF] font-sans mt-[10px]">{product.name}</p>
            <p className="font-sans font-[400] text-[16px] mt-[10px]">{product.description.length > 100 ? product.description.slice(0, 100) + "..." : product.description}</p>
            <Image className=" w-[112px] h-[16px] mt-[8px]" src={starLogo} alt="" />
            <p className="font-sans text-[16px] font-[600] mt-[15px]">{"NGN" + product.price}</p>
            <p className="text-[16px] font-[600] font-sans text-right text-[#FF4C3B]">{product.stock + " " + "available"}</p>


        </div>
        </Link>
    </div>
    ))}
    </>
    )
}