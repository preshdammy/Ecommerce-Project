'use client'
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";



const CREATE_VENDOR = gql`
  mutation createVendor(
    $name: String!
    $email: String!
    $password: String!
  ) {
    createVendor(
      name: $name
      email: $email
      password: $password
    ) {
      id
      name
      email
    }
  }
`;

const Signup = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [createVendor, { loading, error, data }] = useMutation(CREATE_VENDOR);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match");
      return;
    }

    try {
      await createVendor({
        variables: {
          name: form.name,
          email: form.email,
          password: form.password,
        },
      });
      toast.success("Vendor account created!");
      setTimeout(() => router.push("/vendor/login"), 500);
 
      // Optionally redirect or reset form
    } catch (err) {
      console.error(err);
      toast.error("Failed to create vendor. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100">
        <ToastContainer position="top-center" />
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-[584px] h-[90%] border border-blue-300">
        <div className="w-full">
          <h2 className="text-[30px] font-semibold text-center text-[#55A7FF] mb-[10px]">Join Time Shoppy as a vendor</h2>
  
          <button className="w-full h-[58px] rounded-[16px] flex items-center justify-center border border-gray-300 py-0 mb-4 hover:bg-gray-50">
            <img
              src="/figma images/google.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            <span className="text-[20px] ml-2">Sign up with Google</span>
          </button>
  
          <div className="text-center text-[20px] text-gray-500 mb-4">OR</div>
  
          <form onSubmit={handleSubmit} className="text-[16px] space-y-3">
            <input
              name="name"
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              className="w-full h-[51px] px-6 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="email"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              className="w-full h-[51px] px-4 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="w-full h-[51px] px-4 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full h-[51px] px-4 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
  
            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
            {data && (
              <p className="text-green-600 text-sm mt-1">
                Welcome, {data.createVendor?.name}!
              </p>
            )}
  
            <button
              type="submit"
              className="w-full h-[51px] bg-[#007BFF] text-white text-[16px] py-2 rounded-[16px] hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
  
          <p className="text-[16px] text-center text-gray-500 mt-4">
            By clicking register, you agree to the
            <a href="#" className="text-blue-600 underline"> Terms of Service </a>
            and
            <a href="#" className="text-blue-600 underline"> Privacy Policy </a>, including
            <a href="#" className="text-blue-600 underline"> Cookie Use</a>.
          </p>
  
          <p className="text-[16px] text-center mt-4">
            Have an account already?
            <a href="/vendor/login" className="text-blue-600 font-medium hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Signup;
