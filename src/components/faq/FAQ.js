"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    question: "What are your operating hours?",
    answer:
      "Our co-working space is open 24/7 for members with access cards. Guests can visit from 9 AM to 7 PM on weekdays.",
  },
  {
    question: "Do you offer day passes?",
    answer:
      "Yes, we offer flexible day passes for those who need a workspace for a short duration.",
  },
  {
    question: "Are meeting rooms available?",
    answer:
      "Yes, we have fully equipped meeting rooms available for booking. Members get discounted rates.",
  },
  {
    question: "Is there high-speed internet?",
    answer:
      "Absolutely! We provide high-speed Wi-Fi and ethernet connections for seamless work.",
  },
  {
    question: "Can I bring my pet?",
    answer:
      "Currently, we do not allow pets in the workspace to maintain a comfortable environment for all.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left text-lg sm:text-xl font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                {faq.question}
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-6 pb-5"
                  >
                    <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
