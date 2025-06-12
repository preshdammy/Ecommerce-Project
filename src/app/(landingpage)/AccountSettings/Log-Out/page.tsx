'use client';

import AccountLayout from '../../../components/accounts/Accountlayout';
import AccountSettingsHeader from '../../../components/accounts/AccountSettingHeader';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  function handleLogout() {
    // Implement your logout logic here, e.g., clearing tokens, calling API, etc.
    alert('Logged out successfully!');
    router.push('/'); // Redirect to home or login page
  }

  return (
    <AccountLayout>
      <AccountSettingsHeader title="Log Out" />
      <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto">
        <p className="mb-6 text-gray-700">
          Are you sure you want to log out? You will need to log in again to access your account.
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
        >
          Log Out
        </button>
      </div>
    </AccountLayout>
  );
}
