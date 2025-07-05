'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logo from '../../../../public/figma images/WhatsApp Image 2022-11-27 at 14.35 1.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, signupSchematype} from '../../../shared/lib/definitions';
import Cookies from "js-cookie"
 

const Adminlogin = () => {
  const router = useRouter();

const {register, handleSubmit, formState: { errors, isSubmitting }, } = 
  useForm<signupSchematype>({
  resolver: zodResolver(signupSchema),
});


  const onSubmit = async (data: signupSchematype) => {
  try {
    const res = await fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
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
        `,
        variables: {
          email: data.email,
          password: data.password,
        },
      }),
    });

    const result = await res.json();
    if (result.errors) throw new Error(result.errors[0].message);

    const { token, admin } = result.data.loginAdmin;

    
    Cookies.set("token", token, {
      path: '/',
      expires: 1, 
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', 
    });

    alert('Login successful!');
    if (admin.role === 'ADMIN') {
      router.push('/admindashboard');
    } else {
      alert('Access denied! Not an admin');
    }
  } catch (err: any) {
    alert(err.message || 'Login failed!');
  }
};

  return (
    <div className="bg-[rgba(0,0,0,0.1)] w-full h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[544px] h-[599px] justify-center border border-[#d4d3d3] items-center bg-white px-[80px]"
      >
        <Image className="mb-[10px]" src={logo} alt="logo" />
        <h1 className="text-[32px] text-[#939090] font-light">Admin Dashboard</h1>
        <p className="text-[24px] text-[#007bff] mt-[10px] font-normal">Log in</p>

        <div className="flex flex-col gap-[20px] mt-[30px] w-full mb-[30px]">
          <div>
            <input
              {...register('email')}
              className="border px-3 w-full h-[40px] border-[#d4d3d3] rounded-[8px] py-3"
              placeholder="Email Address"
              type="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('password')}
              className="border px-3 w-full h-[40px] border-[#d4d3d3] rounded-[8px] py-3"
              placeholder="Password"
              type="password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="text-[16px] rounded-[8px] text-white bg-[#007bff] font-[600] w-full py-3 disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>

        <Link href="/forgot-password" className="text-[16px] text-[#939090] font-[500] mt-[15px] hover:text-black">
          Forgot your password?
        </Link>
      </form>
    </div>
  );
};

export default Adminlogin;
