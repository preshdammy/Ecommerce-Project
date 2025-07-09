"use client";

import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";

// GraphQL mutation (you should also update the schema to use `String` instead of `Upload`)
const UPDATE_VENDOR_PROFILE = gql`
  mutation UpdateVendorProfile(
    $email: String!
    $businessName: String
    $businessDescription: String
    $businessAddress: String
    $businessCertificate: String
    $businessOpeningTime: String
    $businessClosingTime: String
    $businessAvailability: String
  ) {
    updateVendorProfile(
      email: $email
      businessName: $businessName
      businessDescription: $businessDescription
      businessAddress: $businessAddress
      businessCertificate: $businessCertificate
      businessOpeningTime: $businessOpeningTime
      businessClosingTime: $businessClosingTime
      businessAvailability: $businessAvailability
    ) {
      id
      businessName
      businessDescription
    }
  }
`;

export default function BusinessInformationForm() {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessCertificate, setBusinessCertificate] = useState<string | null>(null);
  const [businessCertificateName, setBusinessCertificateName] = useState<string | null>(null);
  const [businessOpeningTime, setBusinessOpeningTime] = useState("");
  const [businessClosingTime, setBusinessClosingTime] = useState("");
  const [businessAvailability, setBusinessAvailability] = useState("");

  const [updateVendorProfile, { loading }] = useMutation(UPDATE_VENDOR_PROFILE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vendor email is required.");
      return;
    }

    try {
      await updateVendorProfile({
        variables: {
          email,
          businessName,
          businessDescription,
          businessAddress,
          businessCertificate,
          businessOpeningTime,
          businessClosingTime,
          businessAvailability,
        },
      });

      toast.success("Business information updated successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update business information.");
    }
  };

  const handleBusinessCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large. Please upload an image or PDF smaller than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setBusinessCertificate(base64);
        setBusinessCertificateName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-6 pt-6 sm:px-6 lg:px-0 h-[80vh] justify-center">
      <form onSubmit={handleSubmit} className="space-y-6 w-full bg-none">
        {/* Email */}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Vendor Email"
          className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]"
        />

        {/* Business Name */}
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Business Name"
          className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]"
        />

        {/* Business Description */}
        <input
          type="text"
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
          placeholder="Business Description"
          className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]"
        />

        {/* Business Address */}
        <input
          type="text"
          value={businessAddress}
          onChange={(e) => setBusinessAddress(e.target.value)}
          placeholder="Business Address"
          className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]"
        />

        {/* Business Certificate (base64) */}
        <div>
          <label
            htmlFor="businessCertificate"
            className="block mt-1 w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] cursor-pointer text-[#272222] text-[16px] tracking-[1px]"
          >
            {businessCertificateName || "Business certificate... choose a file"}
          </label>
          <input
            id="businessCertificate"
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleBusinessCertificateChange}
          />
        </div>

        {/* Opening and Closing Times */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={businessOpeningTime}
            onChange={(e) => setBusinessOpeningTime(e.target.value)}
            className="w-full sm:w-1/2 mt-1 h-[7vh] p-3 rounded-md border-2 border-[#D4D3D3] bg-white text-[16px] text-[#272222] tracking-[1px] focus:outline-none focus:ring-0 focus:border-blue-600"
          >
            <option disabled value="">Opening Time</option>
            <option>08:00 AM</option>
            <option>09:00 AM</option>
            <option>10:00 AM</option>
          </select>

          <select
            value={businessClosingTime}
            onChange={(e) => setBusinessClosingTime(e.target.value)}
            className="w-full sm:w-1/2 mt-1 h-[7vh] p-3 rounded-md border-2 border-[#D4D3D3] bg-white text-[16px] text-[#272222] tracking-[1px] focus:outline-none focus:ring-0 focus:border-blue-600"
          >
            <option disabled value="">Closing Time</option>
            <option>05:00 PM</option>
            <option>06:00 PM</option>
            <option>07:00 PM</option>
          </select>
        </div>

        {/* Availability */}
        <select
          value={businessAvailability}
          onChange={(e) => setBusinessAvailability(e.target.value)}
          className="mt-1 w-full h-[7vh] p-3 rounded-md border-2 border-[#D4D3D3] bg-white text-[16px] text-[#272222] tracking-[1px] focus:outline-none focus:ring-0 focus:border-blue-600"
        >
          <option disabled value="">Availability</option>
          <option>Available</option>
          <option>Not Available</option>
          <option>Weekends Only</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-1/2 mx-auto"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
