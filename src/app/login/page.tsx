"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setError("root", {
        type: "manual",
        message: "Invalid email or password.",
      });
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 border-gray-200 border-2 w-[460px] mx-auto bg-white mt-20 py-6 rounded-xl">
      <div className="text-3xl font-extrabold py-4">Welcome Back,</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-[26rem] px-8"
      >
        <div>
          <label htmlFor="email" className="text-gray-700 block">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter Your Email Address"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email.",
              },
            })}
            className="border px-3 py-2 rounded w-full"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="text-gray-700 block">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter Your Password"
            {...register("password", {
              required: "Password is required.",
            })}
            className="border px-3 py-2 rounded w-full"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="text-red-600 text-sm">{errors.root.message}</p>
        )}

        <button className="rounded-full bg-blue-900 text-[#f8f8f8] w-full py-2 my-2">
          Login
        </button>
      </form>
      <div>
        <span className="text-gray-500 mr-2">Don't have an account?</span>
        <Link href="/signup" className="text-blue-900 hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
