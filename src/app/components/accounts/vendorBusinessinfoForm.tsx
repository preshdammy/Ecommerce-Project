"use client";

import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import camera from "../../../../public/figma images/camera.png";
import dummy from "../../../../public/figma images/person-dummy.jpg"
import { toast } from "react-toastify";

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
    $location: String
    $joinedDate: String
    $profilePicture: String
    $gender: String
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
      location: $location
      joinedDate: $joinedDate
      profilePicture: $profilePicture
      gender: $gender
    ) {
      id
      businessName
      businessDescription
    }
  }
`;

export default function BusinessInformationForm() {
  const [form, setForm] = useState({
    email: "",
    businessName: "",
    businessDescription: "",
    businessAddress: "",
    businessCertificate: "",
    businessCertificateName: "",
    businessOpeningTime: "",
    businessClosingTime: "",
    businessAvailability: "",
    state: "",
    city: "",
    joinedDate: "",
    profilePicture: "",
    gender: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [updateVendorProfile, { loading }] = useMutation(UPDATE_VENDOR_PROFILE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile picture too large. Max 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({ ...prev, profilePicture: base64 }));
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleBusinessCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Certificate too large. Max 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({
        ...prev,
        businessCertificate: base64,
        businessCertificateName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email) {
      toast.error("Vendor email is required.");
      return;
    }

    try {
      await updateVendorProfile({
        variables: {
          ...form,
          location: `${form.state}, ${form.city}`,
        },
      });
      setForm({
        email: "",
        businessName: "",
        businessDescription: "",
        businessAddress: "",
        businessCertificate: "",
        businessCertificateName: "",
        businessOpeningTime: "",
        businessClosingTime: "",
        businessAvailability: "",
        state: "",
        city: "",
        joinedDate: "",
        profilePicture: "",
        gender: "",
      })

      toast.success("Business information updated successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-6 mt-[-70px] sm:px-6 lg:px-0 h-[150vh] justify-center">
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {/* Avatar Section */}
        <div className="relative w-32 h-32 mx-auto">
        {/* Avatar Circle */}
        <div className="w-32 h-32 rounded-full border border-[#939090] flex items-center justify-center">
          <div className="relative w-28 h-28 rounded-full bg-white border border-[#939090] overflow-hidden">
            {preview ? (
              <Image src={preview} alt="Avatar" fill className="object-cover" />
            ) : (
              <Image src={dummy} alt="Avatar" fill className="object-cover" />
            )}
          </div>
        </div>

  {/* Camera Icon */}
  <label
    htmlFor="avatar-upload"
    className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow"
  >
    <Image src={camera} alt="Upload avatar" width={30} height={30} />
  </label>

  <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
</div>


        {/* Email */}
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="Vendor Email"
          className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] 
          focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] 
          placeholder:text-[#272222] "
        />

        {/* Business Name */}
        <input
          name="businessName"
          value={form.businessName}
          onChange={handleChange}
          placeholder="Business Name"
          className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] 
          focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] 
          placeholder:text-[#272222] "
        />

        {/* Business Description */}
        <input
          name="businessDescription"
          value={form.businessDescription}
          onChange={handleChange}
          placeholder="Business Description"
          className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] 
          focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] 
          placeholder:text-[#272222] "
        />

        {/* Business Address */}
        <input
          name="businessAddress"
          value={form.businessAddress}
          onChange={handleChange}
          placeholder="Business Address"
          className="mt-1 block w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] 
          focus:outline-none focus:ring-0 focus:border-blue-600 placeholder:text-[16px] 
          placeholder:text-[#272222] "
        />

        {/* Business Certificate */}
        <div>
          <label
            htmlFor="businessCertificate"
            className="block mt-1 w-full h-[7vh] p-3 rounded-md bg-white border-2 border-[#D4D3D3] 
            cursor-pointer text-[#272222] text-[16px]"
          >
            {form.businessCertificateName || "Business certificate... choose a file"}
          </label>
          <input
            id="businessCertificate"
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleBusinessCertificateChange}
          />
        </div>

        {/* Time Fields */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            name="businessOpeningTime"
            value={form.businessOpeningTime}
            onChange={handleChange}
            className="w-full sm:w-1/2 mt-1 h-[7vh] p-3 rounded-md border-2 border-[#D4D3D3] 
            bg-white text-[16px] text-[#272222] focus:outline-none focus:ring-0 
            focus:border-blue-600"
          >
            <option value="">Opening Time</option>
            <option>08:00 AM</option>
            <option>09:00 AM</option>
            <option>10:00 AM</option>
          </select>

          <select
            name="businessClosingTime"
            value={form.businessClosingTime}
            onChange={handleChange}
            className="w-full sm:w-1/2 mt-1 h-[7vh] p-3 rounded-md border-2 border-[#D4D3D3] 
            bg-white text-[16px] text-[#272222] focus:outline-none focus:ring-0 
            focus:border-blue-600"
          >
            <option value="">Closing Time</option>
            <option>05:00 PM</option>
            <option>06:00 PM</option>
            <option>07:00 PM</option>
          </select>
        </div>

        {/* Availability */}
        <select
          name="businessAvailability"
          value={form.businessAvailability}
          onChange={handleChange}
          className="mt-1 w-full h-[7vh] p-3 rounded-md border-2 border-[#D4D3D3] bg-white 
          text-[16px] text-[#272222] focus:outline-none focus:ring-0 
          focus:border-blue-600"
        >
          <option value="">Availability</option>
          <option>Available</option>
          <option>Not Available</option>
          <option>Weekends Only</option>
        </select>

        {/* Location */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="p-3 border-2 border-[#D4D3D3] rounded-lg bg-white w-full sm:w-1/2 
            text-[16px] text-[#272222] focus:outline-none focus:border-blue-600"
          >
            <option value="">Select State</option>
            <option>Lagos</option>
            <option>Ibadan</option>
            <option>Kano</option>
            <option>Rivers</option>
          </select>

          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className="p-3 border-2 border-[#D4D3D3] rounded-lg bg-white w-full sm:w-1/2 
            text-[16px] text-[#272222] focus:outline-none focus:border-blue-600"
          >
            <option value="">Select City</option>
            <option>Ikeja</option>
            <option>Abuja</option>
            <option>Paris</option>
            <option>London</option>
          </select>
        </div>

        {/* Joined Date */}
        <input
          type="date"
          name="joinedDate"
          value={form.joinedDate}
          onChange={handleChange}
          className="w-full p-3 border-2 border-[#D4D3D3] rounded-lg bg-white 
          text-[16px] text-[#272222] focus:outline-none focus:border-blue-600"
        />

        {/* Gender */}
        <div className="flex items-center gap-4 justify-center">
          <span className="text-sm text-gray-700">Gender:</span>
          {["Female", "Male"].map((g) => (
            <label key={g} className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={form.gender === g}
                onChange={handleChange}
              />
              <span className="text-[#272222]">{g}</span>
            </label>
          ))}
        </div>

       {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-1/2"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

      </form>
    </div>
  );
}
