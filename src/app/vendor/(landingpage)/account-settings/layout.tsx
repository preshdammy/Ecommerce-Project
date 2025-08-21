"use client";

import { usePathname } from "next/navigation";
import AccountSidebar from "../../../components/accounts/vendorAccountSidebar";
import MobileAccountSettings from "../../../components/accounts/vendorMobileaccountsettings";

export default function VendorAccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRootSettingsPage = pathname === "/vendor/account-settings";

  return (
    <div className="h-auto bg-gray-100">
      {/* Mobile View - Full width */}
      <div className="block md:hidden w-full h-auto">
        {isRootSettingsPage ? (
          <MobileAccountSettings />
        ) : (
          <main className="p-4">{children}</main>
        )}
      </div>

      {/* Desktop View - 80% width centered */}
      <div className="hidden md:flex justify-center">
        <div className="w-full max-w-[80%] mt-6 gap-6 flex">
          <aside className="w-64">
            <AccountSidebar />
          </aside>
          <main className="flex-1 p-6 space-y-6 rounded-xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}