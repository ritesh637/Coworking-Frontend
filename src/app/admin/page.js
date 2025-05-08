"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from "@/lib/config";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pricing");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    features: "",
    badge: "",
    highlight: false,
    duration: "monthly",
    popular: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      const role = sessionStorage.getItem("role");

      if (!token) {
        router.push("/login");
        return;
      }

      if (role === "admin") {
        setIsAdmin(true);
      }

      if (activeTab === "pricing") {
        fetchPricingPlans(token);
      } else if (activeTab === "orders") {
        fetchBookings(token);
      }
    };

    const fetchPricingPlans = async (token) => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/pricing-plans",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching pricing plans:", error);
        setError("Failed to fetch pricing plans. Please try again later.");
        toast.error("Failed to load pricing plans");
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async (token) => {
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

    checkAuth();
  }, [router, activeTab, page, limit, search]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = Cookies.get("token");

    try {
      const featuresArray = formData.features
        .split(",")
        .map((feature) => feature.trim())
        .filter((feature) => feature);

      const payload = {
        ...formData,
        features: featuresArray,
      };

      let response;
      if (editingId) {
        response = await axios.put(
          `${BASE_URL}/pricing-plans/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Plan updated successfully!");
        setPlans(
          plans.map((plan) =>
            plan._id === editingId ? response.data.updatedPlan : plan
          )
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/pricing-plans`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("New plan created!");
        setPlans([...plans, response.data.newPlan]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error(error.response?.data?.message || "Failed to save plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      price: plan.price,
      features: plan.features.join(", "),
      badge: plan.badge || "",
      highlight: plan.highlight || false,
      duration: plan.duration || "monthly",
      popular: plan.popular || false,
    });
    setEditingId(plan._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    const token = Cookies.get("token");
    try {
      await axios.delete(`${BASE_URL}/pricing-plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Plan deleted successfully!");
      setPlans(plans.filter((plan) => plan._id !== id));
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      features: "",
      badge: "",
      highlight: false,
      duration: "monthly",
      popular: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"
        ></motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-gray-600"
        >
          Loading...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <div className="text-red-500 text-xl font-bold mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            {error}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
          >
            <FiArrowLeft className="mr-2" /> Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Admin Dashboard
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            {activeTab === "pricing"
              ? ""
              : "View Order History"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("pricing")}
            className={`font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md transition-all ${
              activeTab === "pricing"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Pricing Plans
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("orders")}
            className={`font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md transition-all ${
              activeTab === "orders"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Order Management
          </motion.button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/admin/office-management">
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md transition-all">
                🏢 Office Management
              </button>
            </Link>
          </motion.div>


          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/admin/plan-management">
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md transition-all">
                🏢 Plan Management
              </button>
            </Link>
          </motion.div>


          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/admin/promocode-management">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md transition-all">
                🎟️ PromoCode Management
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {activeTab === "pricing" ? (
          <>
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 flex justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowForm(!showForm)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  {showForm ? (
                    <>
                      <FiX className="-ml-1 mr-2 h-5 w-5" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                      Add New Plan
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white shadow-xl rounded-xl overflow-hidden mb-12"
                >
                  <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-2xl leading-6 font-bold text-gray-900">
                      {editingId ? "Edit Pricing Plan" : "Create New Plan"}
                    </h3>
                  </div>
                  <div className="bg-white px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Plan Name *
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g. Professional"
                            required
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Price *
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            name="price"
                            id="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g. $29.99"
                            required
                          />
                        </div>

                        <div className="sm:col-span-6">
                          <label
                            htmlFor="features"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Features (comma separated) *
                          </label>
                          <motion.textarea
                            whileFocus={{ scale: 1.01 }}
                            id="features"
                            name="features"
                            rows={4}
                            value={formData.features}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Feature 1, Feature 2, Feature 3"
                            required
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Separate each feature with a comma
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="badge"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Badge Text
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            name="badge"
                            id="badge"
                            value={formData.badge}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g. Popular"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="duration"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Billing Duration
                          </label>
                          <motion.select
                            whileFocus={{ scale: 1.01 }}
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="lifetime">Lifetime</option>
                          </motion.select>
                        </div>

                        <div className="sm:col-span-2 flex items-end space-x-6">
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="flex items-center"
                          >
                            <input
                              id="highlight"
                              name="highlight"
                              type="checkbox"
                              checked={formData.highlight}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor="highlight"
                              className="ml-2 block text-sm text-gray-700"
                            >
                              Highlight
                            </label>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="flex items-center"
                          >
                            <input
                              id="popular"
                              name="popular"
                              type="checkbox"
                              checked={formData.popular}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor="popular"
                              className="ml-2 block text-sm text-gray-700"
                            >
                              Popular
                            </label>
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="button"
                          onClick={resetForm}
                          className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing...
                            </>
                          ) : editingId ? (
                            <>
                              <FiEdit2 className="-ml-1 mr-2 h-4 w-4" />
                              Update Plan
                            </>
                          ) : (
                            <>
                              <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                              Create Plan
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {plans.length === 0 && !showForm ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-md overflow-hidden text-center py-12"
              >
                <div className="max-w-md mx-auto">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No pricing plans found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new pricing plan.
                  </p>
                  {isAdmin && (
                    <div className="mt-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                        Add New Plan
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid gap-8 lg:grid-cols-3 md:grid-cols-2"
              >
                {plans.map((plan) => (
                  <motion.div
                    key={plan._id}
                    whileHover={{ y: -5 }}
                    className={`relative rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      plan.highlight
                        ? "ring-2 ring-yellow-400 transform hover:scale-105"
                        : ""
                    } ${plan.popular ? "border-2 border-blue-500" : ""}`}
                  >
                    {plan.popular && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-1 text-xs font-bold uppercase tracking-wide"
                      >
                        Most Popular
                      </motion.div>
                    )}
                    {plan.badge && !plan.popular && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm"
                      >
                        {plan.badge}
                      </motion.div>
                    )}
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <div className="text-center mb-6">
                        <p className="text-4xl font-extrabold text-gray-900">
                          {plan.price}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {plan.duration === "monthly"
                            ? "per month"
                            : plan.duration === "yearly"
                            ? "per year"
                            : ""}
                        </p>
                      </div>
                      <ul className="mb-8 space-y-3 flex-1">
                        {plan.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start"
                          >
                            <svg
                              className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="ml-3 text-gray-700">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>

                      {isAdmin && (
                        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-center space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(plan)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                          >
                            <FiEdit2 className="mr-1.5 h-3.5 w-3.5" /> Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(plan._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          >
                            <FiTrash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mb-6"
            >
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                placeholder="🔍 Search by email..."
                value={search}
                onChange={handleSearchChange}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  whileHover={{ y: -5 }}
                  className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transition duration-200"
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
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-2 p-2 bg-white rounded shadow border border-gray-200"
                      >
                        <p className="text-sm font-semibold">
                          📋 Plan: {item.plan}
                        </p>
                        <p className="text-sm">
                          💸 Price: ₹ {item.price.toFixed(2)}
                        </p>
                        <p className="text-sm">📅 From: {item.startDate}</p>
                        <p className="text-sm">📅 To: {item.endDate}</p>
                        <p className="text-sm">
                          ⏰ Time: {item.startTime} - {item.endTime}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex justify-center items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⬅ Prev
              </motion.button>
              <span className="text-gray-700 font-semibold">
                Page {page} of {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next ➡
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import moment from "moment";
// import {
//   FiEdit2,
//   FiTrash2,
//   FiPlus,
//   FiX,
//   FiCheck,
//   FiArrowLeft,
//   FiSearch,
// } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState("pricing");
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     features: "",
//     badge: "",
//     highlight: false,
//     duration: "monthly",
//     popular: false,
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [bookings, setBookings] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(6);
//   const [totalPages, setTotalPages] = useState(1);
//   const [search, setSearch] = useState("");
//   const [basicPlanForm, setBasicPlanForm] = useState({
//     title: "",
//     price: "",
//     category: "",
//     description: "",
//   });
//   const [showBasicPlanForm, setShowBasicPlanForm] = useState(false);
//   const [editingBasicPlanId, setEditingBasicPlanId] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = Cookies.get("token");
//       const role = sessionStorage.getItem("role");

//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       if (role === "admin") {
//         setIsAdmin(true);
//       } else {
//         router.push("/unauthorized");
//       }

//       if (activeTab === "pricing") {
//         fetchPricingPlans(token);
//       } else if (activeTab === "orders") {
//         fetchBookings(token);
//       } else if (activeTab === "basic-plans") {
//         fetchBasicPlans(token);
//       }
//     };

//     const fetchPricingPlans = async (token) => {
//       try {
//         const response = await axios.get(
//           "http://localhost:4000/api/pricing-plans",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setPlans(response.data);
//       } catch (error) {
//         console.error("Error fetching pricing plans:", error);
//         setError("Failed to fetch pricing plans. Please try again later.");
//         toast.error("Failed to load pricing plans");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchBasicPlans = async (token) => {
//       try {
//         const response = await axios.get("http://localhost:4000/api/plans", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPlans(response.data);
//       } catch (error) {
//         console.error("Error fetching basic plans:", error);
//         setError("Failed to fetch basic plans. Please try again later.");
//         toast.error("Failed to load basic plans");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchBookings = async (token) => {
//       try {
//         const response = await axios.get(
//           `http://localhost:4000/api/payment/my-all-users-bookings?page=${page}&limit=${limit}&search=${search}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (response.data.success) {
//           setBookings(response.data.data || []);
//           setTotalPages(response.data.totalPages);
//         } else {
//           setError(response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//         setError("Failed to fetch bookings. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [router, activeTab, page, limit, search]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleBasicPlanInputChange = (e) => {
//     const { name, value } = e.target;
//     setBasicPlanForm({
//       ...basicPlanForm,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     const token = Cookies.get("token");

//     try {
//       const featuresArray = formData.features
//         .split(",")
//         .map((feature) => feature.trim())
//         .filter((feature) => feature);

//       const payload = {
//         ...formData,
//         features: featuresArray,
//       };

//       let response;
//       if (editingId) {
//         response = await axios.put(
//           `http://localhost:4000/api/pricing-plans/${editingId}`,
//           payload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success("Plan updated successfully!");
//         setPlans(
//           plans.map((plan) =>
//             plan._id === editingId ? response.data.updatedPlan : plan
//           )
//         );
//       } else {
//         response = await axios.post(
//           "http://localhost:4000/api/pricing-plans",
//           payload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success("New plan created!");
//         setPlans([...plans, response.data.newPlan]);
//       }

//       resetForm();
//     } catch (error) {
//       console.error("Error saving plan:", error);
//       toast.error(error.response?.data?.message || "Failed to save plan");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBasicPlanSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     const token = Cookies.get("token");

//     try {
//       let response;
//       if (editingBasicPlanId) {
//         response = await axios.put(
//           `http://localhost:4000/api/plans/${editingBasicPlanId}`,
//           basicPlanForm,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success("Basic plan updated successfully!");
//         setPlans(
//           plans.map((plan) =>
//             plan._id === editingBasicPlanId ? response.data.updatedPlan : plan
//           )
//         );
//       } else {
//         response = await axios.post(
//           "http://localhost:4000/api/plans",
//           basicPlanForm,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success("New basic plan created!");
//         setPlans([...plans, response.data.newPlan]);
//       }

//       resetBasicPlanForm();
//     } catch (error) {
//       console.error("Error saving basic plan:", error);
//       toast.error(error.response?.data?.message || "Failed to save basic plan");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEdit = (plan) => {
//     setFormData({
//       name: plan.name,
//       price: plan.price,
//       features: plan.features.join(", "),
//       badge: plan.badge || "",
//       highlight: plan.highlight || false,
//       duration: plan.duration || "monthly",
//       popular: plan.popular || false,
//     });
//     setEditingId(plan._id);
//     setShowForm(true);
//   };

//   const handleEditBasicPlan = (plan) => {
//     setBasicPlanForm({
//       title: plan.title,
//       price: plan.price,
//       category: plan.category,
//       description: plan.description || "",
//     });
//     setEditingBasicPlanId(plan._id);
//     setShowBasicPlanForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this plan?")) return;

//     const token = Cookies.get("token");
//     try {
//       await axios.delete(`http://localhost:4000/api/pricing-plans/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Plan deleted successfully!");
//       setPlans(plans.filter((plan) => plan._id !== id));
//     } catch (error) {
//       console.error("Error deleting plan:", error);
//       toast.error("Failed to delete plan");
//     }
//   };

//   const handleDeleteBasicPlan = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this basic plan?"))
//       return;

//     const token = Cookies.get("token");
//     try {
//       await axios.delete(`http://localhost:4000/api/plans/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Basic plan deleted successfully!");
//       setPlans(plans.filter((plan) => plan._id !== id));
//     } catch (error) {
//       console.error("Error deleting basic plan:", error);
//       toast.error("Failed to delete basic plan");
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       price: "",
//       features: "",
//       badge: "",
//       highlight: false,
//       duration: "monthly",
//       popular: false,
//     });
//     setEditingId(null);
//     setShowForm(false);
//   };

//   const resetBasicPlanForm = () => {
//     setBasicPlanForm({
//       title: "",
//       price: "",
//       category: "",
//       description: "",
//     });
//     setEditingBasicPlanId(null);
//     setShowBasicPlanForm(false);
//   };

//   const handlePrev = () => {
//     if (page > 1) setPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (page < totalPages) setPage((prev) => prev + 1);
//   };

//   const handleSearchChange = (e) => {
//     setSearch(e.target.value);
//     setPage(1);
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"
//         ></motion.div>
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="mt-4 text-gray-600"
//         >
//           Loading...
//         </motion.p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
//         >
//           <div className="text-red-500 text-xl font-bold mb-4">
//             <svg
//               className="w-12 h-12 mx-auto"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               ></path>
//             </svg>
//             {error}
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
//           >
//             <FiArrowLeft className="mr-2" /> Try Again
//           </motion.button>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
//             Admin Dashboard
//           </h1>
//           <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
//             {activeTab === "pricing"
//               ? "Manage Premium Pricing Plans"
//               : activeTab === "basic-plans"
//               ? "Manage Basic Plans"
//               : "View Order History"}
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="flex flex-wrap justify-center gap-4 mb-8"
//         >
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setActiveTab("pricing")}
//             className={`font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md transition-all ${
//               activeTab === "pricing"
//                 ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             Premium Plans
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setActiveTab("basic-plans")}
//             className={`font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md transition-all ${
//               activeTab === "basic-plans"
//                 ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             Basic Plans
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setActiveTab("orders")}
//             className={`font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md transition-all ${
//               activeTab === "orders"
//                 ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             Order Management
//           </motion.button>
//           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//             <Link href="/admin/office-management">
//               <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md transition-all">
//                 🏢 Office Management
//               </button>
//             </Link>
//           </motion.div>
//           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//             <Link href="/admin/promocode-management">
//               <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-md transition-all">
//                 🎟️ PromoCode Management
//               </button>
//             </Link>
//           </motion.div>
//         </motion.div>

//         {activeTab === "pricing" ? (
//           <>
//             {isAdmin && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="mb-8 flex justify-end"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.03 }}
//                   whileTap={{ scale: 0.97 }}
//                   onClick={() => setShowForm(!showForm)}
//                   className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
//                 >
//                   {showForm ? (
//                     <>
//                       <FiX className="-ml-1 mr-2 h-5 w-5" />
//                       Cancel
//                     </>
//                   ) : (
//                     <>
//                       <FiPlus className="-ml-1 mr-2 h-5 w-5" />
//                       Add New Plan
//                     </>
//                   )}
//                 </motion.button>
//               </motion.div>
//             )}

//             <AnimatePresence>
//               {showForm && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="bg-white shadow-xl rounded-xl overflow-hidden mb-12"
//                 >
//                   <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
//                     <h3 className="text-2xl leading-6 font-bold text-gray-900">
//                       {editingId ? "Edit Pricing Plan" : "Create New Plan"}
//                     </h3>
//                   </div>
//                   <div className="bg-white px-6 py-6">
//                     <form onSubmit={handleSubmit} className="space-y-8">
//                       <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
//                         <div className="sm:col-span-3">
//                           <label
//                             htmlFor="name"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Plan Name *
//                           </label>
//                           <motion.input
//                             whileFocus={{ scale: 1.01 }}
//                             type="text"
//                             name="name"
//                             id="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             placeholder="e.g. Professional"
//                             required
//                           />
//                         </div>

//                         <div className="sm:col-span-3">
//                           <label
//                             htmlFor="price"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Price *
//                           </label>
//                           <motion.input
//                             whileFocus={{ scale: 1.01 }}
//                             type="text"
//                             name="price"
//                             id="price"
//                             value={formData.price}
//                             onChange={handleInputChange}
//                             className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             placeholder="e.g. $29.99"
//                             required
//                           />
//                         </div>

//                         <div className="sm:col-span-6">
//                           <label
//                             htmlFor="features"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Features (comma separated) *
//                           </label>
//                           <motion.textarea
//                             whileFocus={{ scale: 1.01 }}
//                             id="features"
//                             name="features"
//                             rows={4}
//                             value={formData.features}
//                             onChange={handleInputChange}
//                             className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             placeholder="Feature 1, Feature 2, Feature 3"
//                             required
//                           />
//                           <p className="mt-2 text-sm text-gray-500">
//                             Separate each feature with a comma
//                           </p>
//                         </div>

//                         <div className="sm:col-span-2">
//                           <label
//                             htmlFor="badge"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Badge Text
//                           </label>
//                           <motion.input
//                             whileFocus={{ scale: 1.01 }}
//                             type="text"
//                             name="badge"
//                             id="badge"
//                             value={formData.badge}
//                             onChange={handleInputChange}
//                             className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             placeholder="e.g. Popular"
//                           />
//                         </div>

//                         <div className="sm:col-span-2">
//                           <label
//                             htmlFor="duration"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Billing Duration
//                           </label>
//                           <motion.select
//                             whileFocus={{ scale: 1.01 }}
//                             id="duration"
//                             name="duration"
//                             value={formData.duration}
//                             onChange={handleInputChange}
//                             className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                           >
//                             <option value="monthly">Monthly</option>
//                             <option value="yearly">Yearly</option>
//                             <option value="lifetime">Lifetime</option>
//                           </motion.select>
//                         </div>

//                         <div className="sm:col-span-2 flex items-end space-x-6">
//                           <motion.div
//                             whileHover={{ scale: 1.03 }}
//                             className="flex items-center"
//                           >
//                             <input
//                               id="highlight"
//                               name="highlight"
//                               type="checkbox"
//                               checked={formData.highlight}
//                               onChange={handleInputChange}
//                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label
//                               htmlFor="highlight"
//                               className="ml-2 block text-sm text-gray-700"
//                             >
//                               Highlight
//                             </label>
//                           </motion.div>
//                           <motion.div
//                             whileHover={{ scale: 1.03 }}
//                             className="flex items-center"
//                           >
//                             <input
//                               id="popular"
//                               name="popular"
//                               type="checkbox"
//                               checked={formData.popular}
//                               onChange={handleInputChange}
//                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label
//                               htmlFor="popular"
//                               className="ml-2 block text-sm text-gray-700"
//                             >
//                               Popular
//                             </label>
//                           </motion.div>
//                         </div>
//                       </div>

//                       <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
//                         <motion.button
//                           whileHover={{ scale: 1.03 }}
//                           whileTap={{ scale: 0.97 }}
//                           type="button"
//                           onClick={resetForm}
//                           className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                         >
//                           Cancel
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.03 }}
//                           whileTap={{ scale: 0.97 }}
//                           type="submit"
//                           disabled={isSubmitting}
//                           className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <svg
//                                 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <circle
//                                   className="opacity-25"
//                                   cx="12"
//                                   cy="12"
//                                   r="10"
//                                   stroke="currentColor"
//                                   strokeWidth="4"
//                                 ></circle>
//                                 <path
//                                   className="opacity-75"
//                                   fill="currentColor"
//                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                 ></path>
//                               </svg>
//                               Processing...
//                             </>
//                           ) : editingId ? (
//                             <>
//                               <FiEdit2 className="-ml-1 mr-2 h-4 w-4" />
//                               Update Plan
//                             </>
//                           ) : (
//                             <>
//                               <FiPlus className="-ml-1 mr-2 h-4 w-4" />
//                               Create Plan
//                             </>
//                           )}
//                         </motion.button>
//                       </div>
//                     </form>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {plans.length === 0 && !showForm ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 className="bg-white rounded-xl shadow-md overflow-hidden text-center py-12"
//               >
//                 <div className="max-w-md mx-auto">
//                   <svg
//                     className="mx-auto h-12 w-12 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     ></path>
//                   </svg>
//                   <h3 className="mt-2 text-lg font-medium text-gray-900">
//                     No pricing plans found
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     Get started by creating a new pricing plan.
//                   </p>
//                   {isAdmin && (
//                     <div className="mt-6">
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setShowForm(true)}
//                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <FiPlus className="-ml-1 mr-2 h-5 w-5" />
//                         Add New Plan
//                       </motion.button>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 className="grid gap-8 lg:grid-cols-3 md:grid-cols-2"
//               >
//                 {plans.map((plan) => (
//                   <motion.div
//                     key={plan._id}
//                     whileHover={{ y: -5 }}
//                     className={`relative rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg ${
//                       plan.highlight
//                         ? "ring-2 ring-yellow-400 transform hover:scale-105"
//                         : ""
//                     } ${plan.popular ? "border-2 border-blue-500" : ""}`}
//                   >
//                     {plan.popular && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-1 text-xs font-bold uppercase tracking-wide"
//                       >
//                         Most Popular
//                       </motion.div>
//                     )}
//                     {plan.badge && !plan.popular && (
//                       <motion.div
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm"
//                       >
//                         {plan.badge}
//                       </motion.div>
//                     )}
//                     <div className="p-8 flex-1 flex flex-col">
//                       <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
//                         {plan.name}
//                       </h3>
//                       <div className="text-center mb-6">
//                         <p className="text-4xl font-extrabold text-gray-900">
//                           {plan.price}
//                         </p>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {plan.duration === "monthly"
//                             ? "per month"
//                             : plan.duration === "yearly"
//                             ? "per year"
//                             : "one-time payment"}
//                         </p>
//                       </div>
//                       <ul className="mb-8 space-y-3 flex-1">
//                         {plan.features.map((feature, index) => (
//                           <motion.li
//                             key={index}
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             className="flex items-start"
//                           >
//                             <svg
//                               className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5"
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 20 20"
//                               fill="currentColor"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                             <span className="ml-3 text-gray-700">
//                               {feature}
//                             </span>
//                           </motion.li>
//                         ))}
//                       </ul>

