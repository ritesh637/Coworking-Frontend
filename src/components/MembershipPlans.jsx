"use client";

import React, { useState, useEffect } from "react";

const quotes = [
  "Join Our Membership",
  "Unlock Your Productivity With Us",
  "Your Workspace, Your Rules",
  "Affordable Plans, Premium Experience",
];

const plans = [
  {
    name: "Starter Plan",
    price: "$250.99",
    features: [
      "1 day/mo included",
      "1 h/mo Conference Rooms",
      "High Speed Internet",
      "Access to Professional Network",
    ],
    badge: "Starter",
    highlight: false,
  },
  {
    name: "Basic Plan",
    price: "$300.99",
    features: [
      "5 days/mo included",
      "3 h/mo Conference Rooms",
      "High Speed Internet",
      "Access to Networking Events",
    ],
    badge: "Popular",
    highlight: true,
  },
  {
    name: "Standard Plan",
    price: "$500.99",
    features: [
      "10 days/mo included",
      "5 h/mo Conference Rooms",
      "24/7 Access",
      "Premium Lounge Access",
    ],
    badge: "Best Value",
    highlight: true,
  },
  {
    name: "Professional Plan",
    price: "$900.99",
    features: [
      "Unlimited Access",
      "10 h/mo Conference Rooms",
      "24/7 Access",
      "Exclusive Business Support",
    ],
    badge: "Pro",
    highlight: false,
  },
];

const PricingPlans = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-100 text-gray-900">
      {/* Animated Quote */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 transition-opacity duration-700">
        {quotes[quoteIndex]}
      </h2>
      <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
        Choose the plan that fits your business and work style.
      </p>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white p-8 rounded-2xl shadow-lg text-center transition-transform duration-300 transform hover:-translate-y-2 ${
              plan.highlight
                ? "border-t-4 border-purple-600 shadow-xl scale-105"
                : "border-t-4 border-gray-200"
            }`}
          >
            {plan.badge && (
              <span
                className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${
                  plan.highlight
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {plan.badge}
              </span>
            )}

            <h3 className="text-2xl font-semibold mb-3 text-gray-800">
              {plan.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">Perfect for teams</p>

            <ul className="text-gray-700 text-left space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="text-green-500 text-lg font-bold">✔</span>
                  <span className="ml-3">{feature}</span>
                </li>
              ))}
            </ul>

            <p className="text-3xl font-extrabold text-purple-600 mb-6">
              {plan.price}
            </p>

            <button
              onClick={() => (window.location.href = "/booknow")}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-transform duration-300 hover:scale-105"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingPlans;
