'use client'
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from 'next/navigation';


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
      alert("Passwords do not match");
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
      alert("Vendor account created!");
      setTimeout(() => router.push("/vendor/login"), 500);
 
      // Optionally redirect or reset form
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="bg-gray-200 text-center py-4">
        <h1 className="text-2xl font-bold">Sign up</h1>
      </div>

      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-blue-300">
          <h2 className="text-xl font-semibold text-center text-blue-600 mb-6">
            Join Time Shoppy
          </h2>

          <button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-md mb-4 hover:bg-gray-50">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            <span>Sign up with Google</span>
          </button>

          <div className="text-center text-sm text-gray-500 mb-4">OR</div>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="email"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error.message}</p>
          )}
          {data && (
            <p className="text-green-600 text-sm mt-2">
              Welcome, {data.createVendor.name}!
            </p>
          )}

          <p className="text-xs text-center text-gray-500 mt-4">
            By clicking register, you agree to the{" "}
            <a href="#" className="text-blue-600 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline">
              Privacy Policy
            </a>
            , including{" "}
            <a href="#" className="text-blue-600 underline">
              Cookie Use
            </a>
            .
          </p>

          <p className="text-sm text-center mt-4">
            Have an account already?{" "}
            <a href="/vendor/login" className="text-blue-600 font-medium hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
