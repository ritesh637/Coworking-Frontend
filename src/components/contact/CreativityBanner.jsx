"use client";

import React, { useState, useEffect } from "react";

const quotes = [
  "Creativity is intelligence having fun.",
  "Innovation starts with a spark of creativity.",
  "Great ideas come from an inspired mind.",
  "Imagination is the beginning of creation.",
];

const CreativityBanner = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[60vh] w-full overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-purple-300 mix-blend-multiply filter blur-xl animate-float1"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-indigo-300 mix-blend-multiply filter blur-xl animate-float2"></div>
        <div className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full bg-blue-300 mix-blend-multiply filter blur-xl animate-float3"></div>
      </div>

      <div className="relative z-10 px-6 py-12 text-center max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Ready To Take A New <br className="hidden md:block" />{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Surge Of Creativity
          </span>
        </h1>

        <div className="min-h-[120px] md:min-h-[80px] flex items-center justify-center">
          <p
            className={`text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            {quotes[quoteIndex]}
          </p>
        </div>
        {/* Quote indicator dots */}
        <div className="flex justify-center mt-10 space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setFade(false);
                setTimeout(() => {
                  setQuoteIndex(index);
                  setFade(true);
                }, 200);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === quoteIndex
                  ? "bg-purple-600 w-6"
                  : "bg-gray-300 hover:bg-purple-300"
              }`}
              aria-label={`View quote ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Add some subtle floating shapes for visual interest */}
      <style jsx global>{`
        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(20px, 20px) rotate(5deg);
          }
        }
        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-15px, 15px) rotate(-5deg);
          }
        }
        @keyframes float3 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(10px, -10px) rotate(3deg);
          }
        }
        .animate-float1 {
          animation: float1 8s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 10s ease-in-out infinite;
        }
        .animate-float3 {
          animation: float3 12s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default CreativityBanner;
