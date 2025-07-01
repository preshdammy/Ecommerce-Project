"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/shared/lib/definitions"; // Optional: for zod/yup validation
import Cookies from "js-cookie";
const CREATE_USER = gql`
  mutation createuser($name: String!, $email: String!, $password: String!) {
    createuser(name: $name, email: $email, password: $password) {
      id
      name
      email
      password
    }
  }
`;

const Signup = () => {
  const router = useRouter();

  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [formerror, setformerror] = useState<Record<string, string>>({});
  const [signup, { data, loading, error }] = useMutation(CREATE_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation (optional: use Zod/Yup)
    if (!formdata.name || !formdata.email || !formdata.password) {
      setformerror({ general: "All fields are required" });
      return;
    }

    if (formdata.password !== formdata.confirmPassword) {
      setformerror({ confirmPassword: "Passwords do not match" });
      return;
    }

     try {
    const { data } = await signup({
      variables: {
        name: formdata.name,
        email: formdata.email,
        password: formdata.password,
      },
    });

    if (data?.createuser) {
      // ✅ Save user info to cookie
      Cookies.set("user", JSON.stringify({
        id: data.createuser.id,
        name: data.createuser.name,
        email: data.createuser.email,
      }));

      // Redirect to landing page
      router.push("/login"); // or wherever your landing page is
    }
  } catch (err: any) {
    console.error("Signup error:", err);
    setformerror({ general: err.message });
  }

  };

  return (
  <div className="bg-gray-100">
  <div className="flex justify-center items-center min-h-screen px-4">
    <div className="bg-white p-8 rounded-xl shadow-md w-[584px] h-[753px] border border-blue-300">
      <div className="w-full">
        <h2 className="text-[40px] font-semibold text-center text-[#55A7FF]">Join Time Shoppy</h2>

        <button className="w-full h-[64px] rounded-[16px] flex items-center justify-center border border-gray-300 py-2 mb-4 hover:bg-gray-50">
          <img src="/figma images/google.png" alt="Google" className="w-5 h-5 mr-2" />
          <span className="text-[20px] ml-2">Sign up with Google</span>
        </button>

        <div className="text-center text-[20px] text-gray-500 mb-4">OR</div>

        <form onSubmit={handleSubmit} className="text-[16px] space-y-3">
          <input
            name="name"
            type="text"
            placeholder="Enter full name"
            value={formdata.name}
            onChange={handleChange}
            className="w-full h-[51px] px-6 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Enter email address"
            value={formdata.email}
            onChange={handleChange}
            className="w-full h-[51px] px-4 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            value={formdata.password}
            onChange={handleChange}
            className="w-full h-[51px] px-4 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={formdata.confirmPassword}
            onChange={handleChange}
            className="w-full h-[51px] px-4 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {formerror.general && (
            <p className="text-red-500 text-sm">{formerror.general}</p>
          )}
          <button
            type="submit"
            className="w-full h-[51px] bg-[#007BFF] text-white text-[16px] py-2 rounded-[16px] hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-[16px] text-center text-gray-500 mt-4 ">
          By clicking register, you agree to the
          <a href="#" className="text-blue-600 underline"> Terms of Service </a>
          and
          <a href="#" className="text-blue-600 underline"> Privacy Policy </a>, including
          <a href="#" className="text-blue-600 underline"> Cookie Use</a>.
        </p>

        <p className="text-[16px] text-center mt-4">
          Have an account already?
          <a href="/login" className="text-blue-600 font-medium hover:underline"> Log in</a>
        </p>
      </div>
    </div>
  </div>
</div>

    
  );
};

export default Signup;
