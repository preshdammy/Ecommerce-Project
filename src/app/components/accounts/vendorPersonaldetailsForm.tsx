"use client";

import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import Image from "next/image";
import camera from "../../../../public/figma images/camera.png";
import { ToastContainer, toast } from "react-toastify";

const UPDATE_VENDOR_PROFILE = gql`
  mutation UpdateVendorProfile(
    $email: String!
    $name: String
    $location: String
    $joinedDate: String
    $profilePicture: String
    $gender: String
  ) {
    updateVendorProfile(
      email: $email
      name: $name
      location: $location
      joinedDate: $joinedDate
      profilePicture: $profilePicture
      gender: $gender
    ) {
      id
      name
      email
    }
  }
`;

export default function PersonalDetailsForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    state: "",
    city: "",
    address: "",
    joinedDate: "",
    profilePicture: "",
    gender: "Male",
  });

  const [preview, setPreview] = useState<string | null>(null);

  const [updateVendorProfile, { loading, error }] = useMutation(UPDATE_VENDOR_PROFILE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ✅ File size validation using Toastify
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large. Please upload an image smaller than 2MB.");
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm((prev) => ({
          ...prev,
          profilePicture: base64String, 
        }));
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await updateVendorProfile({
      variables: {
        name: form.name,
        email: form.email,
        location: `${form.state}, ${form.city}`,
        joinedDate: form.joinedDate,
        profilePicture: form.profilePicture,
        gender: form.gender,
      },
    });

    toast.success("Profile updated successfully!");
  } catch (err: any) {
    console.error("Update failed:", err);
    toast.error(err?.message || "Something went wrong");
  }
};

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-2xl mx-auto px-4 min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Avatar Section */}
      <div className="relative mt-8">
        <div className="w-32 h-32 rounded-full border border-[#939090] flex items-center justify-center">
          <div className="relative w-28 h-28 rounded-full bg-white border border-[#939090] overflow-hidden">
            {preview ? (
              <Image src={preview} alt="Avatar" fill className="object-cover" />
            ) : (
              <Image src="/profilepic.png" alt="Avatar" fill className="object-cover" />
            )}
          </div>
        </div>
        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer">
          <Image src={camera} alt="Upload avatar" width={30} height={30} />
        </label>
        <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="mt-6 w-full space-y-4 flex flex-col">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border-2 border-[#D4D3D3] rounded-lg bg-white"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border-2 border-[#D4D3D3] rounded-lg bg-white"
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-3 border-2 border-[#D4D3D3] rounded-lg bg-white"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="p-3 border-2 border-[#D4D3D3] rounded-lg bg-white w-full sm:w-1/2"
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
            className="p-3 border-2 border-[#D4D3D3] rounded-lg bg-white w-full sm:w-1/2"
          >
            <option value="">Select City</option>
            <option>Ikeja</option>
            <option>Abuja</option>
            <option>Paris</option>
            <option>London</option>
          </select>
        </div>

        <input
          type="date"
          name="joinedDate"
          value={form.joinedDate}
          onChange={handleChange}
          className="w-full p-3 border-2 border-[#D4D3D3] rounded-lg bg-white"
        />

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

        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF4C3B] hover:bg-red-600 text-white px-6 py-3 rounded-2xl w-1/2 self-center"
        >
          {loading ? "Updating..." : "Update"}
        </button>

        {error && <p className="text-red-500 text-center">{error.message}</p>}
      </form>
    </div>
  );
}