//                       {isAdmin && (
//                         <div className="mt-6 pt-6 border-t border-gray-200 flex justify-center space-x-4">
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => handleEdit(plan)}
//                             className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
//                           >
//                             <FiEdit2 className="mr-1.5 h-3.5 w-3.5" /> Edit
//                           </motion.button>
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => handleDelete(plan._id)}
//                             className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
//                           >
//                             <FiTrash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
//                           </motion.button>
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}
//           </>
//         ) : activeTab === "basic-plans" ? (
//           <div className="space-y-6">
//             {isAdmin && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="flex justify-end"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.03 }}
//                   whileTap={{ scale: 0.97 }}
//                   onClick={() => setShowBasicPlanForm(!showBasicPlanForm)}
//                   className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
//                 >
//                   {showBasicPlanForm ? (
//                     <>
//                       <FiX className="-ml-1 mr-2 h-5 w-5" />
//                       Cancel
//                     </>
//                   ) : (
//                     <>
//                       <FiPlus className="-ml-1 mr-2 h-5 w-5" />
//                       Add New Basic Plan
//                     </>
//                   )}
//                 </motion.button>
//               </motion.div>
//             )}

//             <AnimatePresence>
//               {showBasicPlanForm && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="bg-white shadow-xl rounded-xl overflow-hidden mb-8"
//                 >
//                   <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
//                     <h3 className="text-2xl leading-6 font-bold text-gray-900">
//                       {editingBasicPlanId
//                         ? "Edit Basic Plan"
//                         : "Create New Basic Plan"}
//                     </h3>
//                   </div>
//                   <div className="bg-white px-6 py-6">
//                     <form
//                       onSubmit={handleBasicPlanSubmit}
//                       className="space-y-6"
//                     >
//                       <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
//                         <div className="sm:col-span-3">
//                           <label
//                             htmlFor="title"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Title *
//                           </label>
//                           <motion.input
//                             whileFocus={{ scale: 1.01 }}
//                             type="text"
//                             name="title"
//                             id="title"
//                             value={basicPlanForm.title}
//                             onChange={handleBasicPlanInputChange}
//                             className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             placeholder="e.g. Basic Coworking"
//                             required
//                           />
//                         </div>

