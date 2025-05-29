"use client"
import React, {useState} from 'react'
import Image from 'next/image'
import google from '../../../../public/figma images/Frame 78.png'
import eyeclosed from '../../../../public/figma images/eye-closed.png'
import { IoEyeOutline } from "react-icons/io5";

const Login = () => {
    const [showpassword, setshowpassword] = useState(false)
  return (
    <>
        <div className=' bg-[rgba(0,0,0,0.3)] w-full h-screen flex items-center justify-center'>
            <div className='bg-white w-[583px] p-[50px] flex flex-col border-[1px] border-[#cce5ff]  gap-[25px] items-center text-[#272222] h-[651px] rounded-[32px]'>
                <h2 className='text-[40px] font-normal text-[#55a7ff]'>Log in</h2>
                <div className='w-full flex border-[1px] border-[rgba(0,0,0,0.1)] rounded-[16px] py-3 justify-center items-center gap-[15px]'>
                    <Image src={google} alt=''/>
                    <button>Sign in with Google</button>
                </div>
                <p className='text-[16px] font-normal'>OR</p>
                <div className='flex w-full gap-[20px] flex-col'>
                    <input className='w-full px-7 py-3 border-[1px] border-[rgba(0,0,0,0.1)] outline-[#4ff072] rounded-[16px]' placeholder='Enter email address'  type="text" />
                    <div tabIndex={0} className='w-full px-7 py-3 flex justify-between focus-within:outline focus-within:outline-[#4ff072] border-[1px] border-[rgba(0,0,0,0.1)] rounded-[16px]'>
                    <input className='outline-none w-full' placeholder='Enter password' type={showpassword? "text": "password"} />
                    <button onClick={()=>setshowpassword(prev => !prev)}>
                    {showpassword ? (
                         <IoEyeOutline size={24} className='opacity-[20%]' />
                    ) : (
                        <Image src={eyeclosed} alt='' />
                    )}
                    </button>
                    </div>
                </div>
                <div className='flex w-full gap-[20px] flex-col'>
                    <button className='w-full py-3 bg-[#007bff] text-white text-[16px] font-normal rounded-[16px]'>Log in</button>
                    <button className='w-full py-3 border-[1px] border-[#007bff] text-[#007bff] text-[16px] font-normal  rounded-[16px]'>Forgot Password?</button>
                </div>
            <div className='flex text-[16px] mt-[20px] font-normal gap-2'>
                <p>Don't have an account?</p>
                <a className='text-[#007bff] font-bold'>Sign up</a>
            </div>
            </div>
        </div>
    </>
  )
}

export default Login
