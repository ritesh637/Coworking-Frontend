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
          <h1 className="text-3xl md:text-5xl font-bold">ᴘʀɪᴠᴀᴄʏ ᴘᴏʟɪᴄʏ</h1>
          <p className="text-lg mt-2">ᴘʟᴇᴀꜱᴇ ʀᴇᴀᴅ ɪᴛ ᴄᴀʀᴇꜰᴜʟʟʏ</p>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="space-y-8">
          {[
            {
              title: "1. ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ ᴡᴇ ᴄᴏʟʟᴇᴄᴛ",
              description:
                "ᴡᴇ ᴄᴏʟʟᴇᴄᴛ ᴘᴇʀꜱᴏɴᴀʟ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ ꜱᴜᴄʜ ᴀꜱ ɴᴀᴍᴇ, ᴇᴍᴀɪʟ, ᴘʜᴏɴᴇ ɴᴜᴍʙᴇʀ, ᴀɴᴅ ᴘᴀʏᴍᴇɴᴛ ᴅᴇᴛᴀɪʟꜱ.",
            },
            {
              title: "2. ʜᴏᴡ ᴡᴇ ᴜꜱᴇ ʏᴏᴜʀ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ",
              description:
                "ᴡᴇ ᴜꜱᴇ ʏᴏᴜʀ ᴅᴀᴛᴀ ᴛᴏ ᴘʀᴏᴠɪᴅᴇ ᴀɴᴅ ɪᴍᴘʀᴏᴠᴇ ᴏᴜʀ ꜱᴇʀᴠɪᴄᴇꜱ, ᴇɴꜱᴜʀᴇ ꜱᴇᴄᴜʀɪᴛʏ, ᴀɴᴅ ᴄᴏᴍᴍᴜɴɪᴄᴀᴛᴇ ᴜᴘᴅᴀᴛᴇꜱ.",
            },
            {
              title: "3. ꜱʜᴀʀɪɴɢ ᴏꜰ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ",
              description:
                "ᴡᴇ ᴅᴏ ɴᴏᴛ ꜱᴇʟʟ ʏᴏᴜʀ ᴅᴀᴛᴀ. ᴡᴇ ᴍᴀʏ ꜱʜᴀʀᴇ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ ᴡɪᴛʜ ᴛʀᴜꜱᴛᴇᴅ ᴘᴀʀᴛɴᴇʀꜱ ꜰᴏʀ ꜱᴇʀᴠɪᴄᴇ ɪᴍᴘʀᴏᴠᴇᴍᴇɴᴛ.",
            },
            {
              title: "4. ꜱᴇᴄᴜʀɪᴛʏ ᴍᴇᴀꜱᴜʀᴇꜱ",
              description:
                "ᴡᴇ ᴛᴀᴋᴇ ꜱᴛʀᴏɴɢ ꜱᴇᴄᴜʀɪᴛʏ ᴍᴇᴀꜱᴜʀᴇꜱ ᴛᴏ ᴘʀᴏᴛᴇᴄᴛ ʏᴏᴜʀ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ ꜰʀᴏᴍ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ ᴀᴄᴄᴇꜱꜱ.",
            },
            {
              title: "5. ᴘᴏʟɪᴄʏ ᴜᴘᴅᴀᴛᴇꜱ",
              description:
                "ᴡᴇ ᴍᴀʏ ᴜᴘᴅᴀᴛᴇ ᴛʜɪꜱ ᴘᴏʟɪᴄʏ ᴘᴇʀɪᴏᴅɪᴄᴀʟʟʏ. ᴀɴʏ ᴄʜᴀɴɢᴇꜱ ᴡɪʟʟ ʙᴇ ᴘᴏꜱᴛᴇᴅ ᴏɴ ᴏᴜʀ ᴡᴇʙꜱɪᴛᴇ.",
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
            ɪꜰ ʏᴏᴜ ʜᴀᴠᴇ ᴀɴʏ Qᴜᴇꜱᴛɪᴏɴꜱ, ꜰᴇᴇʟ ꜰʀᴇᴇ ᴛᴏ ʀᴇᴀᴄʜ ᴏᴜᴛ ᴛᴏ ᴜꜱ.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600" />
              <div>
                <p className="font-semibold">ᴏꜰꜰɪᴄᴇ ᴀᴅᴅʀᴇꜱꜱ</p>
                <p className="text-sm">
                  1907-1910, ᴋᴀᴍᴅʜᴇɴᴜ ᴄᴏᴍᴍᴇʀᴢ, ɴᴇxᴛ ᴛᴏ ʀᴀɢʜᴜɴᴀᴛʜ ᴠɪʜᴀʀ, ʙʟᴏᴄᴋ-ᴊ,
                  ꜱᴇᴄᴛᴏʀ14, ᴋʜᴀʀɢʜᴀʀ, ɴᴀᴠɪ ᴍᴜᴍʙᴀɪ, 410210
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-green-600" />
              <div>
                <p className="font-semibold">ᴄᴏɴᴛᴀᴄᴛ ɴᴜᴍʙᴇʀ</p>
                <p className="text-sm">+91 7707076831</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-red-500" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-blue-600">ᴍɴᴇꜱʜᴋ480@ɢᴍᴀɪʟ.ᴄᴏᴍ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
