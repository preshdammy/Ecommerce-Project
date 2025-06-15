import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const menuItems = [
  { label: "Personal Details", path: "/AccountSettings/Personal-details" },
  { label: "Business Information", path: "/AccountSettings/Business-Information" },
  { label: "Change contact details", path: "/AccountSettings/Change-Contactdetails" },
  { label: "Change password", path: "/AccountSettings/Change-password" },
  { label: "Delete my account", path: "/AccountSettings/Delete-Account" },
  { label: "Log out", path: "/logout" },
];

export default function MobileAccountSettings() {
  return (
    <div className="w-full p-4 bg-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 p-4 rounded w-full bg-blue-600">
        <ChevronLeft className="text-white" />
        <h2 className="text-xl font-bold text-white ">
          Account Settings
        </h2>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-xl shadow mt-2 border-2 border-[#CCE5FF]">
        {menuItems.map((item, idx) => (
          <Link href={item.path} key={idx}>
            <div className="flex justify-between items-center border-b border-2 border-[#CCE5FF] p-4 w-full text-gray-800 cursor-pointer last:border-b-0 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <span>{item.label}</span>
              <ChevronRight className="h-5 w-5 text-gray-400 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
