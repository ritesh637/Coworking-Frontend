"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";

const HomeMain = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  const features = [
    {
      icon: "🏢",
      title: "Premium Spaces",
      description:
        "State-of-the-art facilities designed for comfort and productivity.",
    },
    {
      icon: "🤝",
      title: "Networking",
      description:
        "Connect with like-minded professionals and grow your network.",
    },
    {
      icon: "☕",
      title: "Amenities",
      description:
        "Enjoy premium amenities including cafes, lounges, and meeting rooms.",
    },
    {
      icon: "🚀",
      title: "Growth",
      description:
        "Resources and events to help your business scale new heights.",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:px-4 focus:py-2 focus:rounded dark:focus:bg-gray-800"
      >
        Skip to content
      </a>

      {/* Main Content */}
      <main
        id="main-content"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      >
        {/* Hero Section */}
        <section className="text-center mb-16 md:mb-24">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-300"
          >
            Revolutionize The Way An Office Functions.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Coworking allows professionals from various companies to share
            office space, promoting collaboration and cost-efficiency.
          </motion.p>
        </section>

        {/* Form Section */}
        <section className="flex flex-col lg:flex-row justify-between items-center gap-12 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
              Get Your{" "}
              <span className="text-purple-600 dark:text-purple-400">
                Perfect Space
              </span>{" "}
              Now
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Location
                </label>
                <select
                  id="location"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.location
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Select location</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                  <option value="Noida">Noida</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="workspaceType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Workspace Type
                </label>
                <select
                  id="workspaceType"
                  {...register("workspaceType", {
                    required: "Workspace type is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.workspaceType
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Select workspace type</option>
                  <option value="Private Office">Private Office</option>
                  <option value="Global Office">Global Office</option>
                  <option value="Hot Desk">Hot Desk</option>
                  <option value="Meeting Room">Meeting Room</option>
                </select>
                {errors.workspaceType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.workspaceType.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Duration Of Stay
                </label>
                <input
                  type="date"
                  id="duration"
                  {...register("duration", {
                    required: "Duration is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.duration
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md transition-all duration-300"
              >
                Find Your Space
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative overflow-hidden rounded-xl shadow-2xl aspect-video">
              <Image
                src="https://live.templately.com/wp-content/uploads/2020/09/65b84a5a-work-together-image.jpg"
                alt="Professionals working together in a modern coworking space"
                width={800}
                height={500}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold">
                  Collaborative Workspaces
                </h3>
                <p className="text-sm md:text-base">
                  Designed for productivity and creativity
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            Why Choose Us
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Our spaces are designed to help you do your best work and connect
            with amazing people.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-purple-600 dark:text-purple-400 text-3xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative min-h-[50vh] flex items-center justify-center rounded-xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7433870/pexels-photo-7433870.jpeg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative z-10 text-center p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 max-w-4xl mx-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Ready To Take A <span className="text-purple-300">New Surge</span>{" "}
              Of Creativity
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg md:text-xl mb-8 text-gray-200"
            >
              Join our vibrant community of innovators and creators in spaces
              designed to inspire.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/booknow"
                className="inline-block bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300"
              >
                Book a Space Today
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeMain;
