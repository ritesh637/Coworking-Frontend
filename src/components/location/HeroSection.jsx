// import React from "react";

// const ImageGridWithQuote = () => {
//   const images = [
//     "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", // Eiffel Tower
//     " https://images.pexels.com/photos/8111359/pexels-photo-8111359.jpeg", // Street in Paris
//     " https://images.pexels.com/photos/6248985/pexels-photo-6248985.jpeg", // Historic building
//     " https://images.unsplash.com/photo-1527689368864-3a821dbccc34", // Cityscape
//     "https://images.unsplash.com/photo-1568992687947-868a62a9f521", // Beautiful Canal
//     "https://images.pexels.com/photos/7580932/pexels-photo-7580932.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     // Modern Architecture
//   ];

//   return (
//     <div className="container mx-auto p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {images.map((src, index) => (
//           <img
//             key={index}
//             src={src}
//             alt={`Image ${index + 1}`}
//             className="w-full h-56 object-cover rounded-md shadow-md transition-transform transform hover:scale-105"
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageGridWithQuote;

"use client";

import { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { TypeAnimation } from "react-type-animation";

const HeroSection = () => {
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false); // Add mounted state to handle hydration

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // This useEffect ensures that the code runs only after the component is mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  if (!mounted) {
    return null; // Prevent server-client mismatch during initial render
  }

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[800px] flex items-center justify-center text-center overflow-hidden"
    >
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage:
            "url('https://www.603thecoworkingspace.com/officeimg/Pentagon/pentagon.JPG')",
          y: yBg,
          scale: 1.1,
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/80 to-indigo-900/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </motion.div>

      {/* Floating particles (conditionally rendered after mounting) */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, (Math.random() - 0.5) * 50],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 px-6 sm:px-8 lg:px-10 w-full max-w-7xl mx-auto"
        style={{ y: yText, opacity: textOpacity }}
      >
        <motion.div
          className="space-y-6 sm:space-y-8 md:space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            variants={itemVariants}
          >
            <span className="block mb-4">Discover Our</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-red-400 to-orange-400">
              <TypeAnimation
                sequence={[
                  "Premium Locations",
                  2000,
                  "Creative Spaces",
                  2000,
                  "Productive Offices",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl md:text-3xl text-white/90 max-w-3xl mx-auto font-medium"
            variants={itemVariants}
          >
            Beautifully designed workspaces that inspire{" "}
            <span className="text-orange-300">creativity</span> and{" "}
            <span className="text-blue-300">productivity</span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            variants={itemVariants}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <button className="relative group bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-4 px-10 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-3">
                <motion.span
                  animate={{ x: isHovering ? 5 : 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  Explore Spaces
                </motion.span>
                <motion.div
                  animate={{
                    x: isHovering ? 10 : 0,
                    rotate: isHovering ? -45 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <FiArrowRight className="text-xl" />
                </motion.div>
              </span>

              {/* Particles on hover */}
              <AnimatePresence>
                {isHovering &&
                  [...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute rounded-full bg-white"
                      initial={{
                        x: `${Math.random() * 100 - 50}%`,
                        y: `${Math.random() * 100 - 50}%`,
                        width: "2px",
                        height: "2px",
                        opacity: 0,
                      }}
                      animate={{
                        x: `${Math.random() * 200 - 100}%`,
                        y: `${Math.random() * 200 - 100}%`,
                        opacity: [0.8, 0],
                        width: "4px",
                        height: "4px",
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                      }}
                    />
                  ))}
              </AnimatePresence>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="flex flex-col items-center">
          <motion.span
            className="text-sm text-white/80 mb-3"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to explore
          </motion.span>
          <div className="w-10 h-16 border-2 border-white/50 rounded-full flex justify-center relative">
            <motion.div
              className="w-1 h-4 bg-white rounded-full mt-3"
              animate={{ y: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent backdrop-blur-sm py-6 px-8 z-10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
          {[
            {
              label: "Global Locations",
              value: "20+",
              gradient: "from-pink-400 to-orange-400",
            },
            {
              label: "Member Satisfaction",
              value: "98%",
              gradient: "from-blue-400 to-cyan-500",
            },
            {
              label: "Offices Booked",
              value: "1200+",
              gradient: "from-green-400 to-teal-500",
            },
            {
              label: "Workspaces",
              value: "5000+",
              gradient: "from-purple-400 to-indigo-500",
            },
          ].map((stat, idx) => (
            <div key={idx} className="text-center space-y-2">
              <motion.div
                className={`text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient}`}
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
