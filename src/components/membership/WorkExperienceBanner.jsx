"use client";

import React, { useState, useEffect } from "react";

const quotes = [
  "Ready To Try Different Work Experience Now",
];

const WorkExperienceBanner = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 3000); // Change quote every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center px-6 py-12 bg-gray-100 text-gray-900 relative">
      <div className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-lg -z-10"></div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 transition-opacity duration-500">
        {quotes[quoteIndex]}
      </h2>

      <p className="text-gray-600 text-center max-w-xl">
      
      </p>
    </section>
  );
};

export default WorkExperienceBanner;
