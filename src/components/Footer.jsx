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
              Explore the future of innovation with Space Hub.
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
              title: "Quick Links",
              links: [
                { name: "Home", href: "/" },
                { name: "About", href: "/about" },
                { name: "Workspace", href: "/workspace" },
              ],
            },
            {
              title: "Support",
              links: [
                { name: "FAQ", href: "/faq" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms & Conditions", href: "/term" },
              ],
            },
            {
              title: "Contact",
              links: [
                { name: "987 654 3210", href: "tel:9876543210" },
                { name: "info@spacehub.com", href: "mailto:info@spacehub.com" },
                {
                  name: "1910, Kamdhenu Commerz, Sector 14, Kharghar, Navi Mumbai",
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
        <div className="border-t border-gray-200 mt-12 pt-4 text-center text-xs text-gray-500">
          <p>© 2025 Space Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
