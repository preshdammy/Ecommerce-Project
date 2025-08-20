"use client";
import Sidebar from "./sidebar";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      
      <button 
        className="md:hidden fixed top-3 right-3 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      
      <div className={`${sidebarOpen ? 'fixed inset-0 z-40' : 'hidden'} md:block md:w-[25%]`}>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      
      <div className={`flex-1 ${sidebarOpen ? 'hidden md:block' : 'w-full'}`}>
        <main className="p-4 md:p-6 bg-gray-100 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}