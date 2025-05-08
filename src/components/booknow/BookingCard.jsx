// import Link from "next/link";

// const BookingCard = ({ office }) => {
//   const hasPricing = office.pricing && typeof office.pricing === "object";

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform transition duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
//       {/* Image Section */}
//       <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden group">
//         <img
//           src={office.image || "/default-office.jpg"}
//           alt={office.name}
//           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//           loading="lazy"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
//         <span className="absolute top-4 right-4 bg-gradient-to-r from-purple-800 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
//           Popular
//         </span>
//       </div>

//       {/* Content Section */}
//       <div className="p-5 sm:p-6">
//         <div className="flex justify-between items-start mb-1">
//           <h2 className="text-xl font-bold text-gray-800 dark:text-white truncate max-w-[70%]">
//             {office.name}
//           </h2>
//           {hasPricing && (
//             <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
//               ₹299 - ₹32,000
//             </span>
//           )}
//         </div>

//         <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
//           <svg
//             className="w-4 h-4 mr-1"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//             />
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//             />
//           </svg>
//           <span className="truncate">{office.location}</span>
//         </div>

//         <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-5">
//           {office.description}
//         </p>

//         {/* Pricing Breakdown */}
//         {hasPricing && (
//           <div className="mb-6">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
//               {Object.entries(office.pricing).map(([key, value]) => (
//                 <div
//                   key={key}
//                   className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg"
//                 >
//                   <div className="font-medium text-gray-500 dark:text-gray-400">
//                     {key.replace("_", " ")}
//                   </div>
//                   <div className="font-bold text-gray-800 dark:text-white">
//                     {value}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Book Now Button */}
//         <Link href={`/office/${office.id}`} className="block">
//           <div className="w-full inline-flex justify-center items-center mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
//             Book Now
//             <svg
//               className="w-4 h-4 ml-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M14 5l7 7m0 0l-7 7m7-7H3"
//               />
//             </svg>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default BookingCard;

import Link from "next/link";

const BookingCard = ({ office }) => {
  // Check if pricing exists and has the new structure
  const hasPricing =
    office.pricing &&
    typeof office.pricing === "object" &&
    office.selectedPricing;

  // Helper function to get price range for a type
  const getPriceRange = (prices) => {
    if (!prices || prices.length === 0) return "N/A";
    const numericPrices = prices.map((p) =>
      parseFloat(p.replace(/[^\d.]/g, ""))
    );
    const min = Math.min(...numericPrices);
    const max = Math.max(...numericPrices);
    return `₹${min} - ₹${max}`;
  };

  // Get overall price range for the badge
  const overallPriceRange = hasPricing
    ? Object.values(office.pricing).some((arr) => arr.length > 0)
      ? `₹${Math.min(
          ...Object.values(office.pricing)
            .flat()
            .map((p) => parseFloat(p.replace(/[^\d.]/g, "")))
        )} - ₹${Math.max(
          ...Object.values(office.pricing)
            .flat()
            .map((p) => parseFloat(p.replace(/[^\d.]/g, "")))
        )}`
      : "N/A"
    : "N/A";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform transition duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
      {/* Image Section */}
      <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden group">
        <img
          src={office.image || "/default-office.jpg"}
          alt={office.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute top-4 right-4 bg-gradient-to-r from-purple-800 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          Popular
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white truncate max-w-[70%]">
            {office.name}
          </h2>
          {hasPricing && (
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {overallPriceRange}
            </span>
          )}
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{office.location}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-5">
          {office.description}
        </p>

        {/* Pricing Breakdown */}
        {hasPricing && (
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {Object.entries(office.selectedPricing).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg"
                >
                  <div className="font-medium text-gray-500 dark:text-gray-400">
                    {key.replace("_", " ")}
                  </div>
                  <div className="font-bold text-gray-800 dark:text-white">
                    {value || "Not selected"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <Link href={`/office/${office.id}`} className="block">
          <div className="w-full inline-flex justify-center items-center mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
            Book Now
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
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
