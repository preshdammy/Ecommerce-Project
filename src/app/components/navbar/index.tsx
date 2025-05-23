import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import search from '../../../../public/figma images/search.png'
import heart from '../../../../public/figma images/heart.png'
import profile from '../../../../public/figma images/Group 94.png'
import noti from '../../../../public/figma images/Group 93.png'
import cart from '../../../../public/figma images/shopping-cart.png'
import logo from '../../../../public/figma images/Time Shoppy.png'

const Navbar = () => {
  return (
    
        <div className='flex md:w-[85%] w-[87%] font-sans sm:font-[inherit]  bg-[#272222]  mx-auto'>
            <div className=' w-[100%] text-white font-[400] flex gap-[20px] sm:gap-[30px] md:gap-[40px] text-[8px] sm:text-[12px] md:text-[20px] h-[24px] sm:h-[40px]  md:h-[53px] items-center mx-auto '>
                <Link href=''>Home</Link>
                <Link href=''>About us</Link>
                <Link href=''>Contact us</Link>
                <Link href=''>Help</Link>
            </div>


         

            {/* <div className='px-[50px] h-[160px] flex flex-col justify-between'>
                <div className='flex justify-between items-center'>
                    <Image className='w-[208px] h-[40px]' src={logo} alt=''/>
                    <div className='flex border-[1px] border-[rgba(0,0,0,0.1)] rounded-[100px] px-4 py-2'>
                    <input className='w-[500px]' placeholder='Search for anything' type="text" />
                    <button><Image className='w-[35px] h-[35px]' src={search} alt=''/></button>
                    </div>
                    <div className='flex gap-[40px]'>
                    <Image className='w-[30px] h-[30px]' src={heart} alt=''/>
                    <Image className='w-[45px] h-[30px]' src={noti} alt=''/>
                    <Image className='w-[45px] h-[30px]' src={profile} alt=''/>
                    <Image className='w-[30px] h-[30px]' src={cart} alt=''/>
                    </div>
                    
                </div>
                <div className='flex text-[20px] py-4 justify-between text-[#272222] border-t-[1px] border-[rgba(0,0,0,0.1)]'>
                <Link href=''>Electronics</Link>
                <Link href=''>Fashion</Link>
                <Link href=''>Health & Beauty</Link>
                <Link href=''>Furniture</Link>
                <Link href=''>Automobiles</Link>
                <Link href=''>Outdoors</Link>
                <Link href=''>Foods</Link>
                </div>
            </div> */}
        </div>
    
  )
}

export default Navbar
