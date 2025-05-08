"use client"; // Ensures it runs on the client side

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    text: "ɪ ʜᴀᴠᴇ ʙᴇᴇɴ ᴜꜱɪɴɢ ꜱᴘᴀᴄᴇʜᴜʙ ꜰᴏʀ ᴀ ᴍᴏɴᴛʜ ɴᴏᴡ ᴀɴᴅ ɪ ᴄᴀɴ'ᴛ ꜰᴀᴜʟᴛ ɪᴛ. ɪᴛ'ꜱ ɪɴ ᴀ ɢʀᴇᴀᴛ ʟᴏᴄᴀᴛɪᴏɴ ᴀɴᴅ ᴛʜᴇ ʙʀᴏᴀᴅʙᴀɴᴅ ɪꜱ ꜱᴜᴘᴇʀ ꜰᴀꜱᴛ. ᴛʜᴇʀᴇ ɪꜱ ꜰʀᴇᴇ ᴛᴇᴀ, ᴄᴏꜰꜰᴇᴇ, ᴀɴᴅ ʀᴇꜰʀᴇꜱʜᴍᴇɴᴛꜱ. ᴛʜᴇ ᴍᴇᴇᴛɪɴɢ ʀᴏᴏᴍ ɪꜱ ᴀ ᴘᴇʀꜰᴇᴄᴛ ꜱɪᴢᴇ ᴀɴᴅ ᴇᴀꜱʏ ᴛᴏ ʙᴏᴏᴋ. ɪ ᴡᴏᴜʟᴅ ʜɪɢʜʟʏ ʀᴇᴄᴏᴍᴍᴇɴᴅ.",
    name: "ᴍᴀʀɪᴏ ꜱᴘᴇᴇᴅᴡᴀɢᴏɴ",
    position: "ꜱᴇɴɪᴏʀ ᴀʀᴛ ᴅɪʀᴇᴄᴛᴏʀ",
  },
  {
    text: "ᴀᴍᴀᴢɪɴɢ ᴄᴏᴡᴏʀᴋɪɴɢ ꜱᴘᴀᴄᴇ ᴡɪᴛʜ ᴀ ᴠɪʙʀᴀɴᴛ ᴄᴏᴍᴍᴜɴɪᴛʏ. ᴛʜᴇ ᴀᴛᴍᴏꜱᴘʜᴇʀᴇ ɪꜱ ɢʀᴇᴀᴛ ꜰᴏʀ ᴘʀᴏᴅᴜᴄᴛɪᴠɪᴛʏ, ᴀɴᴅ ᴛʜᴇ ɪɴᴛᴇʀɴᴇᴛ ꜱᴘᴇᴇᴅ ɪꜱ ᴛᴏᴘ-ɴᴏᴛᴄʜ!",
    name: "ꜱᴀʀᴀʜ ᴊᴏʜɴꜱᴏɴ",
    position: "ꜰʀᴇᴇʟᴀɴᴄᴇ ᴅᴇꜱɪɢɴᴇʀ",
  },
  {
    text: "ꜱᴘᴀᴄᴇʜᴜʙ ʜᴀꜱ ʙᴇᴇɴ ᴀ ɢᴀᴍᴇ ᴄʜᴀɴɢᴇʀ ꜰᴏʀ ᴍᴇ. ᴛʜᴇ ꜰᴀᴄɪʟɪᴛɪᴇꜱ ᴀʀᴇ ᴍᴏᴅᴇʀɴ, ᴀɴᴅ ᴛʜᴇ ɴᴇᴛᴡᴏʀᴋɪɴɢ ᴏᴘᴘᴏʀᴛᴜɴɪᴛɪᴇꜱ ᴀʀᴇ ꜰᴀɴᴛᴀꜱᴛɪᴄ!",
    name: "ᴊᴏʜɴ ᴅᴏᴇ",
    position: "ꜱᴛᴀʀᴛᴜᴘ ꜰᴏᴜɴᴅᴇʀ",
  },
];

const Testimonial = () => {
  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
        ᴡʜᴀᴛ ᴏᴜʀ ᴄʟɪᴇɴᴛꜱ ꜱᴀʏ
        </h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="relative"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white shadow-lg rounded-lg p-2 text-center">
                <p className="text-gray-600 text-lg italic">
                  "{testimonial.text}"
                </p>
                <div className="mt-4">
                  <span className="text-yellow-500 text-2xl">★★★★★</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mt-3">
                  {testimonial.name}
                </h3>
                <p className="text-gray-500 text-sm">{testimonial.position}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonial;
