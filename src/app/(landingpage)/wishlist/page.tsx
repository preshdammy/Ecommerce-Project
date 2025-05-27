import React from 'react'
import Image from 'next/image'
import heart from '../../../../public/figma images/Group 27.png'
import imgoutline from '../../../../public/figma images/🦆 icon _image outline_ (2).png'
import pin from '../../../../public/figma images/map-pin.png'

const Wishlist = () => {
  return (
   <>
        <div className='flex flex-col gap-[20px] px-[50px] mb-[150px]'>
            <div className='text-[40px] font-normal'>
                My wishlist
            </div>
            <div className='grid grid-cols-4 gap-x-[70px] gap-y-[30px]'>
            <div className='w-[250px] h-[347px] flex flex-col border-[1px] justify-between border-[rgba(0,0,0,0.1)] rounded-[10px]'>
                <div className='flex justify-end py-[10px] px-[10px]'>
                    <Image src={heart} alt=''/>
                </div>
                <div className='flex justify-center'>
                    <Image src={imgoutline} alt=''/>
                </div>
                <div className='border-t-[1px] border-[rgba(0,0,0,0.1)] flex py-[10px] flex-col'>
                    <h3 className='text-[16px] font-bold px-[10px]'>NGN 65,000</h3>
                    <h4 className='text-[16px] font-normal px-[10px] '>Executive office table</h4>
                    <p className='text-[12px] font-normal text-[#272222] mt-[10px] px-[10px] opacity-[50%]'>Hardwood executive office table
                    with three drawers to place an...</p>
                    <div className='flex px-[10px] gap-[5px] mt-[20px]'>
                        <Image src={pin} alt=''/>
                        <p className='text-[12px] text-[#272222] opacity-[50%] font-normal'>Lagos, Gbagada</p>
                    </div>
                </div>
            </div>
           
            </div>
        </div>
   </>
  )
}

export default Wishlist
