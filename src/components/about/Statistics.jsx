import React from "react";
import { Users, Briefcase, Landmark, Flag } from "lucide-react";

const statisticsData = [
  {
    icon: <Users size={36} className="text-purple-600" />,
    value: "500+",
    label: "ᴍᴇᴇᴛɪɴɢ ʀᴏᴏᴍꜱ",
  },
  {
    icon: <Briefcase size={36} className="text-purple-600" />,
    value: "5,000",
    label: "ꜱᴛᴀʀᴛᴜᴘ ᴍᴇɴᴛᴏʀꜱ",
  },
  {
    icon: <Landmark size={36} className="text-purple-600" />,
    value: "100+",
    label: "ᴇᴠᴇɴᴛ ꜱᴘᴀᴄᴇꜱ",
  },
  {
    icon: <Flag size={36} className="text-purple-600" />,
    value: "36+",
    label: "ᴄᴏᴜɴᴛʀɪᴇꜱ",
  },
];

const Statistics = () => {
  return (
    <div className="bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statisticsData.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:scale-105"
          >
            {stat.icon}
            <div>
              <span className="text-black font-bold text-xl">{stat.value}</span>
              <p className="text-gray-700 text-sm mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
