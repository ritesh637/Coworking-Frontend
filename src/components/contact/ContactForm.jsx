"use client";

import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

const quotes = ["ʟᴇᴛ'ꜱ ʙᴜɪʟᴅ ꜱᴏᴍᴇᴛʜɪɴɢ ᴀᴍᴀᴢɪɴɢ ᴛᴏɢᴇᴛʜᴇʀ"];

const ContactForm = () => {
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

  // Rotate quotes if you add more later
  useEffect(() => {
    if (quotes.length > 1) {
      const interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

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
          timestamp: new Date().toISOString(), // Add timestamp to prevent duplicate submissions
        }),
      });

      if (response.ok) {
        alert(" Thank you! Your message has been sent successfully.!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
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
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-purple-500 mix-blend-multiply filter blur-3xl animate-float1"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-indigo-500 mix-blend-multiply filter blur-3xl animate-float2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Heading */}
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

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="ꜰɪʀꜱᴛ ɴᴀᴍᴇ"
                      className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-white/70"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="ʟᴀꜱᴛ ɴᴀᴍᴇ"
                      className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-white/70"
                      required
                    />
                  </div>
                </div>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ᴇᴍᴀɪʟ ᴀᴅᴅʀᴇꜱꜱ"
                  className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-white/70"
                  required
                />

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="ꜱᴜʙᴊᴇᴄᴛ"
                  className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-white/70"
                  required
                />

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ"
                  rows="5"
                  className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-white/70"
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
                    ᴛʜᴀɴᴋ ʏᴏᴜ! ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ʜᴀꜱ ʙᴇᴇɴ ꜱᴇɴᴛ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-1/2"
          >
            <div className="space-y-6 h-full">
              {[
                {
                  icon: <MapPin size={28} className="text-purple-300" />,
                  title: "ᴀᴅᴅʀᴇꜱꜱ",
                  info: "1907 - 1910 ᴋᴀᴍᴅʜᴇɴᴜ ᴄᴏᴍᴍᴇʀᴢ, ꜱᴇᴄᴛᴏʀ 14, ᴋʜᴀʀɢʜᴀʀ, ɴᴀᴠɪ ᴍᴜᴍʙᴀɪ",
                },
                {
                  icon: <Mail size={28} className="text-purple-300" />,
                  title: "ᴇᴍᴀɪʟ",
                  info: "ᴍɴᴇꜱʜᴋ480@ɢᴍᴀɪʟ.ᴄᴏᴍ",
                  link: "mailto:customer.ᴍɴᴇꜱʜᴋ480@ɢᴍᴀɪʟ.ᴄᴏᴍ",
                },
                {
                  icon: <Phone size={28} className="text-purple-300" />,
                  title: "ᴄᴀʟʟ ᴜꜱ",
                  info: "+91 7707076831",
                  link: "tel:+97707076831",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="flex items-start gap-5 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all duration-300"
                >
                  <div className="p-3 bg-purple-900/30 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-200 mb-2">
                      {item.title}
                    </h3>
                    {item.link ? (
                      <a
                        href={item.link}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        {item.info}
                      </a>
                    ) : (
                      <p className="text-white/80">{item.info}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-20px, -20px);
          }
        }
        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, 20px);
          }
        }
        .animate-float1 {
          animation: float1 12s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default ContactForm;
