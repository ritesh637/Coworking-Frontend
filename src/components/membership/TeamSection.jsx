import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const teamMembers = [
  {
    id: 1,
    name: "Sophia Anderson",
    image:
      "https://kits.krakenbox.net/brisk/wp-content/uploads/sites/4/2025/01/millennial-male-and-female-colleagues-with-digital-5JLN5UC.jpg", // Replace with actual image path
    facebook: "#",
    twitter: "#",
    linkedin: "#",
  },
  {
    id: 2,
    name: "James Carter",
    image:
      "https://demo2.wpopal.com/co-workshop/wp-content/uploads/2018/11/h6-g1.jpg",
    facebook: "#",
    twitter: "#",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Emma Roberts",
    image:
      "http://hub2b.like-themes.com/wp-content/uploads/2018/02/gallery_09.jpg",
    facebook: "#",
    twitter: "#",
    linkedin: "#",
  },
  {
    id: 4,
    name: "Daniel White",
    image:
      "https://demo2.wpopal.com/co-workshop/wp-content/uploads/2018/11/bannercw1-2.jpg",
    facebook: "#",
    twitter: "#",
    linkedin: "#",
  },
];

const TeamSection = () => {
  return (
    <section className="bg-purple-600 text-white py-16">
      <div className="container mx-auto text-center">
        <h3 className="text-lg font-semibold uppercase tracking-wider text-green-300"></h3>
        <h2 className="text-4xl font-bold mt-2 mb-8">
          Meet Our Expert Professional Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-purple-800 p-4 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-60 object-cover rounded-xl"
              />
              <h3 className="mt-4 text-xl font-semibold">{member.name}</h3>

              {/* Social Media Links */}
              <div className="mt-3 flex justify-center gap-4">
                <a
                  href={member.facebook}
                  className="text-white text-lg hover:text-blue-400 transition"
                >
                  <FaFacebookF />
                </a>
                <a
                  href={member.twitter}
                  className="text-white text-lg hover:text-blue-300 transition"
                >
                  <FaTwitter />
                </a>
                <a
                  href={member.linkedin}
                  className="text-white text-lg hover:text-blue-500 transition"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
