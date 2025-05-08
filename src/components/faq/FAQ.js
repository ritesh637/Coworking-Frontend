"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    question: "ᴡʜᴀᴛ ᴀʀᴇ ʏᴏᴜʀ ᴏᴘᴇʀᴀᴛɪɴɢ ʜᴏᴜʀꜱ?",
    answer:
      "ᴏᴜʀ ᴄᴏ-ᴡᴏʀᴋɪɴɢ ꜱᴘᴀᴄᴇ ɪꜱ ᴏᴘᴇɴ 24/7 ꜰᴏʀ ᴍᴇᴍʙᴇʀꜱ ᴡɪᴛʜ ᴀᴄᴄᴇꜱꜱ ᴄᴀʀᴅꜱ. ɢᴜᴇꜱᴛꜱ ᴄᴀɴ ᴠɪꜱɪᴛ ꜰʀᴏᴍ 9 ᴀᴍ ᴛᴏ 7 ᴘᴍ ᴏɴ ᴡᴇᴇᴋᴅᴀʏꜱ.",
  },
  {
    question: "ᴅᴏ ʏᴏᴜ ᴏꜰꜰᴇʀ ᴅᴀʏ ᴘᴀꜱꜱᴇꜱ?",
    answer:
      "ʏᴇꜱ, ᴡᴇ ᴏꜰꜰᴇʀ ꜰʟᴇxɪʙʟᴇ ᴅᴀʏ ᴘᴀꜱꜱᴇꜱ ꜰᴏʀ ᴛʜᴏꜱᴇ ᴡʜᴏ ɴᴇᴇᴅ ᴀ ᴡᴏʀᴋꜱᴘᴀᴄᴇ ꜰᴏʀ ᴀ ꜱʜᴏʀᴛ ᴅᴜʀᴀᴛɪᴏɴ.",
  },
  {
    question: "ᴀʀᴇ ᴍᴇᴇᴛɪɴɢ ʀᴏᴏᴍꜱ ᴀᴠᴀɪʟᴀʙʟᴇ?",
    answer:
      "ʏᴇꜱ, ᴡᴇ ʜᴀᴠᴇ ꜰᴜʟʟʏ ᴇQᴜɪᴘᴘᴇᴅ ᴍᴇᴇᴛɪɴɢ ʀᴏᴏᴍꜱ ᴀᴠᴀɪʟᴀʙʟᴇ ꜰᴏʀ ʙᴏᴏᴋɪɴɢ. ᴍᴇᴍʙᴇʀꜱ ɢᴇᴛ ᴅɪꜱᴄᴏᴜɴᴛᴇᴅ ʀᴀᴛᴇꜱ.",
  },
  {
    question: "ɪꜱ ᴛʜᴇʀᴇ ʜɪɢʜ-ꜱᴘᴇᴇᴅ ɪɴᴛᴇʀɴᴇᴛ?",
    answer:
      "ᴀʙꜱᴏʟᴜᴛᴇʟʏ! ᴡᴇ ᴘʀᴏᴠɪᴅᴇ ʜɪɢʜ-ꜱᴘᴇᴇᴅ ᴡɪ-ꜰɪ ᴀɴᴅ ᴇᴛʜᴇʀɴᴇᴛ ᴄᴏɴɴᴇᴄᴛɪᴏɴꜱ ꜰᴏʀ ꜱᴇᴀᴍʟᴇꜱꜱ ᴡᴏʀᴋ.",
  },
  {
    question: "ᴄᴀɴ ɪ ʙʀɪɴɢ ᴍʏ ᴘᴇᴛ?",
    answer:
      "ᴄᴜʀʀᴇɴᴛʟʏ, ᴡᴇ ᴅᴏ ɴᴏᴛ ᴀʟʟᴏᴡ ᴘᴇᴛꜱ ɪɴ ᴛʜᴇ ᴡᴏʀᴋꜱᴘᴀᴄᴇ ᴛᴏ ᴍᴀɪɴᴛᴀɪɴ ᴀ ᴄᴏᴍꜰᴏʀᴛᴀʙʟᴇ ᴇɴᴠɪʀᴏɴᴍᴇɴᴛ ꜰᴏʀ ᴀʟʟ.",
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
        ꜰʀᴇQᴜᴇɴᴛʟʏ ᴀꜱᴋᴇᴅ Qᴜᴇꜱᴛɪᴏɴꜱ
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
