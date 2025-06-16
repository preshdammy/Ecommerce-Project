import React from 'react'
import Image from 'next/image'
import arrowleft from '../../../../../public/figma images/arrow-left.png'

const Forgotpassword = () => {
  return (
    <>
         <div className=' bg-[rgba(0,0,0,0.3)] w-full h-screen flex items-center justify-center'>
            <div className='bg-white lg:w-[583px] lg:p-[50px] flex flex-col border-[1px] border-[#cce5ff]  lg:gap-[25px] items-center justify-center text-[#272222] lg:h-[447px] rounded-[32px] sm:w-[304px] w-[304px] sm:h-[328px] h-[328px] sm:p-[15px] p-[15px] sm:gap-[15px] gap-[15px]'>
                <h2 className='lg:text-[40px] font-normal text-[#55a7ff] sm:text-[24px] text-[24px]'>Forgot Password?</h2>
                <p className='lg:text-[20px] lg:font-normal sm:text-[12px] text-[12px] sm:font-[500] font-[500]'>no worries, we will send you reset instructions</p>
                <div className='flex w-full lg:gap-[20px] flex-col mt-[10px] sm:gap-[15px] gap-[15px]'>
                    <input className='w-full lg:placeholder:text-[16px] px-7 lg:py-3 border-[1px] border-[rgba(0,0,0,0.1)] outline-[#4ff072] lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:placeholder:text-[12px] placeholder:text-[12px] sm:py-2 py-2' placeholder='Enter your email'  type="text" />
                    <button className='w-full lg:py-4 bg-[#007bff] text-white lg:text-[16px] lg:font-[600] lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:text-[12px] text-[12px] sm:font-[600] font-[600] sm:py-2 py-2'>Reset Password</button>
                </div>
                <div className='flex gap-[8px] items-center sm:mt-[20px] mt-[20px]'>
                    <Image className='sm:w-[14px] sm:h-[14px] w-[14px] h-[14px] lg:w-[20px] lg:h-[20px]' src={arrowleft} alt=''/>
                    <span className='flex gap-[5px] lg:text-[16px] sm:text-[12px] text-[12px]'>Back to <p className='text-[#007bff] font-bold'>Log In</p></span>
                </div>
           
            </div>
        </div>
    </>
  )
}

export default Forgotpassword
