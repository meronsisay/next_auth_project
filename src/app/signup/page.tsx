"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const page = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormData>();

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (form: FormData) => {
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("https://akil-backend.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: "user",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccess("Signup successful! Please check your email to verify.");
      reset(); 

      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
      }, 2000);
    } catch (err: any) {
      setError("root", { message: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 border-gray-200 border-2 w-[34rem] mx-auto bg-white my-5 py-6 rounded-xl">
      <div className="text-center flex flex-col gap-3 w-md">
        <h1 className="text-3xl font-extrabold">Sign Up Today!</h1>
        <button
          className="border-gray-300 border-1 rounded px-5 py-2 font-bold text-blue-900 w-90 mx-auto hover:bg-gray-100"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          sign up with Google
        </button>
        <p className="text-gray-500 text-sm">Or Sign Up with Email</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-[23rem]"
      >
        <div>
          <label htmlFor="fullname" className="text-sm text-gray-700">
            Full name
          </label>
          <input
            type="text"
            placeholder="Enter Your full name"
            {...register("name", { required: "Full name is required" })}
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter Email Address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p className="text-red-600 text-sm">{errors.root.message}</p>
        )}

        {success && <p className="text-green-600">{success}</p>}

        <button className="rounded-full bg-blue-900 text-white w-full py-2 my-3">
          {loading ? "signing up..." : "Continue"}
        </button>
      </form>

      <div>
        <span className=" text-gray-500 mr-2">Already have an account?</span>
        <Link href="/login" className="text-blue-900 font-bold hover:underline">
          Login
        </Link>
      </div>

      <div className="w-md text-gray-500 text-center">
        By clicking Continue, you acknowledge that you have read and accepted
        our Terms of Service and Privacy Policy.
      </div>
    </div>
  );
};

export default page;
