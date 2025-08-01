"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Vertify = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const inputRef = useRef<HTMLInputElement[]>([]);

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (timeLeft === 0) {
      setResendAvailable(true);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const OTP = otp.join("");
    console.log(OTP)
    console.log("Email:", email);
    
    try {
      const res = await fetch(
        "https://akil-backend.onrender.com/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, OTP }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Invalid code.");
      } else {
        setSuccess("Email vertified successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    const handleResend = async () => {
      setError("");
      setSuccess("");
      setLoading(true);
      try {
        const res = await fetch(
          "https://akil-backend.onrender.com/resend-otp",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        const data = await res.json();
        console.log("Resend response:", data);

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to resend code.");
        } else {
      
          setTimeLeft(30);
          setResendAvailable(false);
        }
      } catch (err) {
         console.error("Resend failed:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="w-md mx-auto text-center mt-20">
      <form action="" className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-extrabold">Vertify Email</h1>
        <p className="text-gray-500 text-sm text-left">
          We've sent a verification code to the email address you provided. To
          complete the verification process, please enter the code here.
        </p>
        <div className="flex gap-6">
          {otp.map((num, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={num}
              onChange={(e) => handleChange(i, e.target.value)}
              ref={(el) => {
                inputRef.current[i] = el!;
              }}
              className="w-14 h-14 text-2xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          ))}
        </div>
        <div className="flex gap-1 justify-center">
          <span className="text-sm text-gray-500">You can request to</span>
          <button
            type="button"
            disabled={!resendAvailable}
            onClick={handleResend}
            className={`font-semibold ${
              resendAvailable ? "text-blue-700" : "text-gray-400"
            }`}
          >
            Resend code
          </button>
          in
          <span className="font-mono">
            0:{timeLeft.toString().padStart(2, "0")}
          </span>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-blue-900 text-white w-full py-2 my-3"
        >
          {loading ? "verifying..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default Vertify;
