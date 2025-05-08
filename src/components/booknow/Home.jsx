"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import BookingCard from "./BookingCard";
import HeroSection from "./HeroSection";
import { motion, AnimatePresence } from "framer-motion";

const quotes = ["ʟᴇᴛ'ꜱ ʙᴜɪʟᴅ ꜱᴏᴍᴇᴛʜɪɴɢ ᴀᴍᴀᴢɪɴɢ ᴛᴏɢᴇᴛʜᴇʀ"];

const ContactForm = ({ onClose }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (quotes.length > 1) {
      const interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:4000/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert("Thank you! Your message has been sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
        setSubmitSuccess(true);
      } else {
        alert("Failed to submit form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-lg"
      />

      {/* Contact Form */}
      <motion.section
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 text-white rounded-xl shadow-xl w-full max-w-4xl mx-auto"
      >
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-xl p-[2px]">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 animate-borderAnimation"></div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500 opacity-0 animate-borderAnimation delay-1000"></div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 animate-borderAnimation delay-2000"></div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 animate-borderAnimation delay-3000"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-white text-purple-800 font-bold py-1 px-3 rounded-full hover:bg-gray-200 transition-all z-50"
        >
          ✕
        </button>

        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-purple-500 mix-blend-multiply filter blur-3xl animate-float1"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-indigo-500 mix-blend-multiply filter blur-3xl animate-float2"></div>
        </div>

        <div className="relative max-w-4xl mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              ɢᴇᴛ ɪɴ ᴛᴏᴜᴄʜ
            </h2>
            <p className="text-xl md:text-2xl text-purple-200 max-w-2xl mx-auto">
              "{quotes[quoteIndex]}"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white/10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="ꜰɪʀꜱᴛ ɴᴀᴍᴇ"
                  className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-lg placeholder:text-white/70"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="ʟᴀꜱᴛ ɴᴀᴍᴇ"
                  className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-lg placeholder:text-white/70"
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ᴇᴍᴀɪʟ ᴀᴅᴅʀᴇꜱꜱ"
                className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-lg placeholder:text-white/70"
                required
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="ꜱᴜʙᴊᴇᴄᴛ"
                className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-lg placeholder:text-white/70"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ"
                rows="5"
                className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-lg placeholder:text-white/70"
                required
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  isSubmitting
                    ? "bg-purple-800 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg"
                } flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                  </>
                ) : (
                  "ꜱᴜʙᴍɪᴛ ꜰᴏʀᴍ"
                )}
              </button>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/20 border border-green-400 rounded-lg text-green-100 text-center"
                >
                  Thank you! Your message has been sent successfully.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default function Home() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/office/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.offices)) {
          setOffices(data.offices);
        } else {
          console.error("Expected offices to be an array:", data);
          setOffices([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching offices:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      {/* Add the animation keyframes to your global CSS */}
      <style jsx global>{`
        @keyframes borderAnimation {
          0%,
          100% {
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
        }
        .animate-borderAnimation {
          animation: borderAnimation 4s infinite;
        }
      `}</style>

      {/* Blur effect when contact form is open */}
      <div className={`${showContact ? "blur-sm" : ""}`}>
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              ᴏᴜʀ <span className="text-blue-600">ᴍᴜᴍʙᴀɪ</span> ʟᴏᴄᴀᴛɪᴏɴꜱ
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {offices.map((office) => (
                <BookingCard key={office._id || office.id} office={office} />
              ))}
            </div>
          )}

          <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 sm:p-10 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4"></h3>
            <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
            ᴡᴇ ʜᴀᴠᴇ ᴍᴏʀᴇ ʟᴏᴄᴀᴛɪᴏɴꜱ ᴄᴏᴍɪɴɢ ꜱᴏᴏɴ. ᴄᴏɴᴛᴀᴄᴛ ᴜꜱ ꜰᴏʀ ᴄᴜꜱᴛᴏᴍ
            ꜱᴏʟᴜᴛɪᴏɴꜱ.
            </p>
            <button
              onClick={() => setShowContact(true)}
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              ᴄᴏɴᴛᴀᴄᴛ ᴏᴜʀ ᴛᴇᴀᴍ
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showContact && <ContactForm onClose={() => setShowContact(false)} />}
      </AnimatePresence>
    </div>
  );
}
