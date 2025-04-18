"use client";

import React from "react";
import { motion } from "framer-motion";

const HomeMain = () => {
  return (
    <div className="bg-white">
      {/* Main Content */}
      <main className="p-6 md:p-10">
        <section className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold leading-tight"
          >
            Revolutionize The Way An Office Functions.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-600 max-w-2xl mx-auto"
          >
            Coworking allows professionals from various companies to share
            office space, promoting collaboration and cost-efficiency.
          </motion.p>
        </section>

        {/* Form Section */}
        <section className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-2xl font-bold">Get Your Space Now</h2>
            <form className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="location"
                  className="block text-gray-700 font-medium"
                >
                  Location
                </label>
                <select
                  id="location"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option>Navi Mumbai</option>
                  <option>Noida</option>
                  <option>Ahmedabad</option>
                  <option>Bengaluru</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="workspaceType"
                  className="block text-gray-700 font-medium"
                >
                  Workspace Type
                </label>
                <select
                  id="workspaceType"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option>Private Office</option>
                  <option>Global Office</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-gray-700 font-medium"
                >
                  Duration Of Stay
                </label>
                <input
                  type="date"
                  id="duration"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-lg font-semibold transition-transform"
              >
                Find Your Space
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2"
          >
            <img
              src="https://live.templately.com/wp-content/uploads/2020/09/65b84a5a-work-together-image.jpg"
              alt="Working Together"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className="flex flex-col items-center justify-center h-[60vh] text-white px-6 py-12 bg-fixed bg-cover bg-center bg-[url('https://images.pexels.com/photos/7433870/pexels-photo-7433870.jpeg')]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-3xl font-bold text-center mb-4"
          >
            Ready To Take A New Surge Of Creativity
          </motion.h1>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/booknow"
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold transition-transform"
          >
            Book a Space
          </motion.a>
        </section>
      </main>
    </div>
  );
};

export default HomeMain;
