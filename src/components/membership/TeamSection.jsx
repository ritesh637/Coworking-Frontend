"use client";
import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaUserTie,
} from "react-icons/fa";

const teamMembers = [
  {
    id: 1,
    name: "ꜱᴏᴘʜɪᴀ ᴀɴᴅᴇʀꜱᴏɴ",
    position: "ᴄᴇᴏ & ꜰᴏᴜɴᴅᴇʀ",
    image:
      "https://demo2.wpopal.com/co-workshop/wp-content/uploads/2018/11/bannercw1-2.jpg",
    facebook: "#",
    twitter: "#",
    linkedin: "#",
  },
  {
    id: 2,
    name: "ᴊᴀᴍᴇꜱ ᴄᴀʀᴛᴇʀ",
    position: "ᴄᴛᴏ",
    image:
      "https://demo2.wpopal.com/co-workshop/wp-content/uploads/2018/11/h6-g1.jpg",
    facebook: "#",
    twitter: "#",
    linkedin: "#",
  },
  {
    id: 3,
    name: "ᴇᴍᴍᴀ ʀᴏʙᴇʀᴛꜱ",
    position: "ᴍᴀʀᴋᴇᴛɪɴɢ ᴅɪʀᴇᴄᴛᴏʀ",
    image:
      "http://hub2b.like-themes.com/wp-content/uploads/2018/02/gallery_09.jpg",
    facebook: "#",
    twitter: "#",
    linkedin: "#",
  },
  {
    id: 4,
    name: "ᴅᴀɴɪᴇʟ ᴡʜɪᴛᴇ",
    position: "ʟᴇᴀᴅ ᴅᴇᴠᴇʟᴏᴘᴇʀ",
    image:
      "https://kits.krakenbox.net/brisk/wp-content/uploads/sites/4/2025/01/millennial-male-and-female-colleagues-with-digital-5JLN5UC.jpg",
    facebook: "#",
    twitter: "#",
    linkedin: "#",
  },
];

const TeamMember = ({ member }) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  return (
    <div
      key={member.id}
      className="group bg-purple-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-600/20"
    >
      <div className="relative overflow-hidden h-72">
        {!imageError ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleError}
          />
        ) : (
          <div className="w-full h-full bg-purple-700 flex flex-col items-center justify-center">
            <FaUserTie className="text-6xl text-purple-300" />
            <span className="mt-4 text-purple-200">{member.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-transparent to-transparent flex items-end p-6">
          <div>
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-purple-300 text-sm">{member.position}</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-purple-900/30">
        <div className="flex justify-center space-x-4">
          <a
            href={member.facebook}
            className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white hover:bg-blue-600 transition-colors duration-300"
            aria-label={`${member.name}'s Facebook`}
          >
            <FaFacebookF className="text-sm" />
          </a>
          <a
            href={member.twitter}
            className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white hover:bg-blue-400 transition-colors duration-300"
            aria-label={`${member.name}'s Twitter`}
          >
            <FaTwitter className="text-sm" />
          </a>
          <a
            href={member.linkedin}
            className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-300"
            aria-label={`${member.name}'s LinkedIn`}
          >
            <FaLinkedinIn className="text-sm" />
          </a>
        </div>
      </div>
    </div>
  );
};

const TeamSection = () => {
  return (
    <section className="bg-gradient-to-b from-purple-700 to-purple-900 text-white py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-200 bg-purple-800 rounded-full mb-4">
            ᴏᴜʀ ᴛᴇᴀᴍ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ᴍᴇᴇᴛ ᴏᴜʀ ᴇxᴘᴇʀᴛ <span className="text-green-300">ᴘʀᴏꜰᴇꜱꜱɪᴏɴᴀʟ</span>{" "}
            ᴛᴇᴀᴍ
          </h2>
          <p className="max-w-2xl mx-auto text-purple-200">
            ᴏᴜʀ ᴛᴇᴀᴍ ᴏꜰ ᴇxᴘᴇʀɪᴇɴᴄᴇᴅ ᴘʀᴏꜰᴇꜱꜱɪᴏɴᴀʟꜱ ɪꜱ ᴅᴇᴅɪᴄᴀᴛᴇᴅ ᴛᴏ ᴅᴇʟɪᴠᴇʀɪɴɢ
            ᴇxᴄᴇᴘᴛɪᴏɴᴀʟ ʀᴇꜱᴜʟᴛꜱ ꜰᴏʀ ʏᴏᴜʀ ʙᴜꜱɪɴᴇꜱꜱ.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30">
          ᴠɪᴇᴡ ᴀʟʟ ᴛᴇᴀᴍ ᴍᴇᴍʙᴇʀꜱ
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
