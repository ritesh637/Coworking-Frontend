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
  const [loading, setLoading] = useState({
    generate: false,
    verify: false,
    reset: false,
  });
  const [cooldown, setCooldown] = useState(0);
  const [activeStep, setActiveStep] = useState(1); // 1: email, 2: otp, 3: password

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleGenerateOTP = async () => {
    if (!email) return toast.error("ᴘʟᴇᴀꜱᴇ ᴇɴᴛᴇʀ ʏᴏᴜʀ ᴇᴍᴀɪʟ");
    setLoading({ ...loading, generate: true });
    try {
      const res = await fetch("http://localhost:4000/api/user/generateotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setCooldown(30);
        setActiveStep(2);
      } else {
        toast.error(data.message || "ᴇʀʀᴏʀ ɢᴇɴᴇʀᴀᴛɪɴɢ ᴏᴛᴘ");
      }
    } catch (error) {
      toast.error("ᴇʀʀᴏʀ ɢᴇɴᴇʀᴀᴛɪɴɢ ᴏᴛᴘ");
    } finally {
      setLoading({ ...loading, generate: false });
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return toast.error("ᴇɴᴛᴇʀ ᴛʜᴇ ᴏᴛᴘ");
    setLoading({ ...loading, verify: true });
    try {
      const res = await fetch("http://localhost:4000/api/user/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setActiveStep(3);
      } else {
        toast.error(data.message || "ᴏᴛᴘ ᴠᴇʀɪꜰɪᴄᴀᴛɪᴏɴ ꜰᴀɪʟᴇᴅ");
      }
    } catch (error) {
      toast.error("ᴏᴛᴘ ᴠᴇʀɪꜰɪᴄᴀᴛɪᴏɴ ꜰᴀɪʟᴇᴅ");
    } finally {
      setLoading({ ...loading, verify: false });
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return toast.error("ᴇɴᴛᴇʀ ɴᴇᴡ ᴘᴀꜱꜱᴡᴏʀᴅ");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading({ ...loading, reset: true });
    try {
      const res = await fetch("http://localhost:4000/api/user/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        // Redirect to login after successful reset
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error(data.message || "ʀᴇꜱᴇᴛ ꜰᴀɪʟᴇᴅ");
      }
    } catch (error) {
      toast.error("ʀᴇꜱᴇᴛ ꜰᴀɪʟᴇᴅ");
    } finally {
      setLoading({ ...loading, reset: false });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800"
    >
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header with progress indicator */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-700 dark:to-teal-600 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">ᴘᴀꜱꜱᴡᴏʀᴅ ʀᴇᴄᴏᴠᴇʀʏ</h2>
          <div className="flex justify-center mt-6 space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activeStep >= step
                      ? "bg-white text-blue-600"
                      : "bg-blue-200/30 text-white"
                  } font-semibold`}
                >
                  {step}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    activeStep >= step
                      ? "text-white font-medium"
                      : "text-blue-100"
                  }`}
                >
                  {step === 1 ? "Email" : step === 2 ? "OTP" : "Password"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Step 1: Email Input */}
          {activeStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  ᴇᴍᴀɪʟ ᴀᴅᴅʀᴇꜱꜱ
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="ᴇɴᴛᴇʀ ʏᴏᴜʀ ʀᴇɢɪꜱᴛᴇʀᴇᴅ ᴇᴍᴀɪʟ"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                onClick={handleGenerateOTP}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white py-3 px-6 rounded-lg disabled:opacity-50 flex justify-center items-center transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={cooldown > 0 || loading.generate}
              >
                {loading.generate ? (
                  <ClipLoader color="#fff" size={20} />
                ) : (
                  <>
                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Send OTP"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 2: OTP Verification */}
          {activeStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  ᴠᴇʀɪꜰɪᴄᴀᴛɪᴏɴ ᴄᴏᴅᴇ
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="otp"
                    type="text"
                    placeholder="ᴇɴᴛᴇʀ 6-ᴅɪɢɪᴛ ᴏᴛᴘ"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none transition"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <button
                    onClick={handleGenerateOTP}
                    disabled={cooldown > 0}
                    className="whitespace-nowrap px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:text-gray-400"
                  >
                    {cooldown > 0 ? `ʀᴇꜱᴇɴᴅ (${cooldown}s)` : "ʀᴇꜱᴇɴᴅ"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ​🇨​​🇭​​🇪​​🇨​​🇰​ ​🇾​​🇴​​🇺​​🇷​ ​🇪​​🇲​​🇦​​🇮​​🇱​
                  ​🇫​​🇴​​🇷​ ​🇹​​🇭​​🇪​
                  ​🇻​​🇪​​🇷​​🇮​​🇫​​🇮​​🇨​​🇦​​🇹​​🇮​​🇴​​🇳​
                  ​🇨​​🇴​​🇩​​🇪​
                </p>
              </div>
              <button
                onClick={handleVerifyOTP}
                className="w-full bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white py-3 px-6 rounded-lg disabled:opacity-50 flex justify-center items-center transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={loading.verify}
              >
                {loading.verify ? (
                  <ClipLoader color="#fff" size={20} />
                ) : (
                  <>
                    ᴠᴇʀɪꜰʏ ᴄᴏᴅᴇ
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
              <button
                onClick={() => setActiveStep(1)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← ʙᴀᴄᴋ ᴛᴏ ᴇᴍᴀɪʟ
              </button>
            </motion.div>
          )}

          {/* Step 3: Password Reset */}
          {activeStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  ɴᴇᴡ ᴘᴀꜱꜱᴡᴏʀᴅ
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="ᴇɴᴛᴇʀ ʏᴏᴜʀ ɴᴇᴡ ᴘᴀꜱꜱᴡᴏʀᴅ"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none transition"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ᴍᴜꜱᴛ ʙᴇ ᴀᴛ ʟᴇᴀꜱᴛ 6 ᴄʜᴀʀᴀᴄᴛᴇʀꜱ
                </p>
              </div>
              <button
                onClick={handleResetPassword}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-6 rounded-lg disabled:opacity-50 flex justify-center items-center transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={loading.reset}
              >
                {loading.reset ? (
                  <ClipLoader color="#fff" size={20} />
                ) : (
                  <>
                    ʀᴇꜱᴇᴛ ᴘᴀꜱꜱᴡᴏʀᴅ
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
              <button
                onClick={() => setActiveStep(2)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← ʙᴀᴄᴋ ᴛᴏ ᴠᴇʀɪꜰɪᴄᴀᴛɪᴏɴ
              </button>
            </motion.div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ʀᴇᴍᴇᴍʙᴇʀ ʏᴏᴜʀ ᴘᴀꜱꜱᴡᴏʀᴅ?{" "}
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                ꜱɪɢɴ ɪɴ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OTPPage;
