'use client';

import { useState } from 'react';
import { IoEyeOutline } from "react-icons/io5";
import eyeclosed from '../../../../public/figma images/eye-closed.png';
import Image from 'next/image';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    // TODO: Implement password change logic here
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg bg-none mx-auto mt-3">
      {/* Current Password */}
      <div tabIndex={0} className='w-full px-7 lg:py-3 flex justify-between border-2 border-[#D4D3D3] lg:rounded-[16px] rounded-[100px] bg-[#f8f8f8] py-2 focus-within:border-blue-600'>
        <input
          className='w-full placeholder:text-[16px] focus:outline-none focus:ring-0 placeholder:text-[#272222] placeholder:tracking-[1px]'
          placeholder='Enter password'
          type={showPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <button type="button" onClick={() => setShowPassword(prev => !prev)}>
          {showPassword ? (
            <IoEyeOutline size={24} className='text-black opacity-20 w-6 h-6' />
          ) : (
            <Image src={eyeclosed} alt='' className='w-6 h-6' />
          )}
        </button>
      </div>

      {/* New Password */}
      <div tabIndex={0} className='w-full px-7 lg:py-3 flex justify-between border-2 border-[#D4D3D3] lg:rounded-[16px] rounded-[100px] bg-[#f8f8f8] py-2 focus-within:border-blue-600'>
        <input
          className='w-full placeholder:text-[16px] focus:outline-none focus:ring-0 placeholder:text-[#272222] placeholder:tracking-[1px]'
          placeholder='New password'
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="button" onClick={() => setShowPassword(prev => !prev)}>
          {showPassword ? (
            <IoEyeOutline size={24} className='text-black opacity-20 w-6 h-6' />
          ) : (
            <Image src={eyeclosed} alt='' className='w-6 h-6' />
          )}
        </button>
      </div>

      {/* Confirm New Password */}
      <div tabIndex={0} className='w-full px-7 lg:py-3 flex justify-between border-2 border-[#D4D3D3] lg:rounded-[16px] rounded-[100px] bg-[#f8f8f8] py-2 focus-within:border-blue-600'>
        <input
          className='w-full placeholder:text-[16px] focus:outline-none focus:ring-0 placeholder:text-[#272222] placeholder:tracking-[1px]'
          placeholder='Confirm New Password'
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="button" onClick={() => setShowPassword(prev => !prev)}>
          {showPassword ? (
            <IoEyeOutline size={24} className='text-black opacity-20 w-6 h-6' />
          ) : (
            <Image src={eyeclosed} alt='' className='w-6 h-6' />
          )}
        </button>
      </div>

      <button
        type="submit"
        className="bg-[#FF4C3B] text-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide w-1/2 sm:w-[150px] mx-auto block hover:bg-red-600"
      >
        UPDATE
      </button>
    </form>
  );
}
