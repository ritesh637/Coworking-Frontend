"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (loading) {
    return (
      <p className="text-center text-lg font-semibold h-screen flex items-center justify-center">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 text-lg h-screen flex items-center justify-center">
        {error}
      </p>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-purple-800 tracking-wide">
        🧾 My Booking History
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You have no bookings yet.
        </p>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:flex flex-1">
            <div className="overflow-x-auto w-full rounded-xl shadow-2xl bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm uppercase tracking-wider">
                    <th className="py-3 px-6">Plan</th>
                    <th className="py-3 px-6">Start Date</th>
                    <th className="py-3 px-6">End Date</th>
                    <th className="py-3 px-6">CGST (9%)</th>
                    <th className="py-3 px-6">SGST (9%)</th>
                    <th className="py-3 px-6">Amount</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Order ID</th>
                    <th className="py-3 px-6">Invoice</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {bookings.map((booking) =>
                    booking.cartItems?.map((item, index) => (
                      <tr
                        key={booking._id + index}
                        className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                      >
                        <td className="py-4 px-6 font-medium">{item.plan}</td>
                        <td className="py-4 px-6">{item.startDate}</td>
                        <td className="py-4 px-6">{item.endDate}</td>
                        <td className="py-4 px-6">
                          ₹{(item.price * 0.09).toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          ₹{(item.price * 0.09).toFixed(2)}
                        </td>
                        <td className="py-4 px-6 font-bold text-blue-600">
                          ₹{booking.totalAmount}
                        </td>
                        <td
                          className={`py-4 px-6 font-semibold ${
                            booking.paymentStatus === "Completed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {booking.paymentStatus}
                        </td>
                        <td className="py-4 px-6 text-gray-500">
                          {booking.razorpayOrderId}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => viewInvoiceDetails(booking._id)}
                            title="View Invoice"
                            className="text-indigo-600 hover:text-black transition-all flex items-center gap-1"
                          >
                            <FaEye /> View
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
          <div className="md:hidden flex flex-col gap-4 mt-4">
            {bookings.map((booking) =>
              booking.cartItems?.map((item, index) => (
                <div
                  key={booking._id + index}
                  className="bg-white shadow-lg rounded-xl p-4 border border-gray-200"
                >
                  <div className="text-lg font-semibold text-purple-700">
                    {item.plan}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      📅 {item.startDate} to {item.endDate}
                    </p>
                    <p className="font-medium">
                      CGST (9%): ₹{(item.price * 0.09).toFixed(2)}
                    </p>
                    <p className="font-medium">
                      SGST (9%): ₹{(item.price * 0.09).toFixed(2)}
                    </p>
                    <p className="font-medium text-blue-600">
                      ₹{booking.totalAmount}
                    </p>
                    <p
                      className={`font-semibold ${
                        booking.paymentStatus === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {booking.paymentStatus}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Order ID: {booking.razorpayOrderId}
                    </p>
                  </div>
                  <button
                    onClick={() => viewInvoiceDetails(booking._id)}
                    className="mt-2 w-full flex justify-center items-center gap-2 text-indigo-600 hover:text-black text-sm font-medium"
                  >
                    <FaEye /> View Invoice
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bookings;
