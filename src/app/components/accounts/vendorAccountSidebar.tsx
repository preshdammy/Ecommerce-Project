"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsCartCheck } from 'react-icons/bs';
import { CiUser, CiPhone, CiCreditCard1, CiLocationOn, CiLock } from "react-icons/ci";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { GoInbox } from "react-icons/go";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { PiClockClockwise } from "react-icons/pi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";

const sidebarItems = [
  { icon: <CiUser />, label: 'Personal Details', path: '/AccountSettings/vendor' },
  { icon: <HiOutlineBuildingOffice2 />, label: 'Business Information', path: '/AccountSettings/vendor/Business-Information' },
  { icon: <CiPhone />, label: 'Change Contact Details', path: '/AccountSettings/vendor/Change-Contactdetails' },
  { icon: <CiLock />, label: 'Change Password', path: '/AccountSettings/vendor/Change-password' },
  { icon: <BsCartCheck />, label: 'Orders', path: '/AccountSettings/vendor/Orders' },
  { icon: <BsArrowCounterclockwise />, label: 'Refunds', path: '/AccountSettings/vendor/Refunds' },
  { icon: <GoInbox />, label: 'Inbox', path: '/AccountSettings/vendor/Inbox' },
  { icon: <PiClockClockwise />, label: 'Track Order', path: '/AccountSettings/vendor/Track-Order' },
  { icon: <CiLocationOn />, label: 'Address', path: '/AccountSettings/vendor/Address' },
  { icon: <AiOutlineDelete />, label: 'Delete My Account', path: '/AccountSettings/vendor/Delete-Account' },
  { icon: <IoIosLogOut />, label: 'Log out', path: '/AccountSettings/vendor/Log-Out' },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[250px] bg-white mt-4 pt-4 pb-6 px-4 rounded-xl shadow-sm border border-gray-200">
      <ul className="space-y-4">
        {sidebarItems.map((item, idx) => {
          const isActive = pathname === item.path || (pathname === '/AccountSettings' && item.path === '/AccountSettings/Personal-details');
          return (
            <li key={idx}>
              <Link
                href={item.path}
                className={
                  `group flex items-center gap-3 text-sm font-[400] rounded-md px-2 py-2 transition-colors focus:outline-none ` +
                  (isActive
                    ? ' text-[#007BFF]'  
                    : 'text-[#1C1C1C] hover:text-[#007BFF] focus:bg-blue-50 focus:text-[#007BFF]')
                }
              >
                <span className={
                  `text-lg transition-colors ` +
                  (isActive
                    ? 'text-[#007BFF]'  
                    : 'text-[#1C1C1C] group-hover:text-[#007BFF] group-focus:text-[#007BFF]')
                }>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
