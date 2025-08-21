'use client';

import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { IoEyeOutline } from "react-icons/io5";
import eyeclosed from '../../../../public/figma images/eye-closed.png';
import Image from 'next/image';

// Updated GraphQL mutation (no email)
const CHANGE_VENDOR_PASSWORD = gql`
  mutation ChangeVendorPassword($currentPassword: String!, $newPassword: String!) {
    changeVendorPassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [changePassword, { loading }] = useMutation(CHANGE_VENDOR_PASSWORD);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        variables: {
          currentPassword,
          newPassword,
        },
      });

      toast.success("Password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-auto max-w-lg bg-none mx-auto mt-3">

      {/* Current Password */}
      <div tabIndex={0} className='w-full px-7 py-2 flex justify-between border-2 border-[#D4D3D3] rounded-[100px] bg-[#f8f8f8] focus-within:border-blue-600'>
        <input
          placeholder='Enter current password'
          type={showPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className='w-full placeholder:text-[16px] focus:outline-none placeholder:text-[#272222] placeholder:tracking-[1px]'
        />
        <button type="button" onClick={() => setShowPassword(prev => !prev)}>
          {showPassword
            ? <IoEyeOutline size={24} className='text-black opacity-20 w-6 h-6' />
            : <Image src={eyeclosed} alt='' className='w-6 h-6' />}
        </button>
      </div>

      {/* New Password */}
      <div tabIndex={0} className='w-full px-7 py-2 flex justify-between border-2 border-[#D4D3D3] rounded-[100px] bg-[#f8f8f8] focus-within:border-blue-600'>
        <input
          placeholder='New password'
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className='w-full placeholder:text-[16px] focus:outline-none placeholder:text-[#272222] placeholder:tracking-[1px]'
        />
        <button type="button" onClick={() => setShowPassword(prev => !prev)}>
          {showPassword
            ? <IoEyeOutline size={24} className='text-black opacity-20 w-6 h-6' />
            : <Image src={eyeclosed} alt='' className='w-6 h-6' />}
        </button>
      </div>

      {/* Confirm New Password */}
      <div tabIndex={0} className='w-full px-7 py-2 flex justify-between border-2 border-[#D4D3D3] rounded-[100px] bg-[#f8f8f8] focus-within:border-blue-600'>
        <input
          placeholder='Confirm new password'
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className='w-full placeholder:text-[16px] focus:outline-none placeholder:text-[#272222] placeholder:tracking-[1px]'
        />
        <button type="button" onClick={() => setShowPassword(prev => !prev)}>
          {showPassword
            ? <IoEyeOutline size={24} className='text-black opacity-20 w-6 h-6' />
            : <Image src={eyeclosed} alt='' className='w-6 h-6' />}
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="bg-[#FF4C3B] text-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide w-1/2 sm:w-[150px] mx-auto block hover:bg-red-600"
      >
        {loading ? 'Updating...' : 'UPDATE'}
      </button>
    </form>
  );
}
