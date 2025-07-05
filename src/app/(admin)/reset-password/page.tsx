'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const schema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine(data => data.newPassword === data.confirm, {
  message: "Passwords don't match",
  path: ['confirm']
});

type Form = z.infer<typeof schema>;

export default function ResetPassword() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    try {
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation ResetPassword($token: String!, $newPassword: String!) {
              resetPassword(token: $token, newPassword: $newPassword)
            }
          `,
          variables: { token, newPassword: data.newPassword }
        })
      });

      const result = await res.json();
      
      if (result.errors) {
        setError(result.errors[0].message);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className='bg-[rgba(0,0,0,0.3)] w-full h-screen flex items-center justify-center'>
        <div className='bg-white lg:w-[583px] lg:p-[50px] flex flex-col border-[1px] border-[#cce5ff] lg:gap-[25px] items-center justify-center text-[#272222] lg:h-[447px] rounded-[32px] sm:w-[304px] w-[304px] sm:h-[328px] h-[328px] sm:p-[15px] p-[15px] sm:gap-[15px] gap-[15px]'>
          <h2 className='lg:text-[40px] font-normal text-[#4ff072] sm:text-[24px] text-[24px]'>
            Password Reset Successful!
          </h2>
          <p className="text-center text-gray-600">
            Your password has been updated successfully. You can now log in with your new password.
          </p>
          <button
            onClick={() => router.push('/adminlogin')}
            className='w-full lg:py-4 bg-[#007bff] text-white lg:text-[16px] lg:font-[600] lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:text-[12px] text-[12px] sm:font-[600] font-[600] sm:py-2 py-2 mt-4'
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      <div className='bg-[rgba(0,0,0,0.3)] w-full h-screen flex items-center justify-center'>
        <div className='bg-white lg:w-[583px] lg:p-[50px] flex flex-col border-[1px] border-[#cce5ff] lg:gap-[25px] items-center justify-center text-[#272222] lg:h-[447px] rounded-[32px] sm:w-[304px] w-[304px] sm:h-[328px] h-[328px] sm:p-[15px] p-[15px] sm:gap-[15px] gap-[15px]'>
          <h2 className='lg:text-[40px] font-normal text-[#55a7ff] sm:text-[24px] text-[24px]'>Reset Password</h2>

          <div className='flex w-full lg:gap-[20px] flex-col mt-[10px] sm:gap-[15px] gap-[15px]'>
            <div className="relative">
              <input
                className='w-full lg:placeholder:text-[16px] px-7 lg:py-3 border-[1px] border-[rgba(0,0,0,0.1)] outline-[#4ff072] lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:placeholder:text-[12px] placeholder:text-[12px] sm:py-2 py-2'
                placeholder='New Password'
                type={showPassword ? 'text' : 'password'}
                {...register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}


             <div className="relative">
              <input
                className='w-full lg:placeholder:text-[16px] px-7 lg:py-3 border-[1px] border-[rgba(0,0,0,0.1)] outline-[#4ff072] lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:placeholder:text-[12px] placeholder:text-[12px] sm:py-2 py-2'
                placeholder='Confirm Password'
                type={showPassword ? 'text' : 'password'}
                {...register('confirm')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            {errors.confirm && <p className="text-red-500 text-sm">{errors.confirm.message}</p>}
          </div>

          <button
            className='w-full lg:py-4 bg-[#007bff] text-white lg:text-[16px] lg:font-[600] lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:text-[12px] text-[12px] sm:font-[600] font-[600] sm:py-2 py-2'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </form>
  );
}