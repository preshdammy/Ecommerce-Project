"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/shared/lib/definitions";
import Cookies from "js-cookie";

const CREATE_USER = gql`
  mutation createuser($name: String!, $email: String!, $password: String!) {
    createuser(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

const Signup = () => {
  const router = useRouter();

  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formerror, setformerror] = useState<Record<string, string>>({});
  const [signup, { loading }] = useMutation(CREATE_USER);

  // 🔍 Field-level validation using Zod
  const validateField = (field: string, value: string) => {
    const partialData = { ...formdata, [field]: value };

    const result = signupSchema.safeParse(partialData);
    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      if (fieldError) {
        setformerror((prev) => ({ ...prev, [field]: fieldError.message }));
      } else {
        setformerror((prev) => {
          const copy = { ...prev };
          delete copy[field];
          return copy;
        });
      }
    } else {
      setformerror((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setformdata((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formdata.password !== formdata.confirmPassword) {
      setformerror({ confirmPassword: "Passwords do not match" });
      return;
    }

    const result = signupSchema.safeParse({
      name: formdata.name,
      email: formdata.email,
      password: formdata.password,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (typeof field === "string") {
          fieldErrors[field] = err.message;
        }
      });
      setformerror(fieldErrors);
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
        router.push("/user/login");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setformerror({ general: err.message });
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-[584px] border border-blue-300">
          <h2 className="text-[40px] font-semibold text-center text-[#55A7FF] mb-6">Join Time Shoppy</h2>

          <button className="w-full h-[58px] rounded-[16px] flex items-center justify-center border border-gray-300 py-0 mb-4 hover:bg-gray-50">
            <img src="/figma images/google.png" alt="Google" className="w-5 h-5 mr-2" />
            <span className="text-[20px] ml-2">Sign up with Google</span>
          </button>

          <div className="text-center text-[20px] text-gray-500 mb-4">OR</div>

          <form onSubmit={handleSubmit} className="space-y-3 text-[16px]">
            <div>
              <input
                name="name"
                type="text"
                placeholder="Enter full name"
                value={formdata.name}
                onChange={handleChange}
                className="w-full h-[51px] px-6 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formerror.name && <p className="text-sm text-red-600">{formerror.name}</p>}
            </div>

            <div>
              <input
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formdata.email}
                onChange={handleChange}
                className="w-full h-[51px] px-4 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formerror.email && <p className="text-sm text-red-600">{formerror.email}</p>}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                value={formdata.password}
                onChange={handleChange}
                className="w-full h-[51px] px-4 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formerror.password && <p className="text-sm text-red-600">{formerror.password}</p>}
            </div>

            <div>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formdata.confirmPassword}
                onChange={handleChange}
                className="w-full h-[51px] px-4 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formerror.confirmPassword && <p className="text-sm text-red-600">{formerror.confirmPassword}</p>}
            </div>

            {formerror.general && <p className="text-sm text-red-600">{formerror.general}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[51px] bg-[#007BFF] text-white text-[16px] py-2 rounded-[16px] hover:bg-blue-700 transition disabled:opacity-50"
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
            <a href="/login" className="text-blue-600 font-medium hover:underline"> Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
