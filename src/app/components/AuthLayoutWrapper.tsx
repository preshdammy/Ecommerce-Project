"use client";

import { usePathname } from "next/navigation";
import AccountLayout from "./accounts/Accountlayout";

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Optional logic: only use AccountLayout for account pages
  // if (pathname.startsWith("/AccountSettings")) {
  //   return <AccountLayout>{children}</AccountLayout>;
  // }

  return <>{children}</>;
}
