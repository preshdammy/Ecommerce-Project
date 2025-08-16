'use client';

import { useRouter } from 'next/navigation';
import { LogOut, AlertTriangle } from 'lucide-react';
import AccountSettingsHeader from '../../../../components/accounts/AccountSettingHeader';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();

  function handleLogout() {
    alert('Logged out successfully!');
    router.push('/');
  }

  function handleCancel() {
    router.back(); // or navigate to another account page
  }

  return (
      <>
      <div className=" flex items-center gap-2 mb-4 text-blue-600">
        <Link href="/vendor/account-settings" className="flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-base font-medium">Back</span>
        </Link>
      </div>

      <AccountSettingsHeader title="Log Out" />

      <div className="max-w-lg mx-auto mt-12 bg-white border border-red-100 rounded-2xl shadow-md p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="text-red-600 w-10 h-10" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800">Are you sure you want to log out?</h2>
        <p className="text-gray-600">
          Logging out will end your current session. You’ll need to log in again to access your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-3 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-3 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
      </>
  );
}
