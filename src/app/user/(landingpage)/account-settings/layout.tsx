"use client";

import { usePathname } from "next/navigation";
import AccountSidebar from "../../../components/accounts/AccountSidebar";
import MobileAccountSettings from "../../../components/accounts/MobileAccountSettings";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRootSettingsPage = pathname === "/user/account-settings";

  return (
    <div className="bg-gray-100">
      {/* Mobile View - 80vh height */}
      <div className="block md:hidden w-full min-h-[65vh]">
        {isRootSettingsPage ? (
          <MobileAccountSettings />
        ) : (
          <main className="p-4">{children}</main>
        )}
      </div>

      {/* Desktop View - Full viewport height */}
      <div className="hidden md:flex justify-center min-h-screen">
        <div className="w-full max-w-[80%] mt-6 gap-6 flex">
          <aside className="w-64">
            <AccountSidebar />
          </aside>
          <main className="flex-1 p-6 space-y-6 rounded-xl ">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}