"use client";
import React, { useState } from "react";
import Image from "next/image";
import google from "../../../../../public/figma images/Frame 78.png";
import eyeclosed from "../../../../../public/figma images/eye-closed.png";
import { IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { gql, useMutation } from "@apollo/client";
import { log } from "console";

const LOGINUSER = gql`
  mutation loginuser($email: String!, $password: String!) {
    loginuser(email: $email, password: $password) {
      id
      email
      name
      token
    }
  }
`;

const Login = () => {
  const [showpassword, setshowpassword] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginUser, { loading, error }] = useMutation(LOGINUSER);

  const handleLogin = async () => {
    try {
      const response = await loginUser({ variables: { ...formData } });
      const user = response.data?.loginuser;
      console.log(user)
   
      if (user?.token) {
        Cookies.remove("vendortoken");
        Cookies.remove("admintoken");
        Cookies.remove("admininfo");
        Cookies.remove("vendorinfo");
        Cookies.set("usertoken", user.token, { expires: 7 });
        Cookies.set(
          "userinfo",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
          }),
          { expires: 7 }
        );
        router.push("/user/landingpage");
      } else {
        console.error("Login failed: No token returned.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="bg-[rgba(0,0,0,0.3)] w-full h-screen flex items-center justify-center">
      <div className="bg-white lg:w-[583px] lg:p-[50px] flex flex-col border-[1px] border-[#cce5ff] lg:gap-[25px] items-center text-[#272222] lg:h-[651px] rounded-[32px] sm:w-[304px] w-[304px] sm:h-[458px] h-[458px] sm:p-[20px] p-[20px] sm:gap-[20px] gap-[20px]">
        <h2 className="lg:text-[40px] text-[#55a7ff] sm:text-[24px]">Log in</h2>

        <div className="w-full flex border-[1px] border-[rgba(0,0,0,0.1)] lg:rounded-[16px] lg:py-3 justify-center items-center gap-[6px] lg:gap-[15px] text-[12px] sm:rounded-[100px] rounded-[100px] sm:py-2 py-2">
          <Image className="w-[16px] h-[16px] lg:w-[24px] lg:h-[24px]" src={google} alt="" />
          <button className="text-[12px] lg:text-[18px]">Sign in with Google</button>
        </div>

        <p className="lg:text-[16px] sm:text-[12px]">OR</p>

        <div className="flex w-full flex-col gap-[10px] lg:gap-[20px]">
          <input
            className="w-full px-7 py-2 sm:py-2 lg:py-3 border-[1px] border-[rgba(0,0,0,0.1)] bg-[#f8f8f8] lg:bg-white outline-[#4ff072] rounded-[100px] lg:rounded-[16px] placeholder:text-[12px] lg:placeholder:text-[16px]"
            placeholder="Enter email address"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <div
            tabIndex={0}
            className="w-full px-7 py-2 sm:py-2 lg:py-3 flex justify-between items-center focus-within:outline focus-within:outline-[#4ff072] border-[1px] border-[rgba(0,0,0,0.1)] bg-[#f8f8f8] lg:bg-white rounded-[100px] lg:rounded-[16px]"
          >
            <input
              className="outline-none w-full placeholder:text-[12px] lg:placeholder:text-[16px] bg-transparent"
              placeholder="Enter password"
              type={showpassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button onClick={() => setshowpassword((prev) => !prev)}>
              {showpassword ? (
                <IoEyeOutline
                  size={24}
                  className="opacity-[20%] lg:w-[24px] lg:h-[24px] sm:w-[16px] h-[16px]"
                />
              ) : (
                <Image
                  className="lg:w-[26px] lg:h-[24px] sm:w-[18px] sm:h-[16px]"
                  src={eyeclosed}
                  alt=""
                />
              )}
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[10px] lg:gap-[20px]">
          <button
            onClick={handleLogin}
            className="w-full py-2 sm:py-2 lg:py-3 bg-[#007bff] text-white text-[12px] lg:text-[16px] font-[600] lg:font-normal rounded-[100px] lg:rounded-[16px]"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <button className="w-full py-2 sm:py-2 lg:py-3 border-[1px] border-[#007bff] text-[#007bff] text-[12px] lg:text-[16px] font-normal rounded-[100px] lg:rounded-[16px]">
            Forgot Password?
          </button>
        </div>

        <div className="flex text-[12px] lg:text-[16px] gap-2 mt-[10px] lg:mt-[20px]">
          <p>Don't have an account?</p>
          <a href="/signup" className="text-[#007bff] font-bold">
            Sign up
          </a>
        </div>

        {error && (
          <p className="text-red-500 text-[12px] mt-2">
              {error.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