//                         <div className="sm:col-span-3">
//                           <label
//                             htmlFor="price"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Price (₹) *
//                           </label>
//                           <motion.input
//                             whileFocus={{ scale: 1.01 }}
//                             type="text"
//                             name="price"
//                             value={formData.price}
//                             onChange={handleInputChange}
//                             className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             placeholder="e.g. $29.99"
//                             required
//                           />
//                         </div>

//                         <div className="sm:col-span-6">
//                           <label
//                             htmlFor="features"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Features (comma separated) *
//                           </label>
//                           <motion.textarea
//                             whileFocus={{ scale: 1.01 }}
//                             id="features"
//                             name="features"
//                             rows={4}
//                             value={formData.features}
//                             onChange={handleInputChange}
//                             className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             placeholder="Feature 1, Feature 2, Feature 3"
//                             required
//                           />
//                           <p className="mt-2 text-sm text-gray-500">
//                             Separate each feature with a comma
//                           </p>
//                         </div>

//                         <div className="sm:col-span-2">
//                           <label
//                             htmlFor="badge"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Badge Text
//                           </label>
//                           <motion.input
//                             whileFocus={{ scale: 1.01 }}
//                             type="text"
//                             name="badge"
//                             id="badge"
//                             value={formData.badge}
//                             onChange={handleInputChange}
//                             className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             placeholder="e.g. Popular"
//                           />
//                         </div>

