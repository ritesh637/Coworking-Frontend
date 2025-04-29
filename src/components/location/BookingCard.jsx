// import React from "react";

// const CoworkingSection = () => {
//   return (
//     <div className="relative flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-20 overflow-hidden">
//       {/* Decorative background elements */}
//       <div className="absolute inset-0 overflow-hidden opacity-20">
//         <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-blue-400 mix-blend-multiply filter blur-3xl"></div>
//         <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-purple-400 mix-blend-multiply filter blur-3xl"></div>
//       </div>

//       <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
//         {/* Section title with gradient text */}
//         <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
//           <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//             Work Independently <br className="hidden md:block" /> Where Change
//             Comes to Work.
//           </span>
//         </h1>

//         {/* Description text */}
//         <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
//           Coworking allows professionals to share office space, reducing costs
//           and increasing convenience through common infrastructure.
//         </p>

//         {/* Quote with improved styling */}
//         <blockquote className="relative max-w-2xl mx-auto text-lg md:text-xl italic text-gray-700 mb-10 p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm">
//           <svg
//             className="absolute top-0 left-0 w-8 h-8 text-gray-300 -mt-2 -ml-2"
//             fill="currentColor"
//             viewBox="0 0 32 32"
//           >
//             <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.456-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.624-9.024L25.864 4z" />
//           </svg>
//           "The future of work is not a place but a mindset."
//           <svg
//             className="absolute bottom-0 right-0 w-8 h-8 text-gray-300 -mb-2 -mr-2"
//             fill="currentColor"
//             viewBox="0 0 32 32"
//           >
//             <path d="M22.648 28c4.896-3.456 8.352-9.12 8.352-15.36 0-5.088-3.072-8.064-6.624-8.064-3.36 0-5.856 2.688-5.856 5.856 0 3.168 2.208 5.472 5.088 5.472.576 0 1.344-.096 1.536-.192-.48 3.264-3.456 7.104-6.624 9.024L22.648 28zm-16.512 0c4.8-3.456 8.256-9.12 8.256-15.36 0-5.088-3.072-8.064-6.624-8.064-3.264 0-5.856 2.688-5.856 5.856 0 3.168 2.304 5.472 5.184 5.472.576 0 1.248-.096 1.44-.192-.48-3.264-3.456-7.104-6.624-9.024L6.136 28z" />
//           </svg>
//         </blockquote>
//       </div>

//       {/* Decorative dots pattern */}
//       <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
//         <div className="absolute bottom-0 left-0 right-0 h-20 bg-repeat-x bg-[length:40px_40px] bg-[radial-gradient(circle,_rgba(0,0,0,0.05)_2px,_transparent_2px)]"></div>
//       </div>
//     </div>
//   );
// };

// export default CoworkingSection;

import Link from "next/link";

const BookingCard = ({ office }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Image with gradient overlay */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
        <img
          src={office.image}
          alt={office.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent"></div>
        <span className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
          Popular
        </span>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {office.name}
          </h2>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <svg
            className="w-5 h-5 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm sm:text-base">{office.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[].map((amenity) => (
            <span
              key={amenity}
              className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Booking Button */}
        <Link href={`/office/${office.id}`} className="block">
          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center">
            <span>Book Now</span>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
