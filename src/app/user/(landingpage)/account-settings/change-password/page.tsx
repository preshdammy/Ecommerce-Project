'use client';

import AccountSettingsHeader from '../../../../components/accounts/AccountSettingHeader';
import ChangePasswordForm from '../../../../components/accounts/PasswordForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';


export default function ChangePasswordPage() {
  return (
    <>
      
      <ChangePasswordForm />

       <div className="md:hidden flex justify-center mt-6 pb-4">
        <Link 
          href="/user/account-settings" 
          className="flex gap-2 px-4 py-2 items-center bg-gray-100 text-gray-700 rounded-lg font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Settings</span>
        </Link>
      </div>
      </>
  );
}
