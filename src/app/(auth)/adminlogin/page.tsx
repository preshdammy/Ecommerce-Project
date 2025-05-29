import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import logo from '../../../../public/figma images/WhatsApp Image 2022-11-27 at 14.35 1.png'

const Adminlogin = () => {
  return (
    <>
     <div className=' bg-[rgba(0,0,0,0.1)] w-full h-screen flex items-center justify-center'>
      <div className='flex flex-col w-[544px] h-[599px] justify-center border-[1px] border-[#d4d3d3] items-center bg-white px-[80px]'>
        <Image className=' mb-[10px]' src={logo} alt='logo' />
        <h1 className='text-[32px] text-[#939090] font-[300]'>Admin Dashboard</h1>
        <p className='text-[24px] text-[#007bff] mt-[10px] font-normal'>Log in</p>
        <div className='flex flex-col gap-[20px] mt-[30px] w-full mb-[30px]'>
            <input className='border-[1px] px-[10px] w-full h-[40px] border-[#d4d3d3] rounded-[8px] py-3' placeholder='Email Address' type="text" />
            <input className='border-[1px] px-[10px] w-full h-[40px] border-[#d4d3d3] rounded-[8px] py-3' placeholder='Password' type="text" />
        </div>
        <button className='text-[16px]  rounded-[8px] text-white bg-[#007bff] font-[600] w-full py-3'>Log in</button>
        <Link className='text-[16px] text-[#939090] font-[500] mt-[15px]' href="">
          forgot your password?
        </Link>
      </div>
      </div>
    </>
  )
}

export default Adminlogin
