"use client";

import { useQuery, gql } from "@apollo/client";
import Link from 'next/link';
import Image from 'next/image';
import frame from '../../../../../public/figma images/Component 2.png';
import shop from '../../../../../public/figma images/🦆 icon _shop alt_.png';
import React from 'react';

const GET_VENDOR_PROFILE = gql`
  query GetVendorProfile {
    getVendorProfile {
      name
      location
      businessName
      storeName
      profilePicture
      personalProfilePic
      businessDescription
      businessAvailability
      businessAddress
      businessOpeningTime
      businessClosingTime
    }
    vendorOrders {
      status
    }
  }
`;


const Profilepage = () => {
  const { data, loading, error } = useQuery(GET_VENDOR_PROFILE);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">Error loading profile</p>;

  const vendor = data?.getVendorProfile;
  const orders = data?.vendorOrders || [];
  const totalPurchases = orders.length;
  const totalDeliveries = orders.filter((order: any) => order.status === 'DELIVERED').length;

  return (
    <>
      <div className='px-[20px] sm:px-[30px] md:px-[40px] xl:px-[60px] py-[40px] sm:py-[50px] md:py-[60px] xl:py-[70px]'>
        <div className='flex gap-[25px] items-center'>
          <div className="border-2 border-[#CCE5FF] rounded-full p-1">
            <Image
              className='w-[50px] h-[50px] sm:w-[100px] sm:h-[100px] md:w-[160px] md:h-[160px] lg:w-[216px] lg:h-[216px] xl:w-[216px] xl:h-[216px] rounded-full object-cover '
              src={vendor?.personalProfilePic || frame}
              alt='Vendor Profile Picture'
              width={216}
              height={216}
            />
          </div>
          <div className='flex flex-col gap-[10px]'>,
            <h2 className='text-[16px] font-[500] sm:text-[20px] sm:font-[600] md:text-[32px] md:font-[600] lg:text-[40px] lg:font-normal xl:text-[40px] xl:font-normal'>
              {vendor?.name || 'Vendor Name'}
            </h2>
            <div className='text-[12px] sm:text-[14px] md:text-[16px] lg:text-[16px] xl:text-[16px] text-[#939090] font-normal flex gap-[15px] mt-[-8px] sm:mt-[-6px] md:mt-0'>
              <p> {vendor?.location || 'Location'}</p>
              <p className='flex gap-[6px] items-center'>
                 <Image className='w-[15px] h-[15px] sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]' src={shop} alt='' />
                {vendor?.businessName || 'Business Name'}
              </p>
              
            </div>
          
          <div className="flex gap-5">
             <Link
            className='text-[12px] sm:text-[14px] md:text-[16px] xl:text-[16px] text-[#939090] font-normal hover:underline' href='/vendor/account-settings'>
            Edit personal details
          </Link>
          </div>

          </div>
        </div>

        <div className='flex flex-col gap-[20px] mt-[60px] sm:mt-[70px] md:mt-[100px] lg:mt-[120px] xl:mt-[130px] mb-[90px] sm:mb-[100px] md:mb-[200px] lg:mb-[250px] xl:mb-[260px] md:flex-row md:gap-[10%]'>
          <button className='flex items-center justify-between gap-[20px] px-[16px] sm:px-[20px] md:px-[24px] xl:px-[28px] py-[20px] sm:py-[24px] md:py-[28px] xl:py-[30px] w-[201px] sm:w-[250px] md:w-full text-[12px] sm:text-[14px] md:text-[20px] lg:text-[24px] xl:text-[24px] font-[500] md:font-normal xl:font-normal border-[1px] border-[#cce5ff] rounded-[14px] focus:text-[#007bff] focus:bg-[#f5faff]'>
            <p>My Purchases</p>
            <p className='text-[#007bff] font-[500] sm:font-[600] md:font-[600] text-[12px] sm:text-[14px] md:text-[20px] lg:text-[24px] xl:text-[24px]'>
              {totalPurchases}
            </p>
          </button>

          <button className='flex items-center justify-between gap-[20px] px-[16px] sm:px-[20px] md:px-[24px] xl:px-[28px] py-[20px] sm:py-[24px] md:py-[28px] xl:py-[30px] w-[201px] sm:w-[250px] md:w-full text-[12px] sm:text-[14px] md:text-[20px] lg:text-[24px] xl:text-[24px] font-[500] md:font-normal xl:font-normal border-[1px] border-[#cce5ff] rounded-[14px] focus:text-[#007bff] focus:bg-[#f5faff]'>
            <p>My Deliveries</p>
            <p className='text-[#007bff] font-[500] sm:font-[600] md:font-[600] text-[12px] sm:text-[14px] md:text-[20px] lg:text-[24px] xl:text-[24px]'>
              {totalDeliveries}
            </p>
          </button>

          <button className='flex items-center justify-center px-[16px] sm:px-[20px] md:px-[24px] xl:px-[28px] py-[20px] sm:py-[24px] md:py-[28px] xl:py-[30px] w-[201px] sm:w-[250px] md:w-full text-[12px] sm:text-[14px] md:text-[20px] lg:text-[24px] xl:text-[24px] font-[500] md:font-normal xl:font-normal border-[1px] border-[#cce5ff] rounded-[14px] focus:text-[#007bff] focus:bg-[#f5faff]'>
            My Payments
          </button>
        </div>
      </div>
    </>
  );
};

export default Profilepage;
