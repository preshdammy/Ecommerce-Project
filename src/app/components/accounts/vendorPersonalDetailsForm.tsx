"use client"
import Image from "next/image";
import camera from "../../../../public/figma images/camera.png";
import dummy from "../../../../public/figma images/person-dummy.jpg"
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify"
import React, { useState } from "react"
import Cookies from "js-cookie";



const CREATE_UPDATE_VENDOR_PROFILE = gql`
  mutation UpdateVendorProfile(
    $profileName: String
    $personalEmail: String
    $personalProfilePic: String
    $address: AddressInput
    $gender: String
    $email: String! 
  ) {
    updateVendorProfile(
      profileName: $profileName
      personalEmail: $personalEmail
      personalProfilePic: $personalProfilePic
      address: $address
      gender: $gender
      email: $email
    ) {
      id
      profileName
      personalEmail 
      personalProfilePic
      gender
    }
  }
`;

export default function vendorPersonalDetailsForm() {
    const [preview, setPreview] = useState<string | null>(null);
    const [updateVendorProfile, { loading }] = useMutation(CREATE_UPDATE_VENDOR_PROFILE);
    const [form, setForm] = useState({
        personalProfilePic: "",
        profileName: "",
        personalEmail: "",
        gender: "",
        address: {
            street: "",
            city: "",
            state: "",
            zip: "",
            country: ""
          }
      });

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
          setForm((prev) => ({ ...prev, personalProfilePic: base64 }));
          setPreview(base64);
        };
        reader.readAsDataURL(file);
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      
        // Get email from cookie (or use your own logic)
        const vendorInfo = Cookies.get("vendorinfo");
        const email = vendorInfo ? JSON.parse(vendorInfo).email : "";
      
        if (!email) {
          toast.error("Unable to update: vendor email missing");
          return;
        }
      
        try {
          await updateVendorProfile({
            variables: {
              ...form,
              address: form.address,
              email,  
            },
          });
      
          toast.success("Vendor personal information updated successfully!");
          setForm({
            personalProfilePic: "",
            profileName: "",
            personalEmail: "",
            address: {
              street: "",
              city: "",
              state: "",
              zip: "",
              country: ""
            },
            gender: "",
          });
        } catch (error: any) {
          console.error(error);
          toast.error(error.message || "Failed to update.");
        }
      };
      
  return (
    <div className=" flex flex-col items-center justify-start w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-0 h-[55vh]">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* Avatar Section */}
      <div className="relative w-32 h-32 mx-auto">
        {/* outer ring */}
        <div className="w-32 h-32 rounded-full border border-[#939090] flex items-center justify-center">
                 <div className="relative w-30 h-30 rounded-full bg-white border border-[#939090] overflow-hidden">
                   {preview ? (
                     <Image src={preview} alt="Avatar" fill className="object-cover" />
                   ) : (
                     <Image src={dummy} alt="Avatar" fill className="object-cover" />
                   )}
                 </div>
               </div>
        {/* camera button */}
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-white rounded-full p-2  cursor-pointer"
        >
          <Image
            src={camera}
            alt="Upload avatar"
            width={30}
            height={30}
          />
        </label>
        <input onChange={handleAvatarChange} id="avatar-upload" type="file" className="hidden" />
      </div>

        <input name="profileName" value={form.profileName} onChange={handleChange} className="w-full p-3 border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 rounded-lg placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px] bg-white " placeholder="Full Name"  />
        <input name="personalEmail" value={form.personalEmail} onChange={handleChange} className="w-full p-3 border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 rounded-lg bg-white placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]" placeholder="Email" />
        <div className="flex mx-auto gap-[10px]">
        <input
        className="w-full p-3 border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 rounded-lg bg-white placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]" 
  name="street"
  value={form.address.street}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, street: e.target.value },
    }))
  }
  placeholder="Street Address"
/>

<input
className="w-full p-3 border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 rounded-lg bg-white placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]"
  name="city"
  value={form.address.city}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, city: e.target.value },
    }))
  }
  placeholder="City"
/>
</div>



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
