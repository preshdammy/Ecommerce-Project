"use client";

import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

const UPDATE_VENDOR_PROFILE = gql`
  mutation UpdateVendorProfile(
    $email: String!
    $storeName: String
    $avatar: String
    $bio: String
    $phone: String
    $location: String
    $address: AddressInput
  ) {
    updateVendorProfile(
      email: $email
      storeName: $storeName
      avatar: $avatar
      bio: $bio
      phone: $phone
      location: $location
      address: $address
    ) {
      id
      name
      email
    }
  }
`;

type AddressFields = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type VendorForm = {
  email: string;
  storeName: string;
  avatar: string;
  bio: string;
  phone: string;
  location: string;
  address: AddressFields;
};

const CompleteProfile = () => {
  const [form, setForm] = useState<VendorForm>({
    email: "",
    storeName: "",
    avatar: "",
    bio: "",
    phone: "",
    location: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [updateVendorProfile, { loading, error }] = useMutation(UPDATE_VENDOR_PROFILE);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name in form.address) {
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File too large. Please upload an image smaller than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm((prev) => ({
          ...prev,
          avatar: base64String,
        }));
        setPreviewAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateVendorProfile({ variables: form });
      alert("Profile updated successfully!");
      router.push("/vendor/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[rgba(0,0,0,0.3)] w-full h-screen flex items-center justify-center overflow-y-auto">
      <div className="bg-white lg:w-[583px] lg:p-[50px] flex flex-col border-[1px] border-[#cce5ff] lg:gap-[25px] items-center text-[#272222] rounded-[32px] sm:w-[304px] w-[304px] sm:p-[20px] p-[20px] sm:gap-[20px] gap-[20px]">
        <h2 className="lg:text-[40px] text-[#55a7ff] sm:text-[24px] font-normal">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          {[
            { name: "email", placeholder: "Enter email address" },
            { name: "storeName", placeholder: "Store name" },
            { name: "bio", placeholder: "Short bio" },
            { name: "phone", placeholder: "Phone number" },
            { name: "location", placeholder: "Location" },
            { name: "street", placeholder: "Street Address" },
            { name: "city", placeholder: "City" },
            { name: "state", placeholder: "State" },
            { name: "zip", placeholder: "ZIP Code" },
            { name: "country", placeholder: "Country" },
          ].map(({ name, placeholder }) => {
            const value =
              name in form.address
                ? form.address[name as keyof AddressFields]
                : form[name as keyof Omit<VendorForm, "address" | "avatar">];

            return (
              <input
                key={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="w-full px-7 py-2 border border-[rgba(0,0,0,0.1)] rounded-[100px] text-[12px] placeholder:font-normal bg-[#f8f8f8]"
              />
            );
          })}

          {/* Avatar Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Upload Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-7 py-2 border border-[rgba(0,0,0,0.1)] rounded-[100px] text-[12px] bg-[#f8f8f8]"
            />
            {previewAvatar && (
              <img
                src={previewAvatar}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover mt-2"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#007bff] text-white text-[12px] font-[600] rounded-[100px]"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
