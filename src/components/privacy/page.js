import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="text-gray-800 dark:text-gray-100">
      {/* Header Section */}
      <div
        className="h-[300px] md:h-[400px] flex items-center justify-center text-white text-center relative"
        style={{
          backgroundImage:
            "url('https://www.goodworks.in/wp-content/uploads/2023/11/people-social-distancing-work_11zon-1536x1059.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="z-10">
          <h1 className="text-3xl md:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-lg mt-2">Please read it carefully</p>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="space-y-8">
          {[
            {
              title: "1. Information We Collect",
              description:
                "We collect personal information such as name, email, phone number, and payment details.",
            },
            {
              title: "2. How We Use Your Information",
              description:
                "We use your data to provide and improve our services, ensure security, and communicate updates.",
            },
            {
              title: "3. Sharing of Information",
              description:
                "We do not sell your data. We may share information with trusted partners for service improvement.",
            },
            {
              title: "4. Security Measures",
              description:
                "We take strong security measures to protect your information from unauthorized access.",
            },
            {
              title: "5. Policy Updates",
              description:
                "We may update this policy periodically. Any changes will be posted on our website.",
            },
          ].map((item, index) => (
            <div key={index} className="group">
              <h2 className="text-xl md:text-2xl font-semibold group-hover:text-blue-600 transition-all duration-300">
                {item.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 group-hover:translate-x-1 transition-all duration-300 mt-1">
                {item.description}
              </p>
            </div>
          ))}
        </section>

        {/* Contact Info */}
        <div className="mt-12 bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            If you have any questions, feel free to reach out to us.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600" />
              <div>
                <p className="font-semibold">Office Address</p>
                <p className="text-sm">
                  1910, Kamdhenu Commerz, next to Raghunath Vihar, Block-J,
                  Sector14, Kharghar, Navi Mumbai, 410210
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-green-600" />
              <div>
                <p className="font-semibold">Contact Number</p>
                <p className="text-sm">+91 7707076831</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-red-500" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-blue-600">support@yourdomain.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
