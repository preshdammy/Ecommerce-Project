import React from 'react'
import Image from 'next/image'
import cancel from '../../../../../public/figma images/x-01.png'
import cart from '../../../../../public/figma images/shopping-cart (3).png'
import like from '../../../../../public/figma images/heart.png'
import cancel2 from '../../../../../public/figma images/Icon (2).png'
import shirt from '../../../../../public/figma images/ryan-hoffman-6Nub980bI3I-unsplash-removebg-preview 1.png'

const Cartfid = () => {
  return (
    <>
      <div className='w-[552px] absolute right-[5px] top-[0px] h-screen bg-white flex flex-col z-12 p-[20px]'>
        <div className='ml-auto'>
            <Image src={cancel} alt=''/>
        </div>
        <div className='flex items-center my-[10px] gap-[15px]'>
            <Image src={like} className='w-[27px] h-[27px]' alt=''/><p className='text-[24px] font-[600]'>3 items</p>
        </div>
        <div className='overflow-y-scroll'>
        <div className='flex justify-between py-[20px] items-center gap-[20px] border-t-[1px] border-t-[#f8f8f8] border-b-[1px] border-b-[#f8f8f8]'>
            <div className='flex items-center'>
                <Image src={cancel2} alt=''/>
            </div>
            <Image src={shirt} alt=''/>
            <div className='flex flex-col'>
                <p className='text-[16px] font-[600] pr-[190px] leading-[20px]'>Black Tee with a simple
                    white circular logo at
                    top left</p>
                <p className='text-[16px] text-[#007bff] font-[600] mt-[4px]'>₦ 22,000</p>
            </div>
            <Image src={cart} alt=''/>
        </div>
        </div>
        <div className='mx-auto mt-auto'>
            <button className='text-[16px] px-4 py-2 text-white bg-[#ff4c3b] font-[700]'>Checkout Now (₦ 66,000) </button>
        </div>

      </div>
    </>
  )
}

export default Cartfid
