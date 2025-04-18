"use client";

import React from "react";
import { motion } from "framer-motion";

const ExperiencedTeam = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-4"
      >
        Experienced Team
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center text-gray-600 mb-8 max-w-2xl mx-auto"
      >
        Our dedicated professionals bring years of expertise to create a
        thriving coworking space.
      </motion.p>

      {/* Team Members Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6"
      >
        {[
          "https://live.templately.com/wp-content/uploads/2020/09/1936f236-team-1.jpg",
          "https://live.templately.com/wp-content/uploads/2020/09/f27aee20-team-5.jpg",
          "https://live.templately.com/wp-content/uploads/2020/09/b0750fb6-team-2.jpg",
          "https://live.templately.com/wp-content/uploads/2020/09/213c22e9-team-3.jpg",
          "https://live.templately.com/wp-content/uploads/2020/09/e0c4be3e-team-4.jpg",
          "https://live.templately.com/wp-content/uploads/2020/09/f27aee20-team-5.jpg",
        ].map((img, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden rounded-lg shadow-lg"
          >
            <img
              src={img}
              alt={`Team Member ${index + 1}`}
              className="w-full h-auto rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ExperiencedTeam;
