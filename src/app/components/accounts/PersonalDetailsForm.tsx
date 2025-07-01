'use client';

import avatar from "../../../../public/avatar.jpg";
import Image from "next/image";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { gql, useMutation } from "@apollo/client";

const UPDATE_USER = gql`
  mutation updateuser($input: UpdateUserInput!) {
    updateuser(input: $input) {
      id
      name
      email
      address
      state
      city
      gender
      dateOfBirth
      profilePicture
    }
  }
`;

export default function PersonalDetailsForm() {
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    state: "",
    city: "",
    gender: "",
    dateOfBirth: "",
    profilePicture: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [updateUser, { loading }] = useMutation(UPDATE_USER);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const user = JSON.parse(userCookie);
      setForm((prev) => ({
        ...prev,
        id: user.id,
        name: user.name,
        email: user.email,
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateUser({ variables: { input: form } });
      alert("User updated successfully!");
    } catch (err: any) {
      console.error("Update failed:", err.message);
      alert("Failed to update user.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_unsigned_preset"); // Replace this

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, // Replace this
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        setForm({ ...form, profilePicture: data.secure_url });
        alert("Image uploaded successfully!");
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 pt-4 sm:px-6 lg:px-0 h-[90vh]">
    <div className="relative w-28 h-28 rounded-full border border-gray-500 overflow-hidden cursor-pointer">
  <label htmlFor="avatar-upload" className="w-full h-full block">
    <Image
      src={preview || form.profilePicture || avatar}
      alt="User Avatar"
      fill
      style={{ objectFit: "cover" }}
      className="rounded-full"
    />
  </label>

  <input
    type="file"
    className="hidden"
    id="avatar-upload"
    accept="image/*"
    onChange={handleImageUpload}
  />

  <div className="absolute bottom-0 right-0">
    <label htmlFor="avatar-upload" className="cursor-pointer">
      <img
        src="/figma images/Frame 193.png"
        alt="Upload Icon"
        className="w-7 h-7 bg-white rounded-full shadow-md p-1 transition duration-300 hover:scale-105 hover:brightness-90 z-auto"
      />
    </label>
  </div>
</div>



      <form className="mt-6 w-full space-y-4 flex flex-col" onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 border outline-[#CCE5FF] rounded-lg bg-white"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border outline-[#CCE5FF] rounded-lg bg-white"
          required
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-3 border outline-[#CCE5FF] rounded-lg bg-white"
          required
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="p-3 border outline-[#CCE5FF] rounded-lg bg-white w-full sm:w-1/2"
            required
          >
            <option disabled value="">Select State</option>
            {["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
              "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
              "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
              "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
              "Taraba", "Yobe", "Zamfara"].map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className="p-3 border outline-[#CCE5FF] rounded-lg bg-white w-full sm:w-1/2"
            required
          >
            <option disabled value="">Select City</option>
            <option>Ikeja</option>
            <option>Abuja</option>
            <option>Paris</option>
            <option>London</option>
          </select>
        </div>

        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          className="w-full p-3 border outline-[#CCE5FF] rounded-lg bg-white"
          required
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
              <span>{g}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 transition text-white px-6 py-3 rounded-lg w-full sm:w-1/2 self-center"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
