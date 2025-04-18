"use client";

import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const quotes = ["ʟᴇᴛ’ꜱ ʙᴜɪʟᴅ ꜱᴏᴍᴇᴛʜɪɴɢ ᴀᴍᴀᴢɪɴɢ ᴛᴏɢᴇᴛʜᴇʀ"];

const ContactForm = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        }); // Clear form after submission
      } else {
        alert("Failed to submit form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
      {/* Section Heading */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
        ɢᴇᴛ ɪɴ ᴛᴏᴜᴄʜ
      </h2>
      <p className="text-lg text-center opacity-90 max-w-lg mb-6">
        "{quotes[quoteIndex]}"
      </p>

      {/* Contact Form */}
      <div className="bg-white text-gray-900 shadow-xl rounded-xl p-6 md:p-8 w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="ꜰɪʀꜱᴛ ɴᴀᴍᴇ"
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="ʟᴀꜱᴛ ɴᴀᴍᴇ"
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ᴇᴍᴀɪʟ ᴀᴅᴅʀᴇꜱꜱ"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="ꜱᴜʙᴊᴇᴄᴛ"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ"
            rows="4"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md hover:bg-purple-700 transition-transform duration-300 hover:scale-105"
          >
            ꜱᴜʙᴍɪᴛ ꜰᴏʀᴍ
          </button>
        </form>
      </div>

      {/* Contact Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 w-full max-w-4xl">
        {[
          {
            icon: <MapPin size={24} className="text-purple-600" />,
            title: "Address",
            info: "350 Fifth Avenue, 34th floor, New York City",
          },
          {
            icon: <Mail size={24} className="text-purple-600" />,
            title: "Email",
            info: "customer.support@gmail.com",
          },
          {
            icon: <Phone size={24} className="text-purple-600" />,
            title: "Call Us",
            info: "+987 654 3210 OR +012 345 6789",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white p-5 rounded-lg shadow-md text-gray-900 transform transition duration-300 hover:scale-105"
          >
            {item.icon}
            <div>
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.info}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactForm;
