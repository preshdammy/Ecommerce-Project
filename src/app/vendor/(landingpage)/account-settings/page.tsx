'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import AccountLayout from '../../../components/accounts/vendorAccountlayout';
import AccountSettingsHeader from '../../../components/accounts/AccountSettingHeader';
import PersonalDetailsForm from '../../../components/accounts/PersonalDetailsForm';
import MobileAccountSettings from '../../../components/accounts/MobileAccountSettings';

export default function UserAccountSettingsPage() {
  return (
    <>
      <div className="block md:hidden">
        <MobileAccountSettings />
      </div>


      <div className="hidden md:block">
        <AccountLayout>
          <div className="md:hidden flex items-center gap-2 mb-4 text-blue-600">
            <Link href="/vendor/account-settings" className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-base font-medium">Back</span>
            </Link>
          </div>
            <AccountSettingsHeader title="User Settings" />
           <PersonalDetailsForm />
        </AccountLayout>
       </div>
    </>
  );
}