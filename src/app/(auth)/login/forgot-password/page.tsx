import React from 'react'
import Image from 'next/image'
import arrowleft from '../../../../../public/figma images/arrow-left.png'

const Forgotpassword = () => {
  return (
    <>
         <div className=' bg-[rgba(0,0,0,0.3)] w-full h-screen flex items-center justify-center'>
            <div className='bg-white w-[583px] p-[50px] flex flex-col border-[1px] border-[#cce5ff]  gap-[25px] items-center text-[#272222] h-[447px] rounded-[32px]'>
                <h2 className='text-[40px] font-normal text-[#55a7ff]'>Forgot Password?</h2>
                <p className='text-[20px] font-normal'>no worries, we will send you reset instructions</p>
                <div className='flex w-full gap-[20px] flex-col mt-[10px]'>
                    <input className='w-full px-7 py-3 border-[1px] border-[rgba(0,0,0,0.1)] outline-[#4ff072] rounded-[16px]' placeholder='Enter your email'  type="text" />
                    <button className='w-full py-4 bg-[#007bff] text-white text-[16px] font-normal rounded-[16px]'>Reset Password</button>
                </div>
                <div className='flex gap-[8px]'>
                    <Image src={arrowleft} alt=''/>
                    <span className='flex gap-[5px] text-[16px]'>Back to <p className='text-[#007bff] font-bold'>Log In</p></span>
                </div>
           
            </div>
        </div>
    </>
  )
}

export default Forgotpassword
