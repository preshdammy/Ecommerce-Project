import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const menuItems = [
  { label: "Personal Details", path: "/user/account-settings/personal-details" },
  { label: "Change contact details", path: "/user/account-settings/change-contact-details", doubleBorder: true },
  { label: "Change password", path: "/user/account-settings/change-password" },
  { label: "Orders", path: "/user/account-settings/orders", doubleBorder: true },
  { label: "Refunds", path: "/user/account-settings/refunds" },
  { label: "Inbox", path: "/user/account-settings/inbox", doubleBorder: true },
  { label: "Payment Methods", path: "/user/account-settings/payment-methods" },
  { label: "Complaints", path: "/user/account-settings/complaints", doubleBorder: true },
  { label: "Delete my account", path: "/user/account-settings/delete-account" },
  { label: "Log out", path: "/user/account-settings/log-out" },
];

export default function MobileAccountSettings() {
  return (
    <div className="h-auto w-full p-4 overflow-x-hidden overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 p-4 rounded w-full bg-blue-600">
        <ChevronLeft className="text-white" />
        <h2 className="text-xl font-bold text-white">
          Account Settings
        </h2>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-xl shadow mt-2 border-2 border-[#CCE5FF]">
        {menuItems.map((item, idx) => (
          <Link href={item.path} key={idx}>
            <div
              className={`
                flex justify-between items-center 
                w-full p-4 text-gray-800 cursor-pointer 
                hover:bg-blue-50 hover:text-blue-600 transition-colors
                ${item.doubleBorder ? 'border-b-5 border-[#CCE5FF]' : 'border-b-2 border-[#CCE5FF]'}
                ${idx === menuItems.length - 1 ? 'border-b-0' : ''}
              `}
            >
              <span>{item.label}</span>
              <ChevronRight className="h-5 w-5 text-gray-400 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
