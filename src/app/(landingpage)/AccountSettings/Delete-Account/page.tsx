"use client";

import AccountLayout from "../../../components/accounts/Accountlayout";
import AccountSettingsHeader from "../../../components/accounts/AccountSettingHeader";
import DeleteAccountForm from "../../../components/accounts/DeleteAccountForm";
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';


export default function DeleteAccountPage() {
  return (
    <AccountLayout>
      <div className=" flex items-center gap-2 mb-4 text-blue-600">
        <Link href="/AccountSettings" className="flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-base font-medium">Back</span>
        </Link>
      </div>

      <AccountSettingsHeader title="Delete Account" />
      <DeleteAccountForm />
    </AccountLayout>
  );
}