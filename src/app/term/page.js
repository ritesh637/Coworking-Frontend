import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="text-gray-800">
      {/* Static Background Header */}
      <div
        className="h-[350px] flex flex-col items-center justify-center text-white text-center"
        style={{
          backgroundImage:
            "url('https://www.goodworks.in/wp-content/uploads/2023/11/people-social-distancing-work_11zon-1536x1059.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black/50 w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          <p className="text-lg mt-2">
            Please read carefully before using our services
          </p>
        </div>
      </div>

      {/* Terms & Conditions Content */}
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <section className="space-y-6">
          <div className="group">
            <h2 className="text-2xl font-semibold text-gray-900 transition-all duration-300 group-hover:text-blue-600">
              1. Membership & Access
            </h2>
            <p className="text-gray-700 group-hover:translate-x-1 transition-all duration-300">
              Members must register before using the facilities. Access is
              limited to designated hours based on membership plans.
            </p>
          </div>

          <div className="group">
            <h2 className="text-2xl font-semibold text-gray-900 transition-all duration-300 group-hover:text-blue-600">
              2. Use of Facilities
            </h2>
            <p className="text-gray-700 group-hover:translate-x-1 transition-all duration-300">
              Respect shared spaces and maintain cleanliness. Unauthorized
              modifications or misuse of equipment are prohibited.
            </p>
          </div>

          <div className="group">
            <h2 className="text-2xl font-semibold text-gray-900 transition-all duration-300 group-hover:text-blue-600">
              3. Payment & Cancellation
            </h2>
            <p className="text-gray-700 group-hover:translate-x-1 transition-all duration-300">
              Membership fees must be paid in advance. Cancellations require
              prior notice as per policy.
            </p>
          </div>

          <div className="group">
            <h2 className="text-2xl font-semibold text-gray-900 transition-all duration-300 group-hover:text-blue-600">
              4. Conduct & Etiquette
            </h2>
            <p className="text-gray-700 group-hover:translate-x-1 transition-all duration-300">
              Maintain a professional environment. Harassment, loud
              disturbances, or disruptive behavior will not be tolerated.
            </p>
          </div>

          <div className="group">
            <h2 className="text-2xl font-semibold text-gray-900 transition-all duration-300 group-hover:text-blue-600">
              5. Liability & Security
            </h2>
            <p className="text-gray-700 group-hover:translate-x-1 transition-all duration-300">
              We are not responsible for lost or stolen items. Members must
              ensure their belongings are secure.
            </p>
          </div>

          <div className="group">
            <h2 className="text-2xl font-semibold text-gray-900 transition-all duration-300 group-hover:text-blue-600">
              6. Amendments
            </h2>
            <p className="text-gray-700 group-hover:translate-x-1 transition-all duration-300">
              We reserve the right to update these terms at any time. Continued
              use of the space implies agreement to new terms.
            </p>
          </div>
        </section>

        {/* Contact Details */}
        <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
          <p className="text-gray-700 mt-2">
            If you have any questions, feel free to reach out to us.
          </p>

          <div className="mt-4">
            <p className="text-gray-900 font-semibold">📍 Office Address:</p>
            <p className="text-gray-700">
              1910, Kamdhenu Commerz, next to Raghunath Vihar, Block-J ,
              Raghunath Vihar, Sector14, Kharghar, Navi Mumbai, 410210
            </p>
          </div>

          <div className="mt-4">
            <p className="text-gray-900 font-semibold">📞 Contact Number:</p>
            <p className="text-gray-700">+91 7707076831</p>
          </div>

          <div className="mt-4">
            <p className="text-gray-900 font-semibold">📧 Email:</p>
            <p className="text-blue-600 font-semibold">support@.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
