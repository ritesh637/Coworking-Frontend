

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

const Page = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = Cookies.get("token");
      const role = sessionStorage.getItem("role");

      if (!token || role !== "admin") {
        setError("Access Denied. Admins only.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:4000/api/payment/my-all-users-bookings?page=${page}&limit=${limit}&search=${search}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setBookings(response.data.data);
          setTotalPages(response.data.totalPages);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page, limit, search]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8">
        Order Dashboard
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Link href="/admin/office-management">
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:scale-105 transition duration-200">
            🏢 Office Management
          </button>
        </Link>
        <Link href="/admin/promocode-management">
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:scale-105 transition duration-200">
            🎟️ PromoCode Management
          </button>
        </Link>
      </div>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 Search by email..."
          value={search}
          onChange={handleSearchChange}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transform hover:scale-[1.02] transition duration-200"
          >
            <h2 className="text-md font-bold text-gray-900 mb-1">
              🆔 Booking ID:{" "}
              <span className="text-blue-700">{booking._id}</span>
            </h2>
            <p className="text-sm text-gray-700">
              👤 Email:{" "}
              <span className="text-blue-600 font-medium">
                {booking.userId?.email || "Unknown"}
              </span>
            </p>
            <p className="text-sm text-gray-700">
              💰 Total:{" "}
              <span className="text-green-600 font-bold">
                ₹ {booking.totalAmount.toFixed(2)}
              </span>
            </p>
            <p className="text-sm font-medium">
              📌 Status:{" "}
              <span
                className={
                  booking.paymentStatus === "Completed"
                    ? "text-green-600 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                {booking.paymentStatus}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              🕒 {new Date(booking.createdAt).toLocaleString()}
            </p>

            <div className="mt-3 bg-gray-50 p-3 rounded border">
              <h3 className="text-sm font-bold mb-2 text-gray-800">
                🛒 Cart Items
              </h3>
              {booking.cartItems.map((item) => (
                <div
                  key={item._id}
                  className="mb-2 p-2 bg-white rounded shadow border border-gray-200"
                >
                  <p className="text-sm font-semibold">📋 Plan: {item.plan}</p>
                  <p className="text-sm">💸 Price: ₹ {item.price.toFixed(2)}</p>
                  <p className="text-sm">📅 From: {item.startDate}</p>
                  <p className="text-sm">📅 To: {item.endDate}</p>
                  <p className="text-sm">
                    ⏰ Time: {item.startTime} - {item.endTime}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⬅ Prev
        </button>
        <span className="text-gray-700 font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default Page;
