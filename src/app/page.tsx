import { auth } from "@/auth";

import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="max-w-md text-center bg-white shadow-md rounded-xl p-8 border border-gray-200">
       
          <p className="text-gray-600 mb-6">
            You must be logged in to view this page.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900 transition"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-50 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 border border-gray-200 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome </h1>
        <p className="text-lg text-gray-600 mb-6">
          You are logged in as
          <span className="font-medium text-blue-600">
            {session.user?.email}
          </span>
        </p>
        <SignOutButton/>
     
      </div>
    </div>
  );
}
