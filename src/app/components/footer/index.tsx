import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <div className='bg-[#007bff] w-full text-white px-6 py-10 lg:px-20 xl:px-32 2xl:px-40'>
      <div className='flex flex-col items-center text-center gap-10 md:flex-row md:justify-between md:items-start md:text-left lg:gap-[150px]'>

        {/* About Us */}
        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[20px] md:text-[22px] lg:text-[24px] font-normal'>About us</h2>
          <Link className='text-[14px] md:text-[16px]' href=''>About Time Shoppy</Link>
          <Link className='text-[14px] md:text-[16px]' href=''>We are hiring!</Link>
          <Link className='text-[14px] md:text-[16px]' href=''>Terms and Conditions</Link>
          <Link className='text-[14px] md:text-[16px]' href=''>Privacy Policy</Link>
          <Link className='text-[14px] md:text-[16px]' href=''>Billing Policy</Link>
          <Link className='text-[14px] md:text-[16px]' href=''>Cookie Policy</Link>
          <Link className='text-[14px] md:text-[16px]' href=''>Copyright Infringement Policy</Link>
        </div>

        {/* Support */}
        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[20px] md:text-[22px] lg:text-[24px] font-normal'>Support</h2>
          <Link className='text-[14px] md:text-[16px]' href=''>support@timeshoppy.ng</Link>
          <Link className='text-[14px] md:text-[16px]' href=''>Contact us</Link>
          <Link className='text-[14px] md:text-[16px]' href=''>FAQ</Link>
        </div>

        {/* Resources */}
        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[20px] md:text-[22px] lg:text-[24px] font-normal'>Our resources</h2>
          <Link className='text-[14px] md:text-[16px]' href=''>Our blog</Link>
          <Link className='text-[14px] md:text-[16px]' href=''>Facebook</Link>
          <Link className='text-[14px] md:text-[16px]' href=''>Instagram</Link>
          <Link className='text-[14px] md:text-[16px]' href=''>Twitter</Link>
        </div>
        
      </div>
    </div>
  )
}

export default Footer

