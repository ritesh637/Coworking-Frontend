"use client";

import { useEffect, useState } from "react";

const HeroSection = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center text-center underline text-red-900 overflow-hidden">
      {}
      <div
        className="absolute inset-15 bg-cover bg-center transition-transform duration-50"
        style={{
          backgroundImage:
            "url('https://www.603thecoworkingspace.com/officeimg/Pentagon/pentagon.JPG')",
          transform: `translateY(${offset * 0.5}px)`,
        }}
      ></div>

      <div className="relative z-10">
        <h1 className="text-5xl font-bold">𝖣𝗂𝗌𝖼𝗈𝗏𝖾𝗋 𝖮𝗎𝗋 𝖫𝗈𝖼𝖺𝗍𝗂𝗈𝗇𝗌</h1>
        <p className="text-lg mt-4">𝖢𝗁𝗈𝗈𝗌𝖾 𝖺 𝗐𝗈𝗋𝗄𝗌𝗉𝖺𝖼𝖾!</p>
      </div>
    </div>
  );
};

export default HeroSection;
