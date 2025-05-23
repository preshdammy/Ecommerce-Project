import React from 'react'

const Login = () => {
  return (
    <>
        <div className=' bg-[rgba(0,0,0,0.3)] w-full h-screen flex items-center justify-center'>
            <div className='bg-white w-[583px] p-[50px] flex flex-col  gap-[25px] items-center text-[#272222] h-[651px] rounded-[32px]'>
                <h2 className='text-[40px] font-normal'>Log in</h2>
                <div className='w-full'>
                    <button className='w-full border-[1px] py-3 border-[rgba(0,0,0,0.1)] rounded-[100px]'>Sign in with Google</button>
                </div>
                <p className='text-[16px] font-normal'>OR</p>
                <div className='flex w-full gap-[20px] flex-col'>
                    <input className='w-full px-4 py-3 border-[1px] border-[rgba(0,0,0,0.1)] rounded-[100px]' placeholder='Email'  type="text" />
                    <input className='w-full px-4 py-3 border-[1px] border-[rgba(0,0,0,0.1)] rounded-[100px]' placeholder='Password' type="text" />
                </div>
                <div className='flex w-full gap-[20px] flex-col'>
                    <button className='w-full py-3 border-[1px] border-[rgba(0,0,0,0.1)] text-[16px] font-normal rounded-[100px]'>Log in</button>
                    <button className='w-full py-3 border-[1px] border-[rgba(0,0,0,0.1)] text-[16px] font-normal  rounded-[100px]'>Forgot Password?</button>
                </div>
            <div className='flex text-[16px] mt-[20px] font-normal gap-2'>
                <p>Don't have an account?</p>
                <a className=''>Sign up</a>
            </div>
            </div>
        </div>
    </>
  )
}

export default Login
