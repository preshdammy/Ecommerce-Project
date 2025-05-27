import React from 'react'
import Image from 'next/image'
import msg from '../../../../public/figma images/Group 88.png'
import hamburger from '../../../../public/figma images/menu.png'
import msgprofile from '../../../../public/figma images/Group 86.png'

const Messages = () => {
  return (
   <>
     <div className='flex gap-[350px] items-center px-[50px] py-[20px] mb-[150px]'>
        <div className='flex flex-col border-[1px] w-[350px] h-[434px] border-[rgba(0,0,0,0.1)] rounded-[13px]'>
            <div className='flex justify-between p-3 items-center border-b-[1px] border-[rgba(0,0,0,0.1)]'>
                <h4 className='text-[16px] font-[700]'>My Messages</h4>
                <Image src={hamburger} alt='menu' />
            </div>
            <button>
            <div className='flex gap-[10px] p-3 items-center border-b-[1px] border-[rgba(0,0,0,0.1)]'>
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
        <div className='flex flex-col items-center'>
            <Image src={msg} alt='' />
            <p className='text-[10px] font-[300]'>Select a chat to view conversation</p>
        </div>
     </div>
   </>
  )
}

export default Messages
