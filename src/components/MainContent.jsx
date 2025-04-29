import React from "react";

const MainContent = () => {
  return (
    <main>
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600 mb-6">
            Discover a New Way to Work and Collaborate
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            Coworking spaces provide a vibrant, shared environment that fosters
            creativity, collaboration, and productivity among professionals from
            various industries.
          </p>
          <div className="flex justify-center">
            <a
              href="/about"
              className="inline-block py-3 px-8 bg-teal-500 text-white text-lg font-medium rounded-full shadow-lg transition duration-300 transform hover:bg-teal-600 hover:scale-105"
            >
              Explore Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
