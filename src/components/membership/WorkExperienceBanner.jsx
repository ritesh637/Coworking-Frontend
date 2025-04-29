"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const WorkExperienceBanner = () => {
  const router = useRouter();
  const quotes = [
    "Ready To Try Different Work Experience Now",
    "Expand Your Professional Horizons",
    "Discover New Career Possibilities",
    "Grow Through Diverse Experiences",
  ];

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

  const handleBrowseOpportunities = () => {
    router.push("/about");
  };

  const handleLearnMore = () => {
    router.push("/contact");
  };

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 8s ease-in-out 2s infinite;
        }
      `}</style>

      <section className="relative py-12 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-float-delay"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2
              className={`text-3xl md:text-5xl font-bold text-gray-800 transition-opacity duration-500 ${
                fade ? "opacity-100" : "opacity-0"
              } leading-tight md:leading-snug`}
            >
              {quotes[quoteIndex]}
            </h2>

            <p className="mt-4 md:mt-6 text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              Explore diverse work environments and find what truly inspires
              you.
            </p>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={handleBrowseOpportunities}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Browse Opportunities
              </button>
              <button
                onClick={handleLearnMore}
                className="px-5 py-2.5 sm:px-6 sm:py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Animated dots indicator */}
        <div className="flex justify-center mt-8 md:mt-10 gap-2">
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
                index === quoteIndex ? "bg-blue-600 w-6" : "bg-gray-300"
              } focus:outline-none`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default WorkExperienceBanner;
