import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const menuItems = [
  { label: "Personal Details", path: "/AccountSettings/vendor/Personal-details" },
  { label: "Business Information", path: "/AccountSettings/vendor/Business-Information", doubleBorder: true },
  { label: "Change contact details", path: "/AccountSettings/vendor/Change-Contactdetails" },
  { label: "Change password", path: "/AccountSettings/vendor/Change-password", doubleBorder: true },
  { label: "Delete my account", path: "/AccountSettings/vendor/Delete-Account" },
  { label: "Log out", path: "/AccountSettings/vendor/Log-Out" },
];

export default function MobileAccountSettings() {
  return (
    <div className="min-h-screen w-full p-4  mx-auto overflow-x-hidden overflow-hidden">
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
