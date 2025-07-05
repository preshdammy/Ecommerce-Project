"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import cartpic from '../../../../public/figma images/🦆 icon _image outline_ (1).png';
import chevleft from '../../../../public/figma images/chevron-left.png';

export default function CheckoutPage() {
  return (
    <div className="flex flex-col gap-[30px] lg:px-[50px] py-[50px] bg-[#fbfbfb] sm:px-[25px] px-[20px] md:px-[35px] xl:px-[60px]">
      {/* Header */}
      <div className="flex items-center gap-[16px]">
        <Link href="/cart">
          <Image src={chevleft} alt="Back" className="w-[24px] h-[24px]" />
        </Link>
        <h2 className="text-[24px] font-normal text-[#007bff] md:text-[32px] lg:text-[40px] text-center w-full -ml-[24px]">Checkout</h2>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-[16px] p-[20px] md:p-[30px] shadow flex flex-col gap-[20px] md:w-[60%] w-full mx-auto">
        {/* Order Breakdown */}
        <div className="flex justify-between px-[10px]">
          <p className="text-[#918b93] text-[14px]">Subtotal</p>
          <p className="text-black font-semibold text-[14px]">₦260,000</p>
        </div>

        <div className="flex justify-between px-[10px]">
          <p className="text-[#918b93] text-[14px]">Time Shoppy credits</p>
          <p className="text-black font-semibold text-[14px]">₦500</p>
        </div>

        <div className="flex justify-between border-t border-gray-200 pt-[10px] px-[10px]">
          <p className="text-[#918b93] text-[14px]">Total</p>
          <p className="text-black font-semibold text-[14px]">₦260,500</p>
        </div>

        {/* Make Payment Button */}
        <div className="flex justify-center mt-[30px]">
          <button className="bg-[#ff4c3b] text-white rounded-[100px] px-10 py-4 text-[14px] font-semibold hover:bg-red-600 transition-all">
            Make Payment
          </button>
        </div>
      </div>

      {/* Responsive Order Preview */}
      <div className="bg-white rounded-[16px] shadow p-[20px] mt-[40px] flex flex-col gap-[20px] md:w-[60%] w-full mx-auto">
        <div className="flex gap-[16px] items-center">
          <Image src={cartpic} alt="Product" className="w-[64px] h-[56px]" />
          <div className="flex flex-col">
            <h4 className="text-[#272222] text-[16px] font-medium">Executive office table</h4>
            <p className="text-[#918b93] text-[12px]">Hardwood table with drawers</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-black font-bold text-[16px]">₦65,000</span>
          <Link href="#" className="text-[#ff4c3b] text-[12px]">Remove</Link>
        </div>
      </div>
    </div>
  );
}
