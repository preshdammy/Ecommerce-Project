"use client"
import React, { useEffect} from 'react';
import { useQuery, gql } from '@apollo/client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';


export const get_my_products = gql`
  query GetMyProducts {
    myProducts {
      id
      name
      category
      description
      subCategory
      color
      condition
      minimumOrder
      price
      images
      createdAt
      updatedAt
      slug
      averageRating
      totalReviews
      stock
      seller {
        id
        name
        email
      }
    }
  }
`

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  subCategory: string;
  color: string;
  condition: string;
  minimumOrder: number;
  price: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
  averageRating: number;
  totalReviews: number;
  stock: number;
}

const vendor = () => {
  const router = useRouter();
  const { loading, error, data } = useQuery(get_my_products);

  useEffect(() => {
    let toastId: any;

    if (loading) {
      toastId = toast.loading("Fetching your products...");
    }

    if (error) {
      toast.update(toastId, {
        render: `Error: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }

    if (!loading && data) {
      toast.update(toastId, {
        render: "Products fetched successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    }
  }, [loading, error, data]);



  const handleEdit = () => {}
  const handleDelete = () => {}
    return ( 
        <div className="bg-gray-100 min-h-screen">
      <section className="bg-blue-50 py-10 text-center ">
        <div className="max-w-xl mx-auto  bg-blue">


            
            <img className="w-23.5 h-23.5 mx-auto " src="/figma images/Group 209.png" alt="" />
          
          <h2 className="text-[40px] leading-[100%] tracking-[0] font-bold font-Merriweather text-[#55A7FF] mt-4">Soothe & Tie</h2>

          <p className="text-[#939090] mt-2 text-[24px]">We design and deliver high quality luxury suits to people that want that easy life and comfort..</p>
          <p className="text-[16px] text-[#272222] ">Herbert Macaulay way, Off Ikeja Road. Lagos</p>
          <div className="mt-3 mx-auto space-x-7 flex ml-[200px] min-ml-screen">
      <img src="/figma images/Frame 240 (1).png" alt="message" />
      <img src="/figma images/Frame 241.png" alt="" />
          </div>
          <button className="mt-5 font-semibold font-Work-Sans text-2xl w-[349px] h-[60px] bg-[#FF4C3B] text-[#FFFFFF] text-[24px] px-[56px] py-[10px] rounded-full">
            ADD NEW PRODUCT
          </button>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-10 ml-[30px] ">
        <h3 className="text-xl font-semibold mb-6 ml-[18px]">My Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  
       
       {data?.myProducts?.map((product: Product) => (
        <div key={product.id} className="bg-white shadow-md rounded-[16px] w-[232px] h-auto ml-[18px] flex flex-col">
  {/* Product Image */}
  <img
    className="w-[232px] h-[203px] object-cover rounded-tr-[16px] rounded-tl-[16px]"
    src={product.images[0] || "/figma images/Frame 89.png"}
    alt={product.name}
  />

  {/* Price */}
  <h4 className="border-t border-gray-300 pt-2 pb-2 pl-4 text-[16px] font-[600]">
    NGN {product.price.toLocaleString()}
  </h4>

  {/* Name */}
  <p className="pl-4 text-[16px] font-Merriweather">
    {product.name}
  </p>

  {/* Description */}
  <p className="pl-4 mt-2 text-[12px] text-[#939090]">
    {product.description}
  </p>

  {/* Location */}
  <div className="flex items-center gap-2 mt-3 text-sm pl-4">
    <img src="/figma images/map-pin.png" alt="" className="w-4 h-4" />
    <p className="text-[#939090]">{"hardcoded, location"}</p>
  </div>

  {/* Rating and Reviews */}
  <div className="pl-4 mt-3 text-[13px] text-[#555] flex gap-2 items-center">
    <p>
      ⭐ {product.averageRating ? product.averageRating.toFixed(1) : "No ratings yet"}
    </p>
    <p>
      • {product.totalReviews ? `${product.totalReviews} reviews` : "No reviews yet"}
    </p>
  </div>

  {/* Buttons */}
  <div className="flex justify-between items-center mt-4 px-4 pb-3">
    <button
      onClick={handleEdit}
      className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded hover:bg-blue-600 transition"
    >
      Edit
    </button>
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded hover:bg-red-600 transition"
    >
      Delete
    </button>
  </div>
        </div>
       ))}


            <div className="bg-white shadow-md rounded-[16px] w-[232px] h-[344px] ml-[18px]">
              <img  className="w-[232px] h-[203px]  object-cover rounded-tr-[16px] rounded-tl-[16px]" src="/figma images/Frame 89.png"/>
            <h4 className="w-[232px] h-[39px] border-t border-gray-300 pt-[8px] pr-[98px] pb-[8px] pl-[16px] text-[16px] font-[600]"> NGN 65,000</h4>

              <p className="w-[180px] h-[20px] font-Merriweather font-normal text-[16px] leading-[100%] tracking-[0em] pl-[16px]">Exclusive Office table</p>

           <p className="w-[200px] h-[28px]  font-normal text-[12px] leading-[100%] tracking-[0em] text-[#939090] pl-[16px] mt-[8px]">
  Hardwood executive office table with three drawers to place an...
</p>

<div className="flex items-center gap-[12px] w-[121px] h-[16px] mt-3 text-sm pl-[16px]">
  <img src="/figma images/map-pin.png" alt="" className="w-4 h-4" />
  <p className="text-[#939090]">Lagos,Gbagada</p>
</div>

            </div>

            <div className="bg-white shadow-md rounded-[16px] w-[232px] h-[344px] ml-[18px]">
              <img  className="w-[232px] h-[203px]  object-cover rounded-tr-[16px] rounded-tl-[16px]" src="/figma images/Frame 89.png"/>
            <h4 className="w-[232px] h-[39px] border-t border-gray-300 pt-[8px] pr-[98px] pb-[8px] pl-[16px] text-[16px] font-[600]"> NGN 65,000</h4>

              <p className="w-[180px] h-[20px] font-Merriweather font-normal text-[16px] leading-[100%] tracking-[0em] pl-[16px]">Exclusive Office table</p>

           <p className="w-[200px] h-[28px]  font-normal text-[12px] leading-[100%] tracking-[0em] text-[#939090] pl-[16px] mt-[8px]">
  Hardwood executive office table with three drawers to place an...
</p>

<div className="flex items-center gap-[12px] w-[121px] h-[16px] mt-3 text-sm pl-[16px]">
  <img src="/figma images/map-pin.png" alt="" className="w-4 h-4" />
  <p className="text-[#939090]">Lagos,Gbagada</p>
</div>

            </div>

            <div className="bg-white shadow-md rounded-[16px] w-[232px] h-[344px] ml-[18px]">
              <img  className="w-[232px] h-[203px]  object-cover rounded-tr-[16px] rounded-tl-[16px]" src="/figma images/Frame 89.png"/>
            <h4 className="w-[232px] h-[39px] border-t border-gray-300 pt-[8px] pr-[98px] pb-[8px] pl-[16px] text-[16px] font-[600]"> NGN 65,000</h4>

              <p className="w-[180px] h-[20px] font-Merriweather font-normal text-[16px] leading-[100%] tracking-[0em] pl-[16px]">Exclusive Office table</p>

           <p className="w-[200px] h-[28px]  font-normal text-[12px] leading-[100%] tracking-[0em] text-[#939090] pl-[16px] mt-[8px]">
  Hardwood executive office table with three drawers to place an...
</p>

<div className="flex items-center gap-[12px] w-[121px] h-[16px] mt-3 text-sm pl-[16px]">
  <img src="/figma images/map-pin.png" alt="" className="w-4 h-4" />
  <p className="text-[#939090]">Lagos,Gbagada</p>
</div>

            </div>
        
            
        </div>
      </section>
      
    </div>
     );
}
 
 
export default vendor;