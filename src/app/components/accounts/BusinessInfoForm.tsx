// BusinessInformationForm.tsx
"use client";

import React from "react";

export default function BusinessInformationForm() {
  return (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Business Name</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 outline-[#CCE5FF] shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Registration Number</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 outline-[#CCE5FF] shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tax ID</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 outline-[#CCE5FF] shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Industry</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 outline-[#CCE5FF] shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  );
}
