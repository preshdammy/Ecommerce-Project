import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import frame from '../../../../public/figma images/Group 40.png'
import altimage from '../../../../public/figma images/🦆 icon _image outline_.png'
import camera from '../../../../public/figma images/camera.png'
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
                <Image className='absolute top-[480px] left-[210px] z-10' src={camera} alt=''/>
                <Image className='absolute top-[462px] left-[192px]' src={ellipse} alt=''/>
            </div>
            <div className='flex flex-col gap-[10px]'>
                <h2 className='text-[40px] font-normal'>Bamidele Ogunbiyi</h2>
                <div className='text-[16px] font-normal flex gap-[15px]'>
                    <p>Lagos, Nigeria</p>
                    <p className='flex gap-[2px]'><Image src={shop} alt=''/>Soothe & Tie</p>
                </div>
                <Link className='text-[16px] font-normal' href=''>Edit personal details</Link>
            </div>
        </div>
        <div className='flex justify-between mt-[120px] mb-[250px]'>
            <button className='flex border-[1px] text-[20px] font-normal border-[rgba(0,0,0,0.1)] gap-[40px] px-5 py-6 rounded-[14px]'>
                <p>My Purchases</p>
                <p>34</p>
            </button>
            <button className='flex border-[1px] text-[20px] font-normal border-[rgba(0,0,0,0.1)] gap-[40px] px-5 py-6 rounded-[14px]'>
                <p>My Deliveries</p>
                <p>11</p>
            </button>
            <button className='flex border-[1px] text-[20px] font-normal border-[rgba(0,0,0,0.1)] px-12 py-6 rounded-[14px]'>
                Payments
            </button>
        </div>
    </div>
   </>
  )
}

export default Profilepage
