"use client";

import React from "react";

export default function BusinessInformationForm() {
  return (
    <div className=" flex flex-col items-center w-full max-w-2xl mx-auto px-6 pt-6 sm:px-6 lg:px-0 h-[80vh] justify-center ">
      <form className="space-y-6 w-full bg-none">
        {/* Business Name */}
        <div>
          <input
            type="text"
            className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]"
            placeholder="Business Name"
          />
        </div>

        {/* Business Description */}
        <div>
          <input
            type="text"
            className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]"
             placeholder="Business Description"
          />
        </div>

        {/* Business Address */}
        <div>
          <input
            type="text"
            className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]"
             placeholder="Business Address"
          />
        </div>

        {/* Industry */}
        <div>

          <input
            type="file"
            className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]"
             placeholder="Business Certificate"
          />
        </div>

        {/* Opening and Closing Times */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
           
            <select className="mt-1 w-full h-[7vh] p-3 rounded-md border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 bg-white text-[16px] text-[#272222] tracking-[1px]">
              <option disabled selected> Opening Time</option>
              <option>08:00 AM</option>
              <option>09:00 AM</option>
              <option>10:00 AM</option>
            </select>
          </div>

          <div className="w-full sm:w-1/2">
            <select className="mt-1 w-full h-[7vh] p-3 rounded-md border-2 border-[#D4D3D3] shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600 bg-white text-[16px] text-[#272222] tracking-[1px]">
              <option disabled selected>Closing Time</option>
              <option>05:00 PM</option>
              <option>06:00 PM</option>
              <option>07:00 PM</option>
            </select>
          </div>
        </div>

        {/* Availability Status */}
        <div>
          <select className="mt-1 w-full h-[7vh] p-3 rounded-md border-2 border-[#D4D3D3] shadow-sm focus:outline-none focus:ring-0 focus:border-blue-600 bg-white text-[16px] text-[#272222] tracking-[1px]">
            <option disabled selected>Availabilty</option>
            <option>Available</option>
            <option>Not Available</option>
            <option>Weekends Only</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-1/2 sm:w-1/2 mx-auto"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
