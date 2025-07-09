"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IoEyeOutline } from "react-icons/io5";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

import google from "../../../../../public/figma images/Frame 78.png";
import eyeclosed from "../../../../../public/figma images/eye-closed.png";

const LOGIN_VENDOR = gql`
  mutation LoginVendor($email: String!, $password: String!) {
    loginVendor(email: $email, password: $password) {
      token
      name
      email
    }
  }
`;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showpassword, setshowpassword] = useState(false);
  const [loginVendor, { loading, error }] = useMutation(LOGIN_VENDOR);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await loginVendor({
        variables: {
          email: form.email,
          password: form.password,
        },
      });

      Cookies.set(
        "vendor",
        JSON.stringify({
          id: data.loginVendor.id,
          name: data.loginVendor.name,
          email: data.loginVendor.email,
        }),
        { expires: 7 }
      );

      if (data?.loginVendor?.token) {
        Cookies.set("token", data.loginVendor.token);
        router.push("/VendorDashboard");
      } else {
        console.error("Login failed: No token returned.");
      }

    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="bg-[rgba(0,0,0,0.3)] w-full h-screen flex items-center justify-center">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white lg:w-[583px] lg:p-[50px] flex flex-col border-[1px] border-[#cce5ff] lg:gap-[25px] items-center text-[#272222] lg:h-[651px] rounded-[32px] sm:w-[304px] w-[304px] sm:h-[458px] h-[458px] sm:p-[20px] p-[20px] sm:gap-[20px] gap-[20px]">
        <h2 className="lg:text-[40px] lg:font-normal text-[#55a7ff] sm:text-[24px] text-[24px] sm:font-normal font-normal">
          Vendor Login
        </h2>

        <div className="w-full flex border-[1px] border-[rgba(0,0,0,0.1)] lg:rounded-[16px] lg:py-3 justify-center items-center lg:gap-[15px] lg:text-[20px] sm:rounded-[100px] rounded-[100px] sm:text-[12px] text-[12px] sm:font-normal font-normal sm:gap-[5px] gap-[5px] sm:py-2 py-2">
          <Image
            className="sm:w-[16px] w-[16px] sm:h-[16px] h-[16px] lg:w-[24px] lg:h-[24px]"
            src={google}
            alt=""
          />
          <button>Sign in with Google</button>
        </div>

        <p className="lg:text-[16px] lg:font-normal sm:text-[12px] text-[12px] sm:font-[500] font-[500]">
          OR
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full lg:gap-[20px] sm:gap-[10px] gap-[10px]"
        >
          <input
            name="email"
            type="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-7 lg:py-3 border-[1px] border-[rgba(0,0,0,0.1)] lg:bg-white outline-[#4ff072] lg:rounded-[16px] lg:placeholder:text-[16px] sm:rounded-[100px] rounded-[100px] sm:placeholder:text-[12px] placeholder:text-[12px] sm:placeholder:font-normal placeholder:font-normal sm:bg-[#f8f8f8] bg-[#f8f8f8] sm:py-2 py-2"
          />

          <div
            tabIndex={0}
            className="w-full px-7 lg:py-3 flex justify-between focus-within:outline lg:bg-white focus-within:outline-[#4ff072] border-[1px] border-[rgba(0,0,0,0.1)] lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:bg-[#f8f8f8] bg-[#f8f8f8] sm:py-2 py-2"
          >
            <input
              name="password"
              type={showpassword ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="outline-none w-full lg:placeholder:text-[16px] sm:placeholder:text-[12px] placeholder:text-[12px] sm:placeholder:font-normal placeholder:font-normal bg-transparent"
            />

            <button
              type="button"
              onClick={() => setshowpassword((prev) => !prev)}
            >
              {showpassword ? (
                <IoEyeOutline
                  size={24}
                  className="opacity-[20%] lg:w-[24px] lg:h-[24px] sm:w-[16px] w-[16px] sm:h-[16px] h-[16px]"
                />
              ) : (
                <Image
                  className="lg:w-[26px] lg:h-[24px] sm:w-[18px] w-[18px] sm:h-[16px] h-[16px]"
                  src={eyeclosed}
                  alt=""
                />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full lg:py-3 bg-[#007bff] text-white lg:text-[16px] lg:font-normal lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:text-[12px] text-[12px] sm:font-[600] font-[600] sm:py-2 py-2"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <button
            type="button"
            className="w-full lg:py-3 border-[1px] border-[#007bff] text-[#007bff] lg:text-[16px] lg:font-normal lg:rounded-[16px] sm:rounded-[100px] rounded-[100px] sm:text-[12px] text-[12px] sm:font-normal font-normal sm:py-2 py-2"
          >
            Forgot Password?
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">
              {error.message}
            </p>
          )}
        </form>

        <div className="flex lg:text-[16px] lg:mt-[20px] lg:font-normal gap-2 sm:text-[12px] text-[12px] sm:font-normal font-normal sm:mt-[10px] mt-[10px]">
          <p>Don't have an account?</p>
          <a
            href="/vendor/signup"
            className="text-[#007bff] font-bold hover:underline"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
