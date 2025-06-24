"use client"
import React, {useState} from 'react'
import Image from 'next/image'
import google from '../../../../public/figma images/Frame 78.png'
import eyeclosed from '../../../../public/figma images/eye-closed.png'
import { IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation"; 
import Cookies from "js-cookie";
import { gql, useMutation } from "@apollo/client";
import { handleError } from '@/shared/utils/handleError'

const LOGINUSER = gql`
  mutation loginuser($email: String!, $password: String!) {
    loginuser(email: $email, password: $password) {
      id
      email,
      password,
      token
    }
  }
`;

const Login = () => {
    const [showpassword, setshowpassword] = useState(false)
    const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loginUser, { loading, error, data }] = useMutation(LOGINUSER);

  const handleLogin = async () => {
    try {
      const response = await loginUser({ variables: { ...formData } });
      console.log("Login success:", response.data);
        if(response.data?.login?.token){
            Cookies.set("token",response.data?.login?.token)
        }
      // Example: Redirect after login
      router.push("/landingpage");
    } catch (err) {
      console.error("Login error:", err);
    }
  };
  if (error) {
    // return error.message
    return handleError(error.message)
  }
}
  return (
    <>
        <div className=' bg-[rgba(0,0,0,0.3)] w-full h-screen flex items-center justify-center'>
            <div className='bg-white lg:w-[583px] lg:p-[50px] flex flex-col border-[1px] border-[#cce5ff]  lg:gap-[25px] items-center text-[#272222] lg:h-[651px] rounded-[32px] sm:w-[304px] w-[304px] sm:h-[458px] h-[458px] sm:p-[20px] p-[20px] sm:gap-[20px] gap-[20px]'>
                <h2 className='lg:text-[40px] lg:font-normal text-[#55a7ff] sm:text-[24px] text-[24px] sm:font-normal font-normal'>Log in</h2>
                <div className='w-full flex border-[1px] border-[rgba(0,0,0,0.1)] lg:rounded-[16px] lg:py-3 justify-center items-center lg:gap-[15px] lg:text-[20px] sm:rounded-[100px] rounded-[100px] sm:text-[12px] text-[12px] sm:font-normal font-normal sm:gap-[5px] gap-[5px] sm:py-2 py-2'>
                    <Image className='sm:w-[16px] w-[16px] sm:h-[16px] h-[16px] lg:w-[24px] lg:h-[24px]' src={google} alt='' />
                    <button>Sign in with Google</button>
                </div>
                <p className='lg:text-[16px] lg:font-normal sm:text-[12px] text-[12px] sm:font-[500] font-[500]'>OR</p>
                <div className='flex w-full lg:gap-[20px] flex-col sm:gap-[10px] gap-[10px]'>
                    <input className='w-full px-7 lg:py-3 border-[1px] border-[rgba(0,0,0,0.1)] lg:bg-white outline-[#4ff072] lg:rounded-[16px] lg:placeholder:text-[16px] sm:rounded-[100px] rounded-[100px] sm:placeholder:text-[12px] placeholder:text-[12px] sm:placeholder:font-normal placeholder:font-normal sm:bg-[#f8f8f8] bg-[#f8f8f8] sm:py-2 py-2' placeholder='Enter email address'  type="text" />
                    <div tabIndex={0} className='w-full px-7 lg:py-3 flex justify-between focus-within:outline lg:bg-white focus-within:outline-[#4ff072] border-[1px] border-[rgba(0,0,0,0.1)] lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:bg-[#f8f8f8] bg-[#f8f8f8] sm:py-2 py-2'>
                    <input className='outline-none w-full lg:placeholder:text-[16px] sm:placeholder:text-[12px] placeholder:text-[12px] sm:placeholder:font-normal placeholder:font-normal' placeholder='Enter password' type={showpassword? "text": "password"} />
                    <button onClick={()=>setshowpassword(prev => !prev)}>
                    {showpassword ? (
                         <IoEyeOutline size={24} className='opacity-[20%] lg:w-[24px] lg:h-[24px] sm:w-[16px] w-[16px] sm:h-[16px] h-[16px]' />
                    ) : (
                        <Image className='lg:w-[26px] lg:h-[24px] sm:w-[18px] w-[18px] sm:h-[16px] h-[16px]' src={eyeclosed} alt='' />
                    )}
                    </button>
                    </div>
                </div>
                <div className='flex w-full lg:gap-[20px] flex-col sm:gap-[10px] gap-[10px]'>
                    <button className='w-full lg:py-3 bg-[#007bff] text-white lg:text-[16px] lg:font-normal lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:text-[12px] text-[12px] sm:font-[600] font-[600] sm:py-2 py-2'>Log in</button>
                    <button className='w-full lg:py-3 border-[1px] border-[#007bff] text-[#007bff] lg:text-[16px] lg:font-normal  lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:text-[12px] text-[12px] sm:font-normal font-normal sm:py-2 py-2'>Forgot Password?</button>
                </div>
            <div className='flex lg:text-[16px] lg:mt-[20px] lg:font-normal gap-2 sm:text-[12px] text-[12px] sm:font-normal font-normal sm:mt-[10px] mt-[10px]'>
                <p>Don't have an account?</p>
                <a className='text-[#007bff] font-bold'>Sign up</a>
            </div>
            </div>
        </div>
    </>
  )
}

export default Login
