import React from 'react'
import Image from 'next/image'
import msg from '../../../../public/figma images/Group 88 (1).png'
import hamburger from '../../../../public/figma images/menu-01.png'
import msgprofile from '../../../../public/figma images/Group 86.png'

const Messages = () => {
  return (
   <>
     <div className='flex justify-between items-center px-[50px] py-[20px] mb-[150px]'>
        <div className='flex flex-col border-[1px] w-[27%] h-[434px] border-[#cce5ff] overflow-hidden rounded-[13px]'>
            <div className='flex justify-between p-3 items-center border-b-[1px] bg-[#007bff] border-b-[#cce5ff]'>
                <h4 className='text-[16px] text-white font-[700]'>My Messages</h4>
                <Image src={hamburger} alt='menu' />
            </div>
            <div className='overflow-y-scroll '>
            <button className='w-full focus:bg-[#cce5ff]'>
            <div className='flex gap-[10px] p-3 items-center border-b-[1px] border-[#cce5ff]'>
                <div>
                    <Image src={msgprofile} alt='profile' />
                </div>
                <div className='flex flex-col'>
                    <div className='flex justify-between'>
                        <p className='text-[10px] font-[300]'>Sunday Peter</p>
                        <p className='text-[10px] font-[300] text-[#272222] opacity-[50%]'>Nov 8</p>
                    </div>
                    <h5 className='text-[12px] font-[700]'>
                    12 Inch Memory Foam Mattress / Bed...
                    </h5>
                    <p className='text-[10px] font-[300]'>
                    Kindly message me on Whatsapp for more detail...
                    </p>
                </div>
            </div>
            </button>
            </div>
        </div>
        <div className='flex flex-col justify-center items-center w-[70%] h-[434px] border-[1px] rounded-[16px] border-[#cce5ff] bg-[#f5faff]'>
            <Image src={msg} alt='' />
            <p className='text-[10px] text-[#939090] font-[300]'>Select a chat to view conversation</p>
        </div>
     </div>
   </>
  )
}

export default Messages
