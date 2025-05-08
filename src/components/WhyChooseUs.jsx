"use client";

import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const features = [
  {
    title: "ᴅɪꜱᴛʀᴀᴄᴛɪᴏɴ-ꜰʀᴇᴇ ꜱᴘᴀᴄᴇꜱ",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/e9de1221-working.png",
    description:
      "ᴄʀᴇᴀᴛᴇ ɪɴ Qᴜɪᴇᴛ, ᴄʟᴜᴛᴛᴇʀ-ꜰʀᴇᴇ ᴇɴᴠɪʀᴏɴᴍᴇɴᴛꜱ ᴅᴇꜱɪɢɴᴇᴅ ᴛᴏ ʙᴏᴏꜱᴛ ꜰᴏᴄᴜꜱ.",
  },
  {
    title: "ꜱᴜᴘᴇʀ ꜰᴀꜱᴛ ɪɴᴛᴇʀɴᴇᴛ",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/c0e007d1-wifi.png",
    description: "ᴇɴᴊᴏʏ ʟɪɢʜᴛɴɪɴɢ-ꜰᴀꜱᴛ ɪɴᴛᴇʀɴᴇᴛ ᴛᴏ ᴘᴏᴡᴇʀ ʏᴏᴜʀ ᴘʀᴏᴅᴜᴄᴛɪᴠɪᴛʏ.",
  },
  {
    title: "ᴄᴏᴍᴍᴜɴɪᴛʏ ᴇᴠᴇɴᴛꜱ",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/eb5cabd0-calendar.png",
    description: "ᴄᴏɴɴᴇᴄᴛ ᴀɴᴅ ɢʀᴏᴡ ᴡɪᴛʜ ʟɪᴋᴇ-ᴍɪɴᴅᴇᴅ ᴘʀᴏꜰᴇꜱꜱɪᴏɴᴀʟꜱ.",
  },
  {
    title: "24/7 ʙᴜɪʟᴅɪɴɢ ᴀᴄᴄᴇꜱꜱ",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/fce9e799-delivery.png",
    description: "ᴡᴏʀᴋ ᴏɴ ʏᴏᴜʀ ꜱᴄʜᴇᴅᴜʟᴇ ᴡɪᴛʜ ʀᴏᴜɴᴅ-ᴛʜᴇ-ᴄʟᴏᴄᴋ ᴀᴄᴄᴇꜱꜱ.",
  },
  {
    title: "ꜱᴇᴄᴜʀᴇᴅ ᴡᴏʀᴋꜱᴘᴀᴄᴇ",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/8d706cf2-smart-lock-1.png",
    description: "ꜱᴛᴀʏ ꜱᴀꜰᴇ ᴡɪᴛʜ ᴛᴏᴘ-ᴛɪᴇʀ ꜱᴇᴄᴜʀɪᴛʏ ꜱʏꜱᴛᴇᴍꜱ ɪɴ ᴘʟᴀᴄᴇ.",
  },
  {
    title: "ᴅᴀɪʟʏ ᴄʟᴇᴀɴɪɴɢ",
    image:
      "https://live.templately.com/wp-content/uploads/2020/09/4f6e73eb-broom.png",
    description: "ᴀ ꜱᴘᴏᴛʟᴇꜱꜱ ꜱᴘᴀᴄᴇ ᴛᴏ ᴡᴏʀᴋ ᴇᴠᴇʀʏ ꜱɪɴɢʟᴇ ᴅᴀʏ.",
  },
];

const FeatureCard = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });
  const animation = useAnimation();

  useEffect(() => {
    if (isInView) {
      animation.start({
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          damping: 10,
          stiffness: 100,
          delay: index * 0.1,
        },
      });
    }
  }, [isInView, animation, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={animation}
      whileTap={{ scale: 0.95 }}
      className="group p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 active:scale-[0.98] hover:scale-[1.02] hover:bg-purple-600 dark:hover:bg-purple-700 hover:text-white dark:hover:text-white"
    >
      <div className="flex justify-center mb-4 sm:mb-6">
        <img
          src={feature.image}
          alt={feature.title}
          className="w-14 h-14 sm:w-16 sm:h-16 group-hover:rotate-12 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold mb-2 dark:text-white group-hover:text-white">
        {feature.title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 group-hover:text-white/90 dark:text-gray-300 dark:group-hover:text-white/90 transition-colors duration-300">
        {feature.description}
      </p>
    </motion.div>
  );
};

const WhyChooseUs = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center mb-10 sm:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-3 sm:mb-4"
        >
          ᴡʜʏ ᴄʜᴏᴏꜱᴇ ᴜꜱ
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto text-gray-700 dark:text-gray-300 text-base sm:text-lg px-2"
        >
          ᴅɪꜱᴄᴏᴠᴇʀ ᴛʜᴇ ꜰᴇᴀᴛᴜʀᴇꜱ ᴛʜᴀᴛ ᴍᴀᴋᴇ ᴜꜱ ꜱᴛᴀɴᴅ ᴏᴜᴛ ꜰʀᴏᴍ ᴛʜᴇ ʀᴇꜱᴛ.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
