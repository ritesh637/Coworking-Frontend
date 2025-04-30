"use client";
import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

const quotes = [
  "Need A Custom Space?",
  "Tailor-Made Offices Just for You",
  "Workspaces That Fit Your Needs",
  "Flexible Solutions, Unlimited Potential",
];

const CustomSpace = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFade(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
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
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowContactModal(false);
        }, 3000);
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
    <>
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20 md:py-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-4xl px-4 mx-auto text-center">
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 transition-opacity duration-500 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          >
            {quotes[quoteIndex]}
          </h2>

          <p className="text-lg md:text-xl text-purple-100 mb-8 md:mb-10 max-w-2xl mx-auto">
            We create perfect work environments tailored to your business
            requirements and company culture.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowContactModal(true)}
              className="bg-white text-purple-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 text-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
          >
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-white hover:text-purple-200 z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-purple-500 mix-blend-multiply filter blur-3xl animate-float1"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-indigo-500 mix-blend-multiply filter blur-3xl animate-float2"></div>
              </div>

              <div className="relative max-w-7xl mx-auto p-6 md:p-8">
                {/* Section Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                    GET IN TOUCH
                  </h2>
                  <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
                    "Let's build something amazing together"
                  </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Contact Form */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full"
                  >
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/10">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder="First Name"
                              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-white/70"
                              required
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder="Last Name"
                              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-white/70"
                              required
                            />
                          </div>
                        </div>

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email Address"
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-white/70"
                          required
                        />

                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Subject"
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-white/70"
                          required
                        />

                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Your Message"
                          rows="4"
                          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder:text-white/70"
                          required
                        ></textarea>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
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
                            "Submit Form"
                          )}
                        </button>

                        {submitSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-green-500/20 border border-green-400 rounded-lg text-green-100 text-center text-sm"
                          >
                            Thank you! Your message has been sent successfully.
                          </motion.div>
                        )}
                      </form>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default CustomSpace;
