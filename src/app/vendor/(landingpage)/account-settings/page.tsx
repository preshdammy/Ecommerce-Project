'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import VendorAccountLayout from '../../../components/accounts/vendorAccountlayout';
import AccountSettingsHeader from '../../../components/accounts/AccountSettingHeader';
import VendorPersonalDetailsForm from '../../../components/accounts/vendorPersonalDetailsForm';
import MobileAccountSettings from '../../../components/accounts/MobileAccountSettings';

export default function VendorAccountSettingsPage() {
  return (
    <>
      <div className="block md:hidden">
        <MobileAccountSettings />
      </div>


      <div className="hidden md:block">
        <VendorAccountLayout>
          <div className="md:hidden flex items-center gap-2 mb-4 text-blue-600">
            <Link href="/vendor/account-settings" className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-base font-medium">Back</span>
            </Link>
          </div>
            <AccountSettingsHeader title="User Settings" />
           <VendorPersonalDetailsForm />
        </VendorAccountLayout>
       </div>
    </>
  );
}