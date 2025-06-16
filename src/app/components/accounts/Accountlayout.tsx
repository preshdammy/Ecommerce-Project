"use client";

import { usePathname } from "next/navigation";
import AccountSidebar from "./AccountSidebar";
import MobileAccountSettings from "./MobileAccountSettings";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRootSettingsPage = pathname === "/AccountSettings";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Constrain layout to 80% width on large screens */}
      <div className="w-full md:w-[80%]">
        {/* Mobile View */}
        <div className="block md:hidden w-full">
          {isRootSettingsPage ? (
            <MobileAccountSettings />
          ) : (
            <main className="p-4">{children}</main>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex mt-6 gap-6">
          <aside className="w-64 bg-white shadow rounded-xl">
            <AccountSidebar />
          </aside>
          <main className="flex-1 p-6 space-y-6 bg-white rounded-xl shadow">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
