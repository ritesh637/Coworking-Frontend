
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "Join Our Membership",
  "Unlock Your Productivity With Us",
  "Your Workspace, Your Rules",
  "Affordable Plans, Premium Experience",
];

const PricingPlans = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/pricing-plans");
        const data = await res.json();
        setPlans(data);
      } catch (error) {
        console.error("Failed to fetch pricing plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Animated Quote */}
      <div className="mb-8 text-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={quoteIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white"
          >
            {quotes[quoteIndex]}
          </motion.h2>
        </AnimatePresence>
        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Choose the plan that fits your business and work style.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading plans...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className={`relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md dark:shadow-xl transition-all duration-300 border ${
                plan.highlight
                  ? "border-purple-600 shadow-lg"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {plan.badge && (
                <span
                  className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${
                    plan.highlight
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {plan.badge}
                </span>
              )}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Perfect for teams
              </p>
              <ul className="text-gray-700 dark:text-gray-300 space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-500 font-bold">✔</span>
                    <span className="ml-2">{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-2xl font-extrabold text-purple-600 mb-6">
                {plan.price}
              </p>
              <button
                onClick={() => (window.location.href = "/booknow")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-transform duration-300 hover:scale-105"
              >
                Book Now
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PricingPlans;
