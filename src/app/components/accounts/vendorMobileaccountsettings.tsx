import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const menuItems = [
  { label: "Personal Details", path: "/vendor/account-settings/personal-details" },
  { label: "Business Information", path: "/vendor/account-settings/business-information", doubleBorder: true },
  { label: "Change contact details", path: "/vendor/account-settings/change-contact-details" },
  { label: "Change password", path: "/vendor/account-settings/change-password", doubleBorder: true },
  { label: "Orders", path: "/vendor/account-settings/orders" },
  { label: "Inbox", path: "/vendor/account-settings/inbox" },
  { label: "Payment Methods", path: "/vendor/account-settings/payment-methods", doubleBorder: true },
  { label: "Complaints", path: "/vendor/account-settings/complaints" },
  { label: "Delete my account", path: "/vendor/account-settings/delete-account", doubleBorder: true },
  { label: "Log out", path: "/vendor/account-settings/log-out" },

];

export default function MobileAccountSettings() {
  return (
    <div className="h-auto w-full p-4  mx-auto overflow-x-hidden overflow-hidden">
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
