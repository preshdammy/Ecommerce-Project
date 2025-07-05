"use client"
import Link from 'next/link'
import React, {useState} from 'react'
import Image from 'next/image'
import logo from '../../../../public/figma images/WhatsApp Image 2022-11-27 at 14.35 1.png'
import { gql, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const LOGIN_ADMIN = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      token
      admin {
        id
        name
        email
        role
      }
    }
  }
`;




const Adminlogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginAdmin, { loading, error }] = useMutation(LOGIN_ADMIN);
  const handleSubmit = async () => {
    try {
      const response = await loginAdmin({ variables: { ...formData } });
      const { token, admin } = response.data?.loginAdmin || {};
  
      if (token && admin) {
        Cookies.remove("usertoken");
        Cookies.remove("vendortoken");
        Cookies.remove("userinfo");
        Cookies.remove("vendorinfo");
  
        Cookies.set("admintoken", token, { expires: 7 });
        Cookies.set(
          "admininfo",
          JSON.stringify({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          }),
          { expires: 7 }
        );
  
        router.push("/admindashboard");
      } else {
        alert("Login failed: No token returned.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed!");
    }
  };
  
    
  return (
    <>
     <div className=' bg-[rgba(0,0,0,0.1)] w-full h-screen flex items-center justify-center'>
      <div className='flex flex-col w-[544px] h-[599px] justify-center border-[1px] border-[#d4d3d3] items-center bg-white px-[80px]'>
        <Image className=' mb-[10px]' src={logo} alt='logo' />
        <h1 className='text-[32px] text-[#939090] font-[300]'>Admin Dashboard</h1>
        <p className='text-[24px] text-[#007bff] mt-[10px] font-normal'>Log in</p>
        <div className='flex flex-col gap-[20px] mt-[30px] w-full mb-[30px]'>
            <input value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className='border-[1px] px-[10px] w-full h-[40px] border-[#d4d3d3] rounded-[8px] py-3' placeholder='Email Address' type="text" />
            <input value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className='border-[1px] px-[10px] w-full h-[40px] border-[#d4d3d3] rounded-[8px] py-3' placeholder='Password' type="password" />
        </div>
        <button onClick={handleSubmit} className='text-[16px]  rounded-[8px] text-white bg-[#007bff] font-[600] w-full py-3'>{loading? "processing...": "Log in"}</button>
        <Link className='text-[16px] text-[#939090] font-[500] mt-[15px]' href="">
          forgot your password?
        </Link>
      </div>
      </div>
    </>
  )
}

export default Adminlogin
