import React from 'react' 
import Link from 'next/link'
import Image from 'next/image'
import cartpic from '../../../../public/figma images/🦆 icon _image outline_ (1).png'

const Cart = () => {
  return (
    <>
        <div className='flex flex-col gap-[30px] px-[50px] py-[50px]'>
            <div className='text-[40px] font-normal text-[#272222]'>
                <h2>My Cart</h2>
            </div>
            <div className='mb-[80px]'>
                <div className='flex justify-between items-center border-[1px] rounded-[16px] border-[rgba(0,0,0,0.1)] w-full p-[30px]'>
                    <div className='flex gap-[20px] items-center'>
                    <div>
                        <Image src={cartpic} alt='cart' />
                    </div>
                    <div className='flex flex-col'>
                        <h4 className='text-[#272222] text-[20px] font-normal'>Executive office table</h4>
                        <Link className='text-[#272222] text-[16px] opacity-[50%] font-normal' href=''>Hardwood executive office table <br/>with three drawers to place...</Link>
                    </div>
                    </div>
                    <div className='flex flex-col'>
                        <h4 className='text-[#272222] text-[20px] font-bold'>NGN 65,000</h4>
                        <Link className='text-[#272222] text-[16px] opacity-[50%] font-normal' href=''>Remove from cart</Link>
                    </div>
                </div>
            </div>
            <div className='flex ml-auto flex-col border-[1px] border-[rgba(0,0,0,0.1)] w-[50%] p-[25px] rounded-[16px] gap-[40px] mb-[260px]'>
                <div>
                    <input className='bg-[#edebeb] p-[20px] outline-none border-none rounded-[8px] w-full placeholder:text-[20px] placeholder:font-normal placeholder:text-[#918b93]' placeholder='Name your order' type="text" />
                </div>
                <div className='flex justify-between mt-[40px] px-[20px]'>
                    <p className='text-[#918b93] text-[20px] font-normal'>Subtotal</p>
                    <p className='text-black text-[20px] font-bold'>₦260,000</p>
                </div>
                <div className='flex justify-between px-[20px]'>
                    <p className='text-[#918b93] text-[20px] font-normal'>Time Shoppy credits</p>
                    <p className='text-black text-[20px] font-bold'>₦500</p>
                </div>
                <div className='flex justify-between border-t-[1px] border-[rgba(0,0,0,0.1)] pt-[10px]'>
                    <p className='text-[#918b93] text-[20px] font-normal px-[20px]'>Total</p>
                    <p className='text-black text-[20px] font-bold px-[20px]'>₦260,500</p>
                </div>
                <div className='flex justify-center'>
                    <button className='text-[24px] bg-[#272222] text-white border-none rounded-[100px] px-10 py-4 mt-[80px]'>Make Payment</button>
                </div>
               
            </div>
        </div>
    </>
  )
}

export default Cart
