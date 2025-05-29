import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import frame from '../../../../public/figma images/Group 40.png'
import altimage from '../../../../public/figma images/🦆 icon _image outline_.png'
import colcamera from '../../../../public/figma images/Frame 193.png'
import ellipse from '../../../../public/figma images/Ellipse 7.png'
import shop from '../../../../public/figma images/🦆 icon _shop alt_.png'

const Profilepage = () => {
  return (
   <>
    <div className='px-[40px] py-[50px]'>
        <div className='flex gap-[30px] items-center'>
            <div>
                <Image className='relative' src={frame} alt=''/>
                <Image className='absolute top-[400px] left-[110px]' src={altimage} alt=''/>
                <Image className='absolute top-[465px] left-[194px] z-10' src={colcamera} alt=''/>
            </div>
            <div className='flex flex-col gap-[10px]'>
                <h2 className='text-[40px] font-normal'>Bamidele Ogunbiyi</h2>
                <div className='text-[16px] font-normal text-[#939090] flex gap-[15px]'>
                    <p>Lagos, Nigeria</p>
                    <p className='flex gap-[2px]'><Image src={shop} alt=''/>Soothe & Tie</p>
                </div>
                <Link className='text-[16px] text-[#939090] font-normal' href=''>Edit personal details</Link>
            </div>
        </div>
        <div className='flex justify-between mt-[120px] mb-[250px]'>
            <button className='flex border-[1px] focus:text-[#007bff] focus:bg-[#cce5ff] text-[24px] font-normal border-[#cce5ff] gap-[40px] px-8 py-6 rounded-[14px]'>
                <p>My Purchases</p>
                <p className='text-[#007bff] font-[600] text-[24px]'>34</p>
            </button>
            <button className='flex border-[1px] focus:text-[#007bff] focus:bg-[#cce5ff] text-[24px] font-normal border-[#cce5ff] gap-[40px] px-8 py-6 rounded-[14px]'>
                <p>My Deliveries</p>
                <p className='text-[#007bff] font-[600] text-[24px]'>11</p>
            </button>
            <button className='flex border-[1px] focus:text-[#007bff] focus:bg-[#cce5ff] text-[24px] font-normal border-[#cce5ff] px-15 py-6 rounded-[14px]'>
               My Payments
            </button>
        </div>
    </div>
   </>
  )
}

export default Profilepage
