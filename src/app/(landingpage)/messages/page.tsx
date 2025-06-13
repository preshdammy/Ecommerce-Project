import React from 'react'
import Image from 'next/image'
import msg from '../../../../public/figma images/Group 88 (1).png'
import hamburger from '../../../../public/figma images/menu-01.png'
import msgprofile from '../../../../public/figma images/Group 86.png'
import hamburger2 from '../../../../public/figma images/Icon (3).png'

const Messages = () => {
  return (
   <>
   <div className='flex justify-between items-center lg:px-[50px] py-[20px] lg:mb-[150px] sm:px-[0px] px-[0px] sm:mb-[70px] mb-[70px] md:px-[30px] md:mb-[100px] xl:px-[60px] xl:mb-[180px]'>
    <div className='flex flex-col lg:border-[1px] lg:w-[27%] lg:h-[434px] lg:border-[#cce5ff] overflow-hidden rounded-[13px] sm:w-full w-full md:w-[35%] md:h-[434px] md:border-[1px] md:border-[#cce5ff] xl:w-[25%] xl:h-[434px] xl:border-[1px] xl:border-[#cce5ff]'>
        <div className='flex justify-between p-3 items-center border-b-[1px] lg:bg-[#007bff] border-b-[#cce5ff] sm:bg-white bg-white md:bg-[#f0f8ff] xl:bg-[#007bff]'>
            <h4 className='lg:text-[16px] lg:text-white lg:font-[700] sm:text-[#007bff] text-[#007bff] sm:text-[24px] text-[24px] sm:font-normal font-normal md:text-[20px] md:text-[#007bff] md:font-[600] xl:text-white xl:text-[16px] xl:font-[700]'>My Messages</h4>
            <Image className='sm:hidden hidden lg:block md:hidden xl:block' src={hamburger} alt='menu' />
            <Image className='sm:flex flex lg:hidden md:flex xl:hidden' src={hamburger2} alt='menu2' />
        </div>
        <div className='overflow-y-scroll'>
            <button className='w-full focus:bg-[#f5faff]'>
                <div className='flex gap-[15px] p-3 items-center border-b-[1px] border-[#cce5ff]'>
                    <div>
                        <Image src={msgprofile} alt='profile' />
                    </div>
                    <div className='flex flex-col text-left w-full'>
                        <div className='flex justify-between'>
                            <p className='text-[10px] font-[300] md:text-[11px] xl:text-[10px]'>Sunday Peter</p>
                            <p className='text-[10px] font-[300] text-[#272222] opacity-[50%] md:text-[11px] xl:text-[10px]'>Nov 8</p>
                        </div>
                        <h5 className='text-[12px] font-[700] md:text-[13px] xl:text-[12px]'>
                            12 Inch Memory Foam Mattress / Bed...
                        </h5>
                        <p className='text-[10px] font-[300] md:text-[11px] xl:text-[10px]'>
                            Kindly message me on Whatsapp for more detail...
                        </p>
                    </div>
                </div>
            </button>
        </div>
    </div>
    <div className='lg:flex flex-col justify-center items-center w-[70%] h-[434px] border-[1px] rounded-[16px] border-[#cce5ff] bg-[#f5faff] sm:hidden hidden md:flex md:w-[60%] md:h-[434px] md:border-[1px] md:rounded-[16px] md:border-[#cce5ff] md:bg-[#f5faff] xl:w-[73%] xl:h-[434px] xl:border-[1px] xl:rounded-[16px] xl:border-[#cce5ff] xl:bg-[#f5faff]'>
        <Image src={msg} alt='' />
        <p className='text-[10px] text-[#939090] font-[300] md:text-[11px] xl:text-[10px]'>Select a chat to view conversation</p>
    </div>
</div>
   </>
  )
}

export default Messages
