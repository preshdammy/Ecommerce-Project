import React from 'react'
import Image from 'next/image'
import cancel from '../../../../../public/figma images/x-01.png'
import cart from '../../../../../public/figma images/shopping-cart (2).png'
import shirt from '../../../../../public/figma images/ryan-hoffman-6Nub980bI3I-unsplash-removebg-preview 1.png'
import trash from '../../../../../public/figma images/Icon.png'
import substract from '../../../../../public/figma images/Icon (1).png'
import add from '../../../../../public/figma images/add-square-02.png'

const Cartfid = () => {
  return (
    <>
      <div className='w-[552px] absolute right-[5px] top-[0px] h-screen bg-white flex flex-col z-12 p-[20px]'>
        <div className='ml-auto'>
            <Image src={cancel} alt=''/>
        </div>
        <div className='flex items-center my-[10px] gap-[15px]'>
            <Image src={cart} className='w-[30px] h-[27px]' alt=''/><p className='text-[24px] font-[600]'>3 items</p>
        </div>
        <div className='overflow-y-scroll'>
        <div className='flex justify-between py-[20px] items-center gap-[20px] border-t-[1px] border-t-[#f8f8f8] border-b-[1px] border-b-[#f8f8f8]'>
            <div className='flex flex-col items-center'>
                <Image src={add} alt=''/>
                <p className='text-[24px] font-[600]'>2</p>
                <Image src={substract} alt=''/>
            </div>
            <Image src={shirt} alt=''/>
            <div className='flex flex-col'>
                <p className='text-[16px] font-[600] pr-[190px] leading-[20px]'>Black Tee with a simple
                    white circular logo at
                    top left</p>
                <p className='text-[16px] text-[#939090] font-[600] mt-[6px]'>₦ 22,000 * 1</p>
                <p className='text-[16px] text-[#007bff] font-[600] mt-[4px]'>₦ 22,000</p>
            </div>
            <Image src={trash} alt=''/>
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
