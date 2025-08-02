import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='bg-[#007bff] w-full text-white px-6 py-10 lg:px-20 xl:px-32 2xl:px-40'>
      <div className='flex flex-col items-center text-center gap-10 md:flex-row md:justify-between md:items-start md:text-left lg:gap-[150px]'>

        {/* About Us */}
        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[20px] md:text-[22px] lg:text-[24px] font-normal'>About us</h2>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href='/about'>About Time Shoppy</Link>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href='/we-are-hiring'>We are hiring!</Link>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href='/terms-and-conditions'>Terms and Conditions</Link>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href='/privacy-policy'>Privacy Policy</Link>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href='/billing-policy'>Billing Policy</Link>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href='/cookie-policy'>Cookie Policy</Link>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href='/copyright'>Copyright Infringement Policy</Link>
        </div>

        {/* Support */}
        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[20px] md:text-[22px] lg:text-[24px] font-normal'>Support</h2>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href='/support'>support@timeshoppy.ng</Link>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href='/contact-us'>Contact us</Link>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href='/faq'>FAQ</Link>
        </div>

        {/* Resources */}
        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[20px] md:text-[22px] lg:text-[24px] font-normal'>Our resources</h2>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href='/blog'>Our blog</Link>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href=''>Facebook</Link>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href=''>Instagram</Link>
          <Link className='text-[14px] md:text-[16px] hover:underline underline-offset-2' href=''>Twitter</Link>
        </div>
        
      </div>
    </div>
  )
}

export default Footer

