// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { FaEye } from "react-icons/fa";

// const Bookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchBookings = async () => {
//       const token = Cookies.get("token");

//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           "http://localhost:4000/api/payment/my-bookings",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = response.data;
//         const extractedBookings = Array.isArray(data)
//           ? data
//           : Array.isArray(data.bookings)
//           ? data.bookings
//           : [];

//         setBookings(extractedBookings);
//         if (extractedBookings.length === 0) {
//           setError("No bookings found.");
//         }
//       } catch (err) {
//         setError(err?.response?.data?.message || "Failed to fetch bookings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const viewInvoiceDetails = (bookingId) => {
//     router.push(`/invoice/${bookingId}`);
//   };

//   if (loading) {
//     return (
//       <p className="text-center text-lg font-semibold h-screen flex items-center justify-center">
//         Loading...
//       </p>
//     );
//   }

//   if (error) {
//     return (
//       <p className="text-center text-red-500 text-lg h-screen flex items-center justify-center">
//         {error}
//       </p>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 min-h-screen flex flex-col">
//       <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-purple-800 tracking-wide">
//         🧾 My Booking History
//       </h2>

//       {bookings.length === 0 ? (
//         <p className="text-center text-gray-500 text-lg">
//           You have no bookings yet.
//         </p>
//       ) : (
//         <>
//           {/* Desktop View */}
//           <div className="hidden md:flex flex-1">
//             <div className="overflow-x-auto w-full rounded-xl shadow-2xl bg-white">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm uppercase tracking-wider">
//                     <th className="py-3 px-6">Plan</th>
//                     <th className="py-3 px-6">Start Date</th>
//                     <th className="py-3 px-6">End Date</th>
//                     <th className="py-3 px-6">CGST (9%)</th>
//                     <th className="py-3 px-6">SGST (9%)</th>
//                     <th className="py-3 px-6">Amount</th>
//                     <th className="py-3 px-6">Status</th>
//                     <th className="py-3 px-6">Order ID</th>
//                     <th className="py-3 px-6">Invoice</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-gray-700 text-sm">
//                   {bookings.map((booking) =>
//                     booking.cartItems?.map((item, index) => (
//                       <tr
//                         key={booking._id + index}
//                         className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
//                       >
//                         <td className="py-4 px-6 font-medium">{item.plan}</td>
//                         <td className="py-4 px-6">{item.startDate}</td>
//                         <td className="py-4 px-6">{item.endDate}</td>
//                         <td className="py-4 px-6">
//                           ₹{(item.price * 0.09).toFixed(2)}
//                         </td>
//                         <td className="py-4 px-6">
//                           ₹{(item.price * 0.09).toFixed(2)}
//                         </td>
//                         <td className="py-4 px-6 font-bold text-blue-600">
//                           ₹{booking.totalAmount}
//                         </td>
//                         <td
//                           className={`py-4 px-6 font-semibold ${
//                             booking.paymentStatus === "Completed"
//                               ? "text-green-600"
//                               : "text-yellow-600"
//                           }`}
//                         >
//                           {booking.paymentStatus}
//                         </td>
//                         <td className="py-4 px-6 text-gray-500">
//                           {booking.razorpayOrderId}
//                         </td>
//                         <td className="py-4 px-6">
//                           <button
//                             onClick={() => viewInvoiceDetails(booking._id)}
//                             title="View Invoice"
//                             className="text-indigo-600 hover:text-black transition-all flex items-center gap-1"
//                           >
//                             <FaEye /> View
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Mobile View */}
//           <div className="md:hidden flex flex-col gap-4 mt-4">
//             {bookings.map((booking) =>
//               booking.cartItems?.map((item, index) => (
//                 <div
//                   key={booking._id + index}
//                   className="bg-white shadow-lg rounded-xl p-4 border border-gray-200"
//                 >
//                   <div className="text-lg font-semibold text-purple-700">
//                     {item.plan}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     <p>
//                       📅 {item.startDate} to {item.endDate}
//                     </p>
//                     <p className="font-medium">
//                       CGST (9%): ₹{(item.price * 0.09).toFixed(2)}
//                     </p>
//                     <p className="font-medium">
//                       SGST (9%): ₹{(item.price * 0.09).toFixed(2)}
//                     </p>
//                     <p className="font-medium text-blue-600">
//                       ₹{booking.totalAmount}
//                     </p>
//                     <p
//                       className={`font-semibold ${
//                         booking.paymentStatus === "Completed"
//                           ? "text-green-600"
//                           : "text-yellow-600"
//                       }`}
//                     >
//                       {booking.paymentStatus}
//                     </p>
//                     <p className="text-gray-500 text-xs mt-1">
//                       Order ID: {booking.razorpayOrderId}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => viewInvoiceDetails(booking._id)}
//                     className="mt-2 w-full flex justify-center items-center gap-2 text-indigo-600 hover:text-black text-sm font-medium"
//                   >
//                     <FaEye /> View Invoice
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Bookings;

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaEye, FaCalendarAlt, FaRupeeSign, FaReceipt } from "react-icons/fa";
import { FiLoader, FiAlertCircle } from "react-icons/fi";
import { MdPayment } from "react-icons/md";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = Cookies.get("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:4000/api/payment/my-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        const extractedBookings = Array.isArray(data)
          ? data
          : Array.isArray(data.bookings)
          ? data.bookings
          : [];

        setBookings(extractedBookings);
        if (extractedBookings.length === 0) {
          setError("No bookings found.");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const viewInvoiceDetails = (bookingId) => {
    router.push(`/invoice/${bookingId}`);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.paymentStatus.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <FiLoader className="animate-spin text-4xl text-purple-600" />
        <p className="text-lg font-medium text-gray-700">
          Loading your bookings...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <FiAlertCircle className="text-4xl text-red-500" />
        <p className="text-center text-red-500 text-lg max-w-md px-4">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-purple-800">
          <FaReceipt className="inline mr-2" />
          My Booking History
        </h2>

        {/* Filter controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {["all", "completed", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                filter === f
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <MdPayment className="text-3xl text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {filter === "all"
                ? "You haven't made any bookings yet."
                : `You don't have any ${filter} bookings.`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="overflow-hidden rounded-xl shadow-lg border border-gray-100">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
                    <tr>
                      <th className="py-4 px-6 font-medium">Plan</th>
                      <th className="py-4 px-6 font-medium">Dates</th>
                      <th className="py-4 px-6 font-medium">Taxes</th>
                      <th className="py-4 px-6 font-medium">Amount</th>
                      <th className="py-4 px-6 font-medium">Status</th>
                      <th className="py-4 px-6 font-medium">Order ID</th>
                      <th className="py-4 px-6 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.map((booking) =>
                      booking.cartItems?.map((item, index) => (
                        <tr
                          key={booking._id + index}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-800">
                              {item.plan}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-sm">
                              <FaCalendarAlt className="text-purple-500" />
                              <span>{item.startDate}</span>
                              <span>to</span>
                              <span>{item.endDate}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <div>CGST: ₹{(item.price * 0.09).toFixed(2)}</div>
                              <div>SGST: ₹{(item.price * 0.09).toFixed(2)}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center font-bold text-purple-700">
                              <FaRupeeSign className="mr-1" />
                              {booking.totalAmount}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                booking.paymentStatus === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.paymentStatus === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-xs text-gray-500 font-mono">
                              {booking.razorpayOrderId}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => viewInvoiceDetails(booking._id)}
                              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition"
                            >
                              <FaEye />
                              <span>Invoice</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {filteredBookings.map((booking) =>
                booking.cartItems?.map((item, index) => (
                  <div
                    key={booking._id + index}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                  >
                    <div className="p-4 border-b border-gray-100 bg-purple-50">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-purple-800">
                          {item.plan}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            booking.paymentStatus === "Completed"
                              ? "bg-green-100 text-green-800"
                              : booking.paymentStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <FaCalendarAlt className="text-purple-500" />
                        <span>
                          {item.startDate} to {item.endDate}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-500">CGST (9%)</div>
                          <div>₹{(item.price * 0.09).toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">SGST (9%)</div>
                          <div>₹{(item.price * 0.09).toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-gray-500 text-xs">Total</div>
                            <div className="flex items-center font-bold text-lg text-purple-700">
                              <FaRupeeSign className="mr-1" />
                              {booking.totalAmount}
                            </div>
                          </div>
                          <button
                            onClick={() => viewInvoiceDetails(booking._id)}
                            className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
                          >
                            <FaEye />
                            <span>View Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 truncate">
                      Order ID: {booking.razorpayOrderId}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Bookings;
