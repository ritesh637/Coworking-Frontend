"use client";
import Link from "next/link"; // ✅ Import Link

import React, { useState, useEffect } from "react";

const quotes = [
  "Need A Custom Space?",
  "Tailor-Made Offices Just for You",
  "Workspaces That Fit Your Needs",
  "Flexible Solutions, Unlimited Potential",
];

const CustomSpace = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFade(false);
      }, 500); // Half of the transition time
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
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
          <Link href="/contact">
            <button className="bg-white text-purple-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CustomSpace;
