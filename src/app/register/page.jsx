"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:4000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Registration successful!");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setError(result.message || "Registration failed.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-500 to-blue-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          ʀᴇɢɪꜱᴛᴇʀ
        </h2>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center mb-4 p-2 bg-red-50 rounded"
          >
            {error}
          </motion.p>
        )}

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-500 text-sm text-center mb-4 p-2 bg-green-50 rounded"
          >
            {message}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ꜰᴜʟʟ ɴᴀᴍᴇ
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="ᴇɴᴛᴇʀ ʏᴏᴜʀ ꜰᴜʟʟ ɴᴀᴍᴇ"
              onChange={handleChange}
              value={formData.username}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ᴇᴍᴀɪʟ
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="ᴇɴᴛᴇʀ ʏᴏᴜʀ ᴇᴍᴀɪʟ"
              onChange={handleChange}
              value={formData.email}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ᴘʜᴏɴᴇ ɴᴜᴍʙᴇʀ
            </label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              placeholder="ᴇɴᴛᴇʀ ʏᴏᴜʀ ᴘʜᴏɴᴇ ɴᴜᴍʙᴇʀ"
              onChange={handleChange}
              value={formData.phoneNumber}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ᴘᴀꜱꜱᴡᴏʀᴅ
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="ᴇɴᴛᴇʀ ʏᴏᴜʀ ᴘᴀꜱꜱᴡᴏʀᴅ"
              onChange={handleChange}
              value={formData.password}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-green-500 text-white py-3 rounded-lg transition ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-green-600"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "ʀᴇɢɪꜱᴛᴇʀ"
            )}
          </motion.button>

          <p className="text-center text-gray-600 mt-4">
            ᴀʟʀᴇᴀᴅʏ ʜᴀᴠᴇ ᴀɴ ᴀᴄᴄᴏᴜɴᴛ?{" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ʟᴏɢɪɴ
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
