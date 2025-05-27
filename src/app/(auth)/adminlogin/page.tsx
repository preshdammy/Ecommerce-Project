import Link from 'next/link'
import React from 'react'

const Adminlogin = () => {
  return (
    <>
      <div className='flex flex-col w-[1280px] h-screen justify-center items-center bg-white '>
        <h1 className='text-[40px] font-bold'>Time Shoppy</h1>
        <h1 className='text-[40px] font-normal'>Admin Dashboard</h1>
        <p className='text-[24px] font-normal'>Log in</p>
        <div className='flex flex-col gap-[20px] mt-[50px] mb-[30px]'>
            <input className='border-[1px] px-[10px] w-[508px] h-[40px] border-black rounded-[4px] py-1' placeholder='Email Address' type="text" />
            <input className='border-[1px] px-[10px] w-[508px] h-[40px] border-black rounded-[4px] py-1' placeholder='Password' type="text" />
        </div>
        <button className='text-[24px] border-[1px] rounded-[4px] border-black bg-white font-normal w-[508px] py-1'>Log in</button>
        <Link className='text-[16px] font-normal mt-[15px]' href="">
          forgot your password?
        </Link>
      </div>
    </>
  )
}

export default Adminlogin
