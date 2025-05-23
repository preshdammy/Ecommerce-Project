import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
      <>
        <div className='bg-[#272222] h-[350px] w-full text-white grid place-items-center px-25 fixed bottom-0'>
            <div className='flex gap-[250px]'>
            <div className='flex flex-col gap-[15px]'>
                <h2 className='text-[24px] font-normal'>About us</h2>
                <Link className='text-[16px] font-normal' href=''>About Time Shoppy</Link>
                <Link className='text-[16px] font-normal' href=''>We are hiring!</Link>
                <Link className='text-[16px] font-normal' href=''>Terms and Conditions</Link>
                <Link className='text-[16px] font-normal' href=''>Privacy Policy</Link>
                <Link className='text-[16px] font-normal' href=''>Billing Policy</Link>
                <Link className='text-[16px] font-normal' href=''>Cookie Policy</Link>
                <Link className='text-[16px] font-normal' href=''>Copyright Infringement Policy</Link>
            </div>
            <div className='flex flex-col gap-[15px]'>
                <h2 className='text-[24px] self-start font-normal'>Support</h2>
                <Link className='text-[16px] font-normal' href=''>support@timeshoppy.ng</Link>
                <Link className='text-[16px] font-normal' href=''>Contact us</Link>
                <Link className='text-[16px] font-normal' href=''>FAQ</Link>
            </div>
            <div className='flex flex-col gap-[15px]'>
                <h2 className='text-[24px] self-start font-normal'>Our resources</h2>
                <Link className='text-[16px] font-normal' href=''>Our blog</Link>
                <Link className='text-[16px] font-normal' href=''>Facebook</Link>
                <Link className='text-[16px] font-normal' href=''>Instagram</Link>
                <Link className='text-[16px] font-normal' href=''>Twitter</Link>
            </div>
        </div>
        </div>
      </>
  )
}

export default Footer
