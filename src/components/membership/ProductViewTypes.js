// "use client";

// import React, { useState } from "react";
// import { FiGrid, FiList, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// const products = [
//   {
//     id: 1,
//     name: "Private Office",
//     description: "Fully furnished private office with all amenities",
//     price: "$500/month",
//     capacity: "1-4 people",
//     image:
//       "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//     features: ["24/7 Access", "High-speed WiFi", "Meeting Room Access"],
//     availability: "Available",
//   },
//   {
//     id: 2,
//     name: "Coworking Space",
//     description: "Flexible coworking space in a vibrant community",
//     price: "$250/month",
//     capacity: "Open seating",
//     image:
//       "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//     features: ["Hot Desk", "Community Events", "Free Coffee"],
//     availability: "Limited",
//   },
//   {
//     id: 3,
//     name: "Meeting Room",
//     description: "Professional meeting room for your business needs",
//     price: "$50/hour",
//     capacity: "Up to 10 people",
//     image:
//       "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//     features: ["AV Equipment", "Whiteboard", "Video Conferencing"],
//     availability: "Available",
//   },
//   {
//     id: 4,
//     name: "Virtual Office",
//     description: "Professional business address without physical space",
//     price: "$100/month",
//     capacity: "Virtual",
//     image:
//       "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//     features: ["Mail Handling", "Phone Answering", "Business Address"],
//     availability: "Available",
//   },
// ];

// const ProductViewTypes = () => {
//   const [viewType, setViewType] = useState("grid");
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = viewType === "grid" ? 4 : 5;

//   // Pagination logic
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = products.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );
//   const totalPages = Math.ceil(products.length / productsPerPage);

//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-10">
//           <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
//             Our Workspace Solutions
//           </h2>
//           <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
//             Choose the perfect workspace for your business needs
//           </p>
//         </div>

//         {/* View type toggle and pagination controls */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
//           <div className="flex items-center space-x-2">
//             <span className="text-sm font-medium text-gray-700">View:</span>
//             <button
//               onClick={() => {
//                 setViewType("grid");
//                 setCurrentPage(1);
//               }}
//               className={`p-2 rounded-md ${
//                 viewType === "grid"
//                   ? "bg-purple-100 text-purple-700"
//                   : "text-gray-500 hover:bg-gray-100"
//               }`}
//               aria-label="Grid view"
//             >
//               <FiGrid className="h-5 w-5" />
//             </button>
//             <button
//               onClick={() => {
//                 setViewType("list");
//                 setCurrentPage(1);
//               }}
//               className={`p-2 rounded-md ${
//                 viewType === "list"
//                   ? "bg-purple-100 text-purple-700"
//                   : "text-gray-500 hover:bg-gray-100"
//               }`}
//               aria-label="List view"
//             >
//               <FiList className="h-5 w-5" />
//             </button>
//           </div>

//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => paginate(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//               className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:bg-gray-100"
//               aria-label="Previous page"
//             >
//               <FiChevronLeft className="h-5 w-5" />
//             </button>
//             <span className="text-sm font-medium text-gray-700">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//               disabled={currentPage === totalPages}
//               className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:bg-gray-100"
//               aria-label="Next page"
//             >
//               <FiChevronRight className="h-5 w-5" />
//             </button>
//           </div>
//         </div>

//         {/* Products display */}
//         {viewType === "grid" ? (
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             {currentProducts.map((product) => (
//               <div
//                 key={product.id}
//                 className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
//               >
//                 <div className="h-48 overflow-hidden">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src =
//                         "https://via.placeholder.com/500x300?text=Product+Image";
//                     }}
//                   />
//                 </div>
//                 <div className="p-4">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {product.name}
//                     </h3>
//                     <span
//                       className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         product.availability === "Available"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {product.availability}
//                     </span>
//                   </div>
//                   <p className="mt-1 text-sm text-gray-500">
//                     {product.description}
//                   </p>
//                   <div className="mt-2">
//                     <span className="text-sm font-medium text-gray-900">
//                       {product.price}
//                     </span>
//                     <span className="mx-2 text-gray-300">•</span>
//                     <span className="text-sm text-gray-500">
//                       {product.capacity}
//                     </span>
//                   </div>
//                   <div className="mt-3">
//                     <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Product
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Description
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Price
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Availability
//                   </th>
//                   <th scope="col" className="relative px-6 py-3">
//                     <span className="sr-only">Action</span>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentProducts.map((product) => (
//                   <tr key={product.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <img
//                             className="h-10 w-10 rounded-full"
//                             src={product.image}
//                             alt={product.name}
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src =
//                                 "https://via.placeholder.com/100?text=Product";
//                             }}
//                           />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {product.name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {product.capacity}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">
//                         {product.description}
//                       </div>
//                       <div className="mt-1 text-sm text-gray-500">
//                         {product.features.join(", ")}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {product.price}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           product.availability === "Available"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {product.availability}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button className="text-purple-600 hover:text-purple-900">
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Bottom pagination controls */}
//         <div className="mt-8 flex justify-center">
//           <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//             <button
//               onClick={() => paginate(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//               className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <span className="sr-only">Previous</span>
//               <FiChevronLeft className="h-5 w-5" />
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//               (number) => (
//                 <button
//                   key={number}
//                   onClick={() => paginate(number)}
//                   className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                     currentPage === number
//                       ? "z-10 bg-purple-50 border-purple-500 text-purple-600"
//                       : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                   }`}
//                 >
//                   {number}
//                 </button>
//               )
//             )}
//             <button
//               onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//               disabled={currentPage === totalPages}
//               className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <span className="sr-only">Next</span>
//               <FiChevronRight className="h-5 w-5" />
//             </button>
//           </nav>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductViewTypes;