//                         <div className="sm:col-span-2">
//                           <label
//                             htmlFor="duration"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                           >
//                             Billing Duration
//                           </label>
//                           <motion.select
//                             whileFocus={{ scale: 1.01 }}
//                             id="duration"
//                             name="duration"
//                             value={formData.duration}
//                             onChange={handleInputChange}
//                             className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                           >
//                             <option value="monthly">Monthly</option>
//                             <option value="yearly">Yearly</option>
//                             <option value="lifetime">Lifetime</option>
//                           </motion.select>
//                         </div>

//                         <div className="sm:col-span-2 flex items-end space-x-6">
//                           <motion.div
//                             whileHover={{ scale: 1.03 }}
//                             className="flex items-center"
//                           >
//                             <input
//                               id="highlight"
//                               name="highlight"
//                               type="checkbox"
//                               checked={formData.highlight}
//                               onChange={handleInputChange}
//                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label
//                               htmlFor="highlight"
//                               className="ml-2 block text-sm text-gray-700"
//                             >
//                               Highlight
//                             </label>
//                           </motion.div>
//                           <motion.div
//                             whileHover={{ scale: 1.03 }}
//                             className="flex items-center"
//                           >
//                             <input
//                               id="popular"
//                               name="popular"
//                               type="checkbox"
//                               checked={formData.popular}
//                               onChange={handleInputChange}
//                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label
//                               htmlFor="popular"
//                               className="ml-2 block text-sm text-gray-700"
//                             >
//                               Popular
//                             </label>
//                           </motion.div>
//                         </div>
//                       </div>

