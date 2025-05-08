import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-12 shadow-inner">
      <div className="container mx-auto px-6 max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          {/* Logo & Socials */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <img
              src="https://live.templately.com/wp-content/uploads/2020/09/5b956696-spacehub_.png"
              alt="Space Hub Logo"
              className="w-40 mb-4 hover:scale-110 transition-transform duration-300"
            />
            <p className="text-gray-600 text-xs text-center md:text-left">
              𝗘𝘅𝗽𝗹𝗼𝗿𝗲 𝘁𝗵𝗲 𝗳𝘂𝘁𝘂𝗿𝗲 𝗼𝗳 𝗶𝗻𝗻𝗼𝘃𝗮𝘁𝗶𝗼𝗻 𝘄𝗶𝘁𝗵 𝗦𝗽𝗮𝗰𝗲 𝗛𝘂𝗯.
            </p>
            <div className="flex space-x-3 mt-5 justify-center md:justify-start">
              {[
                { icon: <Facebook size={20} />, href: "#" },
                { icon: <Twitter size={20} />, href: "#" },
                { icon: <Instagram size={20} />, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {[
            {
              title: "Qᴜɪᴄᴋ ʟɪɴᴋꜱ",
              links: [
                { name: "ʜᴏᴍᴇ", href: "/" },
                { name: "ᴀʙᴏᴜᴛ", href: "/about" },
                { name: "ᴡᴏʀᴋꜱᴘᴀᴄᴇ", href: "/about" },
              ],
            },
            {
              title: "ꜱᴜᴘᴘᴏʀᴛ",
              links: [
                { name: "ꜰᴀQ", href: "/faq" },
                { name: "ᴘʀɪᴠᴀᴄʏ ᴘᴏʟɪᴄʏ", href: "/privacy" },
                { name: "ᴛᴇʀᴍꜱ & ᴄᴏɴᴅɪᴛɪᴏɴꜱ", href: "/term" },
              ],
            },
            {
              title: "ᴄᴏɴᴛᴀᴄᴛ",
              links: [
                { name: "+91 7707076831", href: "tel:7707076831" },
                { name: "ᴍɴᴇꜱʜᴋ480@ɢᴍᴀɪʟ.ᴄᴏᴍ", href: "mailto:ᴍɴᴇꜱʜᴋ480@ɢᴍᴀɪʟ.ᴄᴏᴍ" },
                {
                  name: "1907 - 1910  ᴋᴀᴍᴅʜᴇɴᴜ ᴄᴏᴍᴍᴇʀᴢ, ꜱᴇᴄᴛᴏʀ 14 ᴋʜᴀʀɢʜᴀʀ, ɴᴀᴠɪ ᴍᴜᴍʙᴀɪ",
                  href: "",
                },
              ],
            },
          ].map((section, index) => (
            <div key={index} className="md:col-span-1 text-center md:text-left">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b-2 border-purple-600 pb-2 inline-block">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href}>
                      <span className="text-gray-700 hover:text-purple-600 hover:underline transition-all cursor-pointer">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-4 text-center text-xs text-black">
          <p>© 2025 ꜱᴘᴀᴄᴇ ʜᴜʙ. ᴀʟʟ ʀɪɢʜᴛꜱ ʀᴇꜱᴇʀᴠᴇᴅ.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
