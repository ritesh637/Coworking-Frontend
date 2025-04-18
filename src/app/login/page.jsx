"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, sendLoginOTP, verifyLoginOTP } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState("password");
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [otpData, setOtpData] = useState({ phone: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Handle password login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");

    const response = await loginUser(userData.email, userData.password);
    if (response.success) {
      alert("Login Successful");
      sessionStorage.setItem("user", JSON.stringify(response.user));
      router.push(response.role === "admin" ? "/admin" : "/");
    } else {
      setError(response.message);
    }
  };

  // Send OTP
  const handleSendOTP = async () => {
    setError("");
    if (!otpData.phone) {
      setError("Please enter your phone number.");
      return;
    }

    const response = await sendLoginOTP(otpData.phone);
    if (response.success) {
      alert("OTP sent to Email!");
      setOtpSent(true);
      startResendCooldown();
    } else {
      setError(response.message);
    }
  };

  // OTP Login Submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!otpData.otp) {
      setError("Please enter the OTP.");
      return;
    }

    const response = await verifyLoginOTP(otpData.phone, otpData.otp);
    if (response.success) {
      alert("Login Successful!");
      sessionStorage.setItem("user", JSON.stringify(response.user));
      router.push(response.role === "admin" ? "/admin" : "/");
    } else {
      setError(response.message);
    }
  };

  // Resend OTP cooldown logic
  const startResendCooldown = () => {
    setResendTimer(30); // 30 sec cooldown
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          ᴡᴇʟᴄᴏᴍᴇ ʙᴀᴄᴋ
        </h1>

        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              loginMethod === "password"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => {
              setLoginMethod("password");
              setOtpSent(false);
              setError("");
            }}
          >
            ᴘᴀꜱꜱᴡᴏʀᴅ ʟᴏɢɪɴ
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              loginMethod === "otp"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => {
              setLoginMethod("otp");
              setUserData({ email: "", password: "" });
              setError("");
            }}
          >
            ᴏᴛᴘ ʟᴏɢɪɴ
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {loginMethod === "password" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              ʟᴏɢɪɴ
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="tel"
              placeholder="Phone Number"
              value={otpData.phone}
              onChange={(e) =>
                setOtpData({ ...otpData, phone: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700"
              required
            />

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOTP}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                ꜱᴇɴᴅ ᴏᴛᴘ
              </button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otpData.otp}
                  onChange={(e) =>
                    setOtpData({ ...otpData, otp: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  ᴠᴇʀɪꜰʏ ᴏᴛᴘ & ʟᴏɢɪɴ
                </button>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-sm text-blue-600 hover:underline mt-2"
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </button>
              </>
            )}
          </form>
        )}

        <p className="mt-4 text-sm text-center text-gray-600">
          ᴅᴏɴ'ᴛ ʜᴀᴠᴇ ᴀɴ ᴀᴄᴄᴏᴜɴᴛ{" "}
          <Link href="/register" className="text-red-600 hover:underline">
            ʀᴇɢɪꜱᴛᴇʀ
          </Link>
        </p>
        <p className="mt-4 text-sm text-center text-gray-600">
          ꜰᴏʀɢᴇᴛ ᴘᴀꜱꜱᴡᴏʀᴅ{" "}
          <Link
            href="/forget-password"
            className="text-red-600 hover:underline"
          >
            ꜰᴏʀɢᴇᴛ ᴘᴀꜱꜱᴡᴏʀᴅ
          </Link>
        </p>
      </div>
    </div>
  );
}
