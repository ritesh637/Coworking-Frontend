"use client"; // Ensures it runs on the client side

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    text: "I have been using SpaceHub for a month now and I can't fault it. It's in a great location and the broadband is super fast. There is free tea, coffee, and refreshments. The meeting room is a perfect size and easy to book. I would highly recommend.",
    name: "Mario Speedwagon",
    position: "Senior Art Director",
  },
  {
    text: "Amazing coworking space with a vibrant community. The atmosphere is great for productivity, and the internet speed is top-notch!",
    name: "Sarah Johnson",
    position: "Freelance Designer",
  },
  {
    text: "SpaceHub has been a game changer for me. The facilities are modern, and the networking opportunities are fantastic!",
    name: "John Doe",
    position: "Startup Founder",
  },
];

const Testimonial = () => {
  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          What Our Clients Say
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
