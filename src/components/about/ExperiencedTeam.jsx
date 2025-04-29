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
        Gallery
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center text-black mb-8 max-w-2xl mx-auto"
      >
        Explore our inspiring work environments
      </motion.p>

      {/* Team Members Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6"
      >
        {[
          "https://visionspaces.co/wp-content/uploads/2024/04/559X373px_Boutique-office_Image-6-copy.webp",
          "https://visionspaces.co/wp-content/uploads/2024/04/559X373px_Open-Desk_Image-8-copy.webp",
          "https://visionspaces.co/wp-content/uploads/2024/04/559X373px_Boutique-office_Image-4-copy.webp",
          "https://visionspaces.co/wp-content/uploads/2024/04/559X373px_Open-Desk_Image-9-copy.webp",
          "https://visionspaces.co/wp-content/uploads/2024/04/559X373px_Manager-cabin_Image-1-copy.webp",
          "https://visionspaces.co/wp-content/uploads/2024/04/559X373px_Manager-cabin_Image-3-copy.webp",
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
