"use client";

import React, { useState, useEffect } from "react";

const quotes = [
  "Need A Custom Space?",
  "Tailor-Made Offices Just for You",
  "Workspaces That Fit Your Needs",
  "Flexible Solutions, Unlimited Potential",
];

const CustomSpace = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 3000); // Change quote every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-purple-600 text-white py-16 flex flex-col items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/path-to-pattern.png')" }}
      ></div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 relative z-10 transition-opacity duration-500">
        {quotes[quoteIndex]}
      </h2>

      <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition relative z-10">
        Contact Us
      </button>
    </section>
  );
};

export default CustomSpace;
