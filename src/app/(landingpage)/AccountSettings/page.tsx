'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import AccountLayout from '../../components/accounts/Accountlayout';
import AccountSettingsHeader from '../../components/accounts/AccountSettingHeader';
import PersonalDetailsForm from '../../components/accounts/PersonalDetailsForm';

export default function PersonalDetailsPage() {
  return (
    <AccountLayout>
      {/* Back button (visible on mobile only) */}
      <div className="md:hidden flex items-center gap-2 mb-4 text-blue-600">
        <Link href="/AccountSettings" className="flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-base font-medium">Back</span>
        </Link>
      </div>

      <AccountSettingsHeader title="Personal Details" />
      <PersonalDetailsForm />
    </AccountLayout>
  );
}
