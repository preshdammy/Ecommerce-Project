import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import frame from '../../../../../public/figma images/Component 2.png'
import shop from '../../../../../public/figma images/🦆 icon _shop alt_.png'

const Profilepage = () => {
  return (
   <>
   <div className='px-[20px] sm:px-[30px] md:px-[40px] xl:px-[60px] py-[40px] sm:py-[50px] md:py-[60px] xl:py-[70px]'>
  <div className='flex gap-[10px] items-center'>
    <div>
      <Image
        className='w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[160px] md:h-[160px] lg:w-[216px] lg:h-[216px] xl:w-[216px] xl:h-[216px]'
        src={frame}
        alt=''
      />
    </div>
    <div className='flex flex-col gap-[10px]'>
      <h2 className='text-[16px] font-[500] sm:text-[20px] sm:font-[600] md:text-[32px] md:font-[600] lg:text-[40px] lg:font-normal xl:text-[40px] xl:font-normal'>
        Bamidele Ogunbiyi
      </h2>
      <div className='text-[12px] sm:text-[14px] md:text-[16px] lg:text-[16px] xl:text-[16px] text-[#939090] font-normal flex gap-[15px] mt-[-8px] sm:mt-[-6px] md:mt-0'>
        <p>Lagos, Nigeria</p>
        <p className='flex gap-[2px] items-center'>
          <Image
            className='w-[15px] h-[15px] sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]'
            src={shop}
            alt=''
          />
          Soothe & Tie
        </p>
      </div>
      <Link
        className='text-[12px] sm:text-[14px] md:text-[16px] xl:text-[16px] text-[#939090] font-normal'
        href=''
      >
        Edit personal details
      </Link>
    </div>
  </div>

  <div className='flex flex-col gap-[20px] mt-[60px] sm:mt-[70px] md:mt-[100px] lg:mt-[120px] xl:mt-[130px] mb-[90px] sm:mb-[100px] md:mb-[200px] lg:mb-[250px] xl:mb-[260px] md:flex-row md:gap-[10%]'>
    <button className='flex items-center justify-between gap-[20px] px-[16px] sm:px-[20px] md:px-[24px] xl:px-[28px] py-[20px] sm:py-[24px] md:py-[28px] xl:py-[30px] w-[201px] sm:w-[250px] md:w-full text-[12px] sm:text-[14px] md:text-[20px] lg:text-[24px] xl:text-[24px] font-[500] md:font-normal xl:font-normal border-[1px] border-[#cce5ff] rounded-[14px] focus:text-[#007bff] focus:bg-[#f5faff]'>
      <p>My Purchases</p>
      <p className='text-[#007bff] font-[500] sm:font-[600] md:font-[600] text-[12px] sm:text-[14px] md:text-[20px] lg:text-[24px] xl:text-[24px]'>
        34
      </p>
    </button>

    <button className='flex items-center justify-between gap-[20px] px-[16px] sm:px-[20px] md:px-[24px] xl:px-[28px] py-[20px] sm:py-[24px] md:py-[28px] xl:py-[30px] w-[201px] sm:w-[250px] md:w-full text-[12px] sm:text-[14px] md:text-[20px] lg:text-[24px] xl:text-[24px] font-[500] md:font-normal xl:font-normal border-[1px] border-[#cce5ff] rounded-[14px] focus:text-[#007bff] focus:bg-[#f5faff]'>
      <p>My Deliveries</p>
      <p className='text-[#007bff] font-[500] sm:font-[600] md:font-[600] text-[12px] sm:text-[14px] md:text-[20px] lg:text-[24px] xl:text-[24px]'>
        11
      </p>
    </button>

    <button className='flex items-center justify-center px-[16px] sm:px-[20px] md:px-[24px] xl:px-[28px] py-[20px] sm:py-[24px] md:py-[28px] xl:py-[30px] w-[201px] sm:w-[250px] md:w-full text-[12px] sm:text-[14px] md:text-[20px] lg:text-[24px] xl:text-[24px] font-[500] md:font-normal xl:font-normal border-[1px] border-[#cce5ff] rounded-[14px] focus:text-[#007bff] focus:bg-[#f5faff]'>
      My Payments
    </button>
  </div>
</div>

   </>
  )
}

export default Profilepage
