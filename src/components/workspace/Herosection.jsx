"use client";

import React, { useState, useEffect } from "react";

const quotes = [
  "Space To Realize Your Innovation",
  "Where Ideas Turn into Reality",
  "Empowering Your Creative Vision",
  "Innovate, Collaborate, Succeed",
];

const Herosection = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 3000); // Change quote every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-100 text-gray-900 py-16 flex flex-col items-center justify-center relative overflow-hidden text-center">
      <div
        className="absolute inset-0 bg-opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/path-to-pattern.png')" }}
      ></div>

      <h1 className="text-3xl md:text-5xl font-extrabold mb-4 relative z-10 transition-opacity duration-500">
        {quotes[quoteIndex]}
      </h1>

      <p className="text-gray-600 text-lg max-w-2xl relative z-10">
        
      </p>
    </section>
  );
};

export default Herosection;
