"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "", // Changed from name to username
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

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
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-500 to-blue-500">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-96 max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
          ʀᴇɢɪꜱᴛᴇʀ
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && (
          <p className="text-green-500 text-sm text-center">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="ꜰᴜʟʟ ɴᴀᴍᴇ" // Updated placeholder
            onChange={handleChange}
            value={formData.username}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            name="email"
            placeholder="ᴇᴍᴀɪʟ"
            onChange={handleChange}
            value={formData.email}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="​🇵​​🇭​​🇴​​🇳​​🇪​ ​🇳​​🇺​​🇲​​🇧​​🇪​​🇷​"
            onChange={handleChange}
            value={formData.phoneNumber}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="password"
            name="password"
            placeholder="ᴘᴀꜱꜱᴡᴏʀᴅ"
            onChange={handleChange}
            value={formData.password}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
          >
            ʀᴇɢɪꜱᴛᴇʀ
          </motion.button>
          <p>
            ɪꜰ ʏᴏᴜ ʜᴀᴠᴇ ᴀʟʀᴇᴀᴅʏ ᴀɴ ᴀᴄᴄᴏᴜɴᴛ{" "}
            <Link href="/login">
              <span className="text-red-600">ʟᴏɢɪɴ</span>
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
