"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import Link from "next/link";
import { motion } from "framer-motion";

const OTPPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleGenerateOTP = async () => {
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/user/generateotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      toast.success(data.message);
      setCooldown(30);
    } catch (error) {
      toast.error("Error generating OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return toast.error("Enter the OTP");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/user/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      toast.success(data.message);
    } catch (error) {
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return toast.error("Enter new password");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/user/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      toast.success(data.message);
    } catch (error) {
      toast.error("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900"
    >
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleGenerateOTP}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={cooldown > 0 || loading}
        >
          {loading ? (
            <ClipLoader color="#fff" size={20} />
          ) : (
            `Generate OTP ${cooldown > 0 ? `(${cooldown}s)` : ""}`
          )}
        </button>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          onClick={handleVerifyOTP}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#fff" size={20} /> : "Verify OTP"}
        </button>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handleResetPassword}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#fff" size={20} /> : "Reset Password"}
        </button>

        <p className="text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default OTPPage;