//                       <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
//                         <motion.button
//                           whileHover={{ scale: 1.03 }}
//                           whileTap={{ scale: 0.97 }}
//                           type="button"
//                           onClick={resetForm}
//                           className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                         >
//                           Cancel
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.03 }}
//                           whileTap={{ scale: 0.97 }}
//                           type="submit"
//                           disabled={isSubmitting}
//                           className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <svg
//                                 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <circle
//                                   className="opacity-25"
//                                   cx="12"
//                                   cy="12"
//                                   r="10"
//                                   stroke="currentColor"
//                                   strokeWidth="4"
//                                 ></circle>
//                                 <path
//                                   className="opacity-75"
//                                   fill="currentColor"
//                                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                 ></path>
//                               </svg>
//                               Processing...
//                             </>
//                           ) : editingId ? (
//                             <>
//                               <FiEdit2 className="-ml-1 mr-2 h-4 w-4" />
//                               Update Plan
//                             </>
//                           ) : (
//                             <>
//                               <FiPlus className="-ml-1 mr-2 h-4 w-4" />
//                               Create Plan
//                             </>
//                           )}
//                         </motion.button>
//                       </div>
//                     </form>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {plans.length === 0 && !showForm ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 className="bg-white rounded-xl shadow-md overflow-hidden text-center py-12"
//               >
//                 <div className="max-w-md mx-auto">
//                   <svg
//                     className="mx-auto h-12 w-12 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     ></path>
//                   </svg>
//                   <h3 className="mt-2 text-lg font-medium text-gray-900">
//                     No pricing plans found
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     Get started by creating a new pricing plan.
//                   </p>
//                   {isAdmin && (
//                     <div className="mt-6">
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setShowForm(true)}
//                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <FiPlus className="-ml-1 mr-2 h-5 w-5" />
//                         Add New Plan
//                       </motion.button>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 className="grid gap-8 lg:grid-cols-3 md:grid-cols-2"
//               >
//                 {plans.map((plan) => (
//                   <motion.div
//                     key={plan._id}
//                     whileHover={{ y: -5 }}
//                     className={`relative rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg ${
//                       plan.highlight
//                         ? "ring-2 ring-yellow-400 transform hover:scale-105"
//                         : ""
//                     } ${plan.popular ? "border-2 border-blue-500" : ""}`}
//                   >
//                     {plan.popular && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-1 text-xs font-bold uppercase tracking-wide"
//                       >
//                         Most Popular
//                       </motion.div>
//                     )}
//                     {plan.badge && !plan.popular && (
//                       <motion.div
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm"
//                       >
//                         {plan.badge}
//                       </motion.div>
//                     )}
//                     <div className="p-8 flex-1 flex flex-col">
//                       <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
//                         {plan.name}
//                       </h3>
//                       <div className="text-center mb-6">
//                         <p className="text-4xl font-extrabold text-gray-900">
//                           {plan.price}
//                         </p>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {plan.duration === "monthly"
//                             ? "per month"
//                             : plan.duration === "yearly"
//                             ? "per year"
//                             : "one-time payment"}
//                         </p>
//                       </div>
//                       <ul className="mb-8 space-y-3 flex-1">
//                         {plan.features.map((feature, index) => (
//                           <motion.li
//                             key={index}
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             className="flex items-start"
//                           >
//                             <svg
//                               className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5"
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 20 20"
//                               fill="currentColor"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                             <span className="ml-3 text-gray-700">
//                               {feature}
//                             </span>
//                           </motion.li>
//                         ))}
//                       </ul>

