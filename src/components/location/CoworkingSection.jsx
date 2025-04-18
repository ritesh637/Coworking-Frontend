import React from "react";

const CoworkingSection = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100 px-6 py-16">
      <div className="max-w-3xl text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-snug">
          Work Independently <br className="hidden md:block" /> Where Change
          Comes to Work.
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-4 px-2 md:px-0">
          Coworking allows professionals to share office space, reducing costs
          and increasing convenience through common infrastructure.
        </p>
        <blockquote className="text-base md:text-lg italic text-gray-700 border-l-4 border-gray-400 pl-4">
          "The future of work is not a place but a mindset."
        </blockquote>
      </div>
    </div>
  );
};

export default CoworkingSection;
