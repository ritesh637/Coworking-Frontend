

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BiBuilding,
  BiCalendar,
  BiTime,
  BiWallet,
  BiHome,
  BiChevronRight,
} from "react-icons/bi";
import { FiCheckCircle, FiAlertCircle, FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import axios from "axios";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const officeLocations = [
  {
    id: "1907",
    name: "1907 Pro-Coworking",
    address: "Kamdhenu Commerz, Sector 14, Kharghar, Navi Mumbai",
    image:
      "https://visionspaces.co/wp-content/uploads/2024/04/559X373px_Boutique-office_Image-4-copy.webp",
    amenities: [
      "High-speed WiFi",
      "Private Cabins",
      "Lounge Area",
      "Conference Rooms",
    ],
    operatingHours: "9 AM - 9 PM",
  },
  {
    id: "1910",
    name: "1910 Pro-Coworking",
    address: "Kamdhenu Commerz, Sector 14, Kharghar, Navi Mumbai",
    image:
      "https://images.unsplash.com/photo-1666718623430-da207b018ea3?q=80&w=2110&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    amenities: [
      "High-speed WiFi",
      "Meeting Rooms",
      "Coffee Bar",
      "Printing Facility",
    ],
    operatingHours: "9 AM - 9 PM",
  },
];

export default function PlanBookingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  const [selectedOffice, setSelectedOffice] = useState(officeLocations[0]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/plans");
        setPlans(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const convertTo12Hour = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const period = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const getBookingDays = (start, end) => {
    if (!start || !end) return 0;
    const timeDiff = end - start;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 1;
  };

  const calculateBookingTotal = () => {
    if (!selectedPlan) return 0;

    if (selectedCategory === "hourly") {
      if (!startTime || !endTime) return 0;

      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const startDateObj = new Date();
      startDateObj.setHours(startHour, startMinute);

      const endDateObj = new Date();
      endDateObj.setHours(endHour, endMinute);

      // Handle overnight case
      if (endDateObj < startDateObj) {
        endDateObj.setDate(endDateObj.getDate() + 1);
      }

      const diffMs = endDateObj - startDateObj;
      const hours = Math.ceil(diffMs / (1000 * 60 * 60));
      return selectedPlan.price * hours;
    }

    // For monthly plans, return the price directly without multiplying by days
    if (selectedCategory === "monthly") {
      return selectedPlan.price;
    }

    // For daily plans, calculate based on days
    const days = getBookingDays(startDate, endDate);
    return selectedPlan.price * days;
  };

  const handleAddToCart = () => {
    const newErrors = {};
    if (!selectedPlan) newErrors.selectedPlan = "Please select a plan.";
    if (!startDate) newErrors.startDate = "Start date is required.";

    // Only require end date for daily plans
    if (!endDate && selectedCategory === "daily")
      newErrors.endDate = "End date is required.";
    if (!startTime && selectedCategory === "hourly")
      newErrors.startTime = "Start time is required.";
    if (!endTime && selectedCategory === "hourly")
      newErrors.endTime = "End time is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    // For monthly plans, automatically set end date to 30 days later
    let end = new Date(startDate);
    if (selectedCategory === "monthly") {
      end.setDate(end.getDate() + 30);
      setEndDate(end);
    } else if (selectedCategory === "daily") {
      end = new Date(endDate);
    } else {
      // For hourly plans, use start date as end date
      end = new Date(startDate);
    }
    end.setHours(0, 0, 0, 0);

    if (start < today || (end && end < today)) {
      setShowToast({
        type: "error",
        message: "Back date booking is not allowed.",
      });
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // For monthly plans, check if duration exceeds 31 days
    if (selectedCategory === "monthly") {
      const totalDays = getBookingDays(startDate, end);
      if (totalDays > 31) {
        setShowToast({
          type: "error",
          message: "Monthly plans can be booked for up to 30 days only.",
        });
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }

    // Calculate hours for hourly plans
    let hours = 0;
    if (selectedCategory === "hourly") {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const startDateObj = new Date(startDate);
      startDateObj.setHours(startHour, startMinute);

      const endDateObj = new Date(startDate);
      endDateObj.setHours(endHour, endMinute);

      // Handle overnight case
      if (endDateObj < startDateObj) {
        endDateObj.setDate(endDateObj.getDate() + 1);
      }

      const diffMs = endDateObj - startDateObj;
      hours = Math.ceil(diffMs / (1000 * 60 * 60));
    }

    const bookingDays =
      selectedCategory === "hourly" ? 1 : getBookingDays(startDate, end);
    const bookingHours = selectedCategory === "hourly" ? hours : null;

    const bookingTotal = calculateBookingTotal();

    addToCart({
      id: `${selectedPlan._id}-${Date.now()}`,
      plan: `${selectedPlan.title} (${selectedCategory})`,
      location: selectedOffice.name,
      price: bookingTotal,
      dailyRate: selectedPlan.price,
      startDate: formatDate(startDate),
      endDate:
        selectedCategory === "hourly" ? formatDate(startDate) : formatDate(end),
      startTime:
        selectedCategory === "hourly" ? convertTo12Hour(startTime) : "",
      endTime: selectedCategory === "hourly" ? convertTo12Hour(endTime) : "",
      bookingDays: bookingDays,
      bookingHours: bookingHours,
      image: selectedPlan.image || "/workspace-default.jpg",
    });

    setErrors({});
    setShowToast({
      type: "success",
      message: "✅ Added to your cart!",
    });

    setTimeout(() => {
      setShowToast(false);
      router.push("/cart");
    }, 3000);
  };

  const bookingDays = getBookingDays(startDate, endDate);
  const bookingTotal = calculateBookingTotal();

  const filteredPlans = plans.filter(
    (plan) => plan.category === selectedCategory
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-200 rounded-full mb-4"></div>
          <div className="h-4 bg-indigo-200 rounded w-48"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                <BiHome className="w-4 h-4 mr-2" />
                Home
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <BiChevronRight className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Book Workspace
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Workspace Image Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 border-b">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Office Location
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {officeLocations.map((office) => (
                    <button
                      key={office.id}
                      onClick={() => setSelectedOffice(office)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center ${
                        selectedOffice.id === office.id
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <BiBuilding className="w-4 h-4 mr-2" />
                      {office.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative h-80 sm:h-96">
                <Image
                  src={selectedOffice.image}
                  alt={selectedOffice.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedOffice.name}
                    </h2>
                    <p className="text-gray-200 mt-1">
                      {selectedOffice.address}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedOffice.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-3 py-1 bg-indigo-600/80 text-white text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-50 rounded-lg mr-4">
                      <BiBuilding className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Address
                      </h3>
                      <p className="text-gray-900 font-medium">
                        {selectedOffice.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-50 rounded-lg mr-4">
                      <BiTime className="text-purple-600 text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Operating Hours
                      </h3>
                      <p className="text-gray-900 font-medium">
                        {selectedOffice.operatingHours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedOffice.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <FiCheckCircle className="text-green-500 mr-2" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 h-fit sticky top-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BiCalendar className="text-indigo-600 mr-2" />
              Book Your Spot
            </h3>

            <div className="space-y-6">
              {/* Plan Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["monthly", "daily", "hourly"].map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedPlan(null);
                        setStartDate(null);
                        setEndDate(null);
                        setStartTime("");
                        setEndTime("");
                      }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Selection */}
              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Plan
                  </label>
                  <select
                    className={`w-full p-3 border ${
                      errors.selectedPlan ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    value={selectedPlan?._id || ""}
                    onChange={(e) => {
                      const plan = plans.find((p) => p._id === e.target.value);
                      setSelectedPlan(plan);
                    }}
                  >
                    <option value="">-- Choose Plan --</option>
                    {filteredPlans.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.title} - ₹{plan.price}
                        {selectedCategory === "hourly"
                          ? "/hour"
                          : selectedCategory === "daily"
                          ? "/day"
                          : "/month"}
                      </option>
                    ))}
                  </select>
                  {errors.selectedPlan && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.selectedPlan}
                    </p>
                  )}
                </div>
              )}

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  {selectedCategory === "monthly" ? (
                    <div className="relative">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          if (date) {
                            const endDate = new Date(date);
                            endDate.setDate(endDate.getDate() + 30);
                            setEndDate(endDate);
                          }
                        }}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        className={`w-full p-3 border ${
                          errors.startDate
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholderText="Select start date"
                      />
                      <BiCalendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="relative">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        className={`w-full p-3 border ${
                          errors.startDate
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholderText="Select start date"
                      />
                      <BiCalendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  )}
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                {selectedCategory === "daily" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || new Date()}
                        dateFormat="dd/MM/yyyy"
                        className={`w-full p-3 border ${
                          errors.endDate ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholderText="Select end date"
                      />
                      <BiCalendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Time Selection (Hourly Only) */}
              {selectedCategory === "hourly" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        className={`w-full p-3 border ${
                          errors.startTime
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                      <BiTime className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.startTime && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.startTime}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        className={`w-full p-3 border ${
                          errors.endTime ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                      <BiTime className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.endTime && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.endTime}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Booking Summary */}
              {selectedPlan && startDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="bg-indigo-50 rounded-xl p-4 border border-indigo-100"
                >
                  <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
                    <BiWallet className="mr-2" />
                    Booking Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">
                        {selectedPlan.title} ({selectedCategory})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium">
                        ₹{selectedPlan.price}
                        {selectedCategory === "hourly"
                          ? "/hour"
                          : selectedCategory === "daily"
                          ? "/day"
                          : "/month"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dates:</span>
                      <span className="font-medium">
                        {formatDate(startDate)}
                        {selectedCategory === "daily" &&
                          ` → ${formatDate(endDate)}`}
                      </span>
                    </div>
                    {selectedCategory === "hourly" && startTime && endTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {convertTo12Hour(startTime)} →{" "}
                          {convertTo12Hour(endTime)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {selectedCategory === "hourly"
                          ? `${bookingTotal / selectedPlan.price} hour${
                              bookingTotal / selectedPlan.price > 1 ? "s" : ""
                            }`
                          : selectedCategory === "monthly"
                          ? "1 month"
                          : `${bookingDays} day${bookingDays > 1 ? "s" : ""}`}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 mt-2 border-t border-indigo-100">
                      <span className="text-gray-600">Total Price:</span>
                      <span className="font-bold text-lg text-indigo-700">
                        ₹{bookingTotal}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !selectedPlan ||
                  !startDate ||
                  (selectedCategory === "daily" && !endDate) ||
                  (selectedCategory === "hourly" && (!startTime || !endTime))
                }
              >
                <FiShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${
              showToast.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center`}
          >
            {showToast.type === "success" ? (
              <FiCheckCircle className="mr-2 text-xl" />
            ) : (
              <FiAlertCircle className="mr-2 text-xl" />
            )}
            {showToast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
