"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const BASE_URL = "http://localhost:4000/api/promocode";

const PromoCodePage = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    } else {
      fetchPromoCodes();
    }
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/all`);
      setPromoCodes(response.data);
    } catch (error) {
      setMessage("Failed to fetch promo codes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    const today = new Date().setHours(0, 0, 0, 0);
    const expiryDate = new Date(expiry).setHours(0, 0, 0, 0);

    if (expiryDate < today) {
      setMessage("❌ Expiry date cannot be in the past.");
      return;
    }

    const data = { code, discount, expiry };
    const token = Cookies.get("token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (selectedId) {
        await axios.put(`${BASE_URL}/${selectedId}`, data, config);
        setMessage("✅ Promo code updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/create`, data, config);
        setMessage("✅ Promo code created successfully!");
      }

      resetForm();
      fetchPromoCodes();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error saving promo code.");
    }
  };

  const handleDelete = async (id) => {
    const token = Cookies.get("token");
    try {
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("🗑️ Promo code deleted successfully!");
      fetchPromoCodes();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting promo code.");
    }
  };

  const handleEdit = (promo) => {
    setCode(promo.code);
    setDiscount(promo.discount);
    setExpiry(promo.expiry.slice(0, 10));
    setSelectedId(promo._id);
  };

  const resetForm = () => {
    setCode("");
    setDiscount("");
    setExpiry("");
    setSelectedId(null);
  };

  if (loading)
    return <p className="p-6 text-center text-gray-500">Checking access...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-800 drop-shadow-sm">
          🎟️ Promo Code Manager
        </h1>

        {message && (
          <div className="mb-6 text-center text-sm font-medium text-red-600">
            {message}
          </div>
        )}

        <form
          onSubmit={handleCreateOrUpdate}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Promo Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                required
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
            >
              {selectedId ? "Update" : "Create"} Promo Code
            </button>
            {selectedId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
          📋 Existing Promo Codes
        </h2>
        <div className="grid gap-4">
          {promoCodes.map((promo) => (
            <div
              key={promo._id}
              className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition"
            >
              <div>
                <p className="text-xl font-bold text-gray-800">{promo.code}</p>
                <p className="text-sm text-gray-600">
                  Discount:{" "}
                  <span className="font-semibold">{promo.discount}%</span>
                </p>
                <p className="text-sm text-gray-600">
                  Expiry: {new Date(promo.expiry).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3 mt-4 sm:mt-0">
                <button
                  onClick={() => handleEdit(promo)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-1.5 rounded-md text-sm shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(promo._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1.5 rounded-md text-sm shadow"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoCodePage;
