"use client"
import { useState } from 'react';
import Image from "next/image";
import React from "react";

const Purchases = () => {
  const [filter, setFilter] = useState('All');

  const purchaseData = [
    { id: 'ORD123', date: 'June 11, 2025', item: 'Blue Classic Tie', amount: '₦ 12,000', status: 'Delivered' },
    { id: 'ORD124', date: 'June 08, 2025', item: 'Silk Pocket Square', amount: '₦ 4,500', status: 'In Transit' },
    { id: 'ORD125', date: 'June 04, 2025', item: 'Leather Belt', amount: '₦ 9,000', status: 'Cancelled' },
  ];

  const filteredPurchases = filter === 'All'
    ? purchaseData
    : purchaseData.filter((purchase) => purchase.status === filter);

  return ( 
    <div className="min-h-screen bg-gray-100 px-4 md:px-12 py-6 md:py-10">
      {/* Header & Summary */}
      <section className="w-3/4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-[#55A7FF] text-[24px] md:text-[40px] font-light">My Purshases</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
          <div className="bg-[white] w-full md:w-1/2 p-6 rounded-xl border border-[#CCE5FF]">
            <span className="text-[#939090] text-lg md:text-[24px]">Total Income</span>
            <h2 className="text-[#007BFF] text-3xl md:text-[30px] font-semibold mt-2">₦ 369,420</h2>
          </div>
          <div className="bg-[white] w-full md:w-1/2 p-6 rounded-xl border border-[#CCE5FF]">
            <span className="text-[#939090] text-lg md:text-[24px]">Total Orders</span>
            <div className="flex items-end gap-2 mt-2">
              <h2 className="text-[#007BFF] text-3xl md:text-[30px] font-semibold">2,567</h2>
              <span className="text-[#939090] text-sm font-medium">Items</span>
            </div>
          </div>
        </div>
      </section>


        <h2 className="text-[24px] font-semibold mb-4 mt-4 text-[#939090]">Pending deliveries</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4 mb-5 ">
        {[...Array(5)].map((_, index) => (
          <div key={index} className=" bg-white rounded-2xl border border-[#CCE5FF] h-[40vh] max-w-[280px] hover:border hover:border-blue-600">
            <div className="relative w-full h-[180px] rounded-t-2xl overflow-hidden">
              <Image
                src="/benjamin.png"
                alt="product"
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute top-2 flex gap-1 right-2 bg-white text-[16px] text-[#007bff] font-bold px-2 py-1 rounded-full shadow">
                3 <p className='text-[#333] text-[14px] font-light'>pieces</p>
              </div>
            </div>
            <p className="font-medium text-sm ml-3 mt-4 text-gray-700">
              Sea Blue Armenian Three Piece Suit...
            </p>
            <div className="flex justify-between items-center ml-3 mt-2">
               <div className="text-[#FF4C3B] text-[20px] ">★★★★★</div>
                <span className="text-sm text-[#858383]">3 pieces</span>
              <div className="flex items-center justify-center mr-3">
               <div className="relative w-[60px] h-[60px]">
                 {/* Outer Ring */}
                 <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(
                    #00ff00 0deg 90deg,
                   #4f80ff 90deg 180deg,
                   #ffa500 225deg 315deg,
                   #ffffff 315deg 360deg
                    )`,}}>
                 </div>
                  {/* Inner White Circle with Text */}
                  <div className="absolute inset-[10px] rounded-full bg-white flex flex-col items-center justify-center text-center">
                    <span className="text-[12px] text-black font-semibold leading-tight">22</span>
                    <span className="text-[10px] text-gray-500">hrs left</span>
                  </div>
               </div>
              </div>
              
            </div>
            <p className="font-semibold text-[18px] text-[#0063c6] ml-4">₦ 75,000</p>
          </div>
        ))}
      </div>

      
      {/* Completed Deliveries */}
      <h2 className="text-[24px] font-semibold mb-4 text-[#939090]">Completed deliveries</h2>
     <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4 mb-5 ">
        {[...Array(5)].map((_, index) => (
          <div key={index} className=" bg-white rounded-2xl border border-[#CCE5FF] h-[40vh] max-w-[280px] hover:border hover:border-blue-600">
            <div className="relative w-full h-[180px] rounded-t-2xl overflow-hidden">
              <Image
                src="/benjamin.png"
                alt="product"
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute top-2 flex gap-1 right-2 bg-white text-[16px] text-[#007bff] font-bold px-2 py-1 rounded-full shadow">
                3 <p className='text-[#333] text-[14px] font-light'>pieces</p>
              </div>
            </div>
            <p className="font-medium text-sm ml-3 mt-4 text-gray-700">
              Sea Blue Armenian Three Piece Suit...
            </p>
            <div className="flex justify-between items-center ml-3 mt-2">
               <div className="text-[#FF4C3B] text-[20px] ">★★★★★</div>
                <span className="text-sm text-[#858383]">3 pieces</span>
              <div className="flex items-center justify-center mr-3">
               <div className="relative w-[60px] h-[60px]">
                 {/* Outer Ring */}
                 <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(
                    #00ff00 0deg 90deg,
                   #4f80ff 90deg 180deg,
                   #ffa500 225deg 315deg,
                   #ffffff 315deg 360deg
                    )`,}}>
                 </div>
                  {/* Inner White Circle with Text */}
                  <div className="absolute inset-[10px] rounded-full bg-white flex flex-col items-center justify-center text-center">
                    <span className="text-[12px] text-black font-semibold leading-tight">22</span>
                    <span className="text-[10px] text-gray-500">hrs left</span>
                  </div>
               </div>
              </div>
              
            </div>
            <p className="font-semibold text-[18px] text-[#0063c6] ml-4">₦ 75,000</p>
          </div>
        ))}
      </div>

      {/* Delivery History */}
      <h2 className="text-sm text-gray-600 mb-4">Delivery History</h2>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {[
              "Venetian Curtains with double sided...",
              "2 liters of egusi soup...",
              "Crochet bag with side pocket...",
              "Crochet bag with...",
            ].map((item, i) => (
              <span
                key={i}
                className="bg-[#eaf3ff] text-sm text-[#007bff] px-3 py-1 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
            <span>11/04/2025</span>
            <div className="flex gap-2">
              <button className="rounded-full w-6 h-6 bg-gray-100 text-gray-500">❮</button>
              <button className="rounded-full w-6 h-6 bg-gray-100 text-gray-500">❯</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  
    
  );
}



      


export default Purchases;
