import React from "react";

const MainContent = () => {
  return (
    <main>
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600 mb-6">
          ᴅɪꜱᴄᴏᴠᴇʀ ᴀ ɴᴇᴡ ᴡᴀʏ ᴛᴏ ᴡᴏʀᴋ ᴀɴᴅ ᴄᴏʟʟᴀʙᴏʀᴀᴛᴇ
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            ᴄᴏᴡᴏʀᴋɪɴɢ ꜱᴘᴀᴄᴇꜱ ᴀʀᴇ ꜱʜᴀʀᴇᴅ ᴏꜰꜰɪᴄᴇꜱ ᴡʜᴇʀᴇ ᴘᴇᴏᴘʟᴇ ꜰʀᴏᴍ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴊᴏʙꜱ
            ᴡᴏʀᴋ ᴛᴏɢᴇᴛʜᴇʀ. ᴛʜᴇꜱᴇ ᴘʟᴀᴄᴇꜱ ʜᴇʟᴘ ʙᴏᴏꜱᴛ ᴄʀᴇᴀᴛɪᴠɪᴛʏ, ᴛᴇᴀᴍᴡᴏʀᴋ, ᴀɴᴅ
            ᴘʀᴏᴅᴜᴄᴛɪᴠɪᴛʏ ɪɴ ᴀ ʟɪᴠᴇʟʏ ᴀɴᴅ ꜰʀɪᴇɴᴅʟʏ ᴇɴᴠɪʀᴏɴᴍᴇɴᴛ
          </p>
          <div className="flex justify-center">
            <a
              href="/about"
              className="inline-block py-3 px-8 bg-teal-500 text-white text-lg font-medium rounded-full shadow-lg transition duration-300 transform hover:bg-teal-600 hover:scale-105"
            >
              ᴇxᴘʟᴏʀᴇ ɴᴏᴡ
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
