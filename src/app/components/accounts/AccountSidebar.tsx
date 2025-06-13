import Link from 'next/link';
import {
  FaUser,
  FaBuilding,
  FaPhone,
  FaLock,
  FaTrash,
  FaSignOutAlt,
} from 'react-icons/fa';

const sidebarItems = [
  { icon: <FaUser />, label: 'Personal Details', path: '/AccountSettings/Personal-details' },
  { icon: <FaBuilding />, label: 'Business Information', path: '/AccountSettings/Business-Information' },
  { icon: <FaPhone />, label: 'Change Contact Details', path: '/AccountSettings/Change-Contactdetails' },
  { icon: <FaLock />, label: 'Change Password', path: '/AccountSettings/Change-password' },
  { icon: <FaTrash />, label: 'Delete My Account', path: '/AccountSettings/Delete-Account' },
  { icon: <FaSignOutAlt />, label: 'Log out', path: '/AccountSettings/Log-Out' },
];

export default function AccountSidebar() {
  return (
    <aside className="w-64 bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 text-white px-4 py-5">
        <h2 className="text-lg font-bold">Account Settings</h2>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {sidebarItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 hover:text-blue-500 transition-colors text-gray-800"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-base font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