//                       {isAdmin && (
//                         <div className="mt-6 pt-6 border-t border-gray-200 flex justify-center space-x-4">
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => handleEdit(plan)}
//                             className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
//                           >
//                             <FiEdit2 className="mr-1.5 h-3.5 w-3.5" /> Edit
//                           </motion.button>
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => handleDelete(plan._id)}
//                             className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
//                           >
//                             <FiTrash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
//                           </motion.button>
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}
//           </div>
//         ) : activeTab === "basic-plans" ? (
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
//               <h2 className="text-xl font-semibold text-gray-800">
//                 Basic Plans Management
//               </h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Title
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Price
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Category
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Created At
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {plans.map((plan) => (
//                     <motion.tr
//                       key={plan._id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
//                       className="transition-colors duration-150"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {plan.title}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         ₹{plan.price}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
//                         {plan.category}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {moment(plan.createdAt).format("DD MMM YYYY, hh:mm A")}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex justify-end space-x-2">
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="text-indigo-600 hover:text-indigo-900"
//                           >
//                             <FiEdit2 className="h-5 w-5" />
//                           </motion.button>
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             <FiTrash2 className="h-5 w-5" />
//                           </motion.button>
//                         </div>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="flex justify-center mb-6"
//             >
//               <div className="relative w-full max-w-md">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiSearch className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <motion.input
//                   whileFocus={{ scale: 1.01 }}
//                   type="text"
//                   placeholder="Search by email..."
//                   value={search}
//                   onChange={handleSearchChange}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 sm:text-sm"
//                 />
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//             >
//               {bookings.map((booking) => (
//                 <motion.div
//                   key={booking._id}
//                   whileHover={{ y: -5 }}
//                   className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transition duration-200"
//                 >
//                   <h2 className="text-md font-bold text-gray-900 mb-1">
//                     🆔 Booking ID:{" "}
//                     <span className="text-blue-700">{booking._id}</span>
//                   </h2>
//                   <p className="text-sm text-gray-700">
//                     👤 Email:{" "}
//                     <span className="text-blue-600 font-medium">
//                       {booking.userId?.email || "Unknown"}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-700">
//                     💰 Total:{" "}
//                     <span className="text-green-600 font-bold">
//                       ₹ {booking.totalAmount.toFixed(2)}
//                     </span>
//                   </p>
//                   <p className="text-sm font-medium">
//                     📌 Status:{" "}
//                     <span
//                       className={
//                         booking.paymentStatus === "Completed"
//                           ? "text-green-600 font-semibold"
//                           : "text-red-500 font-semibold"
//                       }
//                     >
//                       {booking.paymentStatus}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     🕒 {new Date(booking.createdAt).toLocaleString()}
//                   </p>

//                   <div className="mt-3 bg-gray-50 p-3 rounded border">
//                     <h3 className="text-sm font-bold mb-2 text-gray-800">
//                       🛒 Cart Items
//                     </h3>
//                     {booking.cartItems.map((item) => (
//                       <motion.div
//                         key={item._id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="mb-2 p-2 bg-white rounded shadow border border-gray-200"
//                       >
//                         <p className="text-sm font-semibold">
//                           📋 Plan: {item.plan}
//                         </p>
//                         <p className="text-sm">
//                           💸 Price: ₹ {item.price.toFixed(2)}
//                         </p>
//                         <p className="text-sm">📅 From: {item.startDate}</p>
//                         <p className="text-sm">📅 To: {item.endDate}</p>
//                         <p className="text-sm">
//                           ⏰ Time: {item.startTime} - {item.endTime}
//                         </p>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* Pagination */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5 }}
//               className="mt-10 flex justify-center items-center gap-4"
//             >
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handlePrev}
//                 disabled={page === 1}
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 ⬅ Prev
//               </motion.button>
//               <span className="text-gray-700 font-semibold">
//                 Page {page} of {totalPages}
//               </span>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleNext}
//                 disabled={page === totalPages}
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next ➡
//               </motion.button>
//             </motion.div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
