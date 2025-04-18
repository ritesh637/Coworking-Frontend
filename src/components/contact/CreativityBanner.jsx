"use client";

import React, { useState } from "react";

const quotes = [
  "Creativity is intelligence having fun.",
  "Innovation starts with a spark of creativity.",
  "Great ideas come from an inspired mind.",
  "Imagination is the beginning of creation.",
];

const CreativityBanner = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const changeQuote = () => {
    setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  };

  return (
    <section className="flex flex-col items-center justify-center h-[50vh] w-full bg-gray-100 text-gray-800 px-6 py-12 text-center">
      <h1 className="text-2xl md:text-4xl font-extrabold mb-4">
        Ready To Take A New <br /> Surge Of Creativity
      </h1>
      <p className="text-sm md:text-lg max-w-2xl mb-4">
        
      </p>
    </section>
  );
};

export default CreativityBanner;
