"use client"; // Required for Next.js client components

import React, { useState, useEffect } from "react";

const quotes = [
  "Creativity is intelligence having fun. – Albert Einstein",
  "You can't use up creativity. The more you use, the more you have. – Maya Angelou",
  "Everything you can imagine is real. – Pablo Picasso",
  "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
];

const SurgeOfCreativity = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [bgColor, setBgColor] = useState(
    "bg-gradient-to-r from-purple-700 to-indigo-800"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const changeQuote = () => {
    setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  };

  const changeBgColor = () => {
    setBgColor((prev) =>
      prev === "bg-gradient-to-r from-purple-700 to-indigo-800"
        ? "bg-gradient-to-r from-green-600 to-blue-600"
        : "bg-gradient-to-r from-purple-700 to-indigo-800"
    );
  };

  return (
    <section
      className={`relative flex flex-col items-center justify-center min-h-[25vh] md:min-h-[35vh] w-full text-white px-6 md:px-12 py-8 text-center rounded-lg shadow-2xl transition-all duration-500 ${bgColor}`}
    >
      {/* Glowing Background Effect */}
      <div className="absolute inset-0 bg-opacity-20 blur-3xl rounded-lg transition-all duration-500"></div>

      {/* Title with Glowing Effect */}
      <h1 className="text-2xl md:text-4xl font-extrabold mb-4 drop-shadow-lg tracking-wide text-shadow-md animate-pulse">
        Ready to Take a New Surge of Creativity?
      </h1>

      {/* Quote Text */}
      <p className="text-lg md:text-xl italic opacity-90 mb-5 max-w-2xl animate-fadeIn text-shadow-md">
        {quotes[quoteIndex]}
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={changeQuote}
          className="relative z-10 bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-95"
        >
          Get Inspired ✨
        </button>

        <button
          onClick={changeBgColor}
          className="relative z-10 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-95"
        >
          Become A Member 🚀
        </button>
      </div>
    </section>
  );
};

export default SurgeOfCreativity;
