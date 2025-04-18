"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiBuilding } from "react-icons/bi";
import { useParams } from "next/navigation";
import { useCart } from "@/lib/CartContext";

const plans = {
  monthly: [
    { title: "Single Desk Reception Zone", price: "₹5999" },
    { title: "Single Desk Reflection Zone", price: "₹6999" },
    { title: "Single Desk Window Facing", price: "₹7999" },
    { title: "3 Seater Cabin Single Row", price: "₹12000" },
    { title: "3 Seater Cabin Window Facing", price: "₹25000" },
    { title: "4 Seater Cabin Master Cabin", price: "₹32000" },
  ],
  daily: [
    { title: "Single Desk Reception Zone", price: "₹599" },
    { title: "Single Desk Reflection Zone", price: "₹699" },
    { title: "Single Desk Window Facing", price: "₹799" },
    { title: "3 Seater Cabin Single Row", price: "₹1500" },
    { title: "3 Seater Cabin Window Facing", price: "₹1800" },
    { title: "4 Seater Cabin Master Cabin", price: "₹2500" },
  ],
  hourly: [
    { title: "Single Desk Reception Zone", price: "₹199" },
    { title: "Single Desk Reflection Zone", price: "₹299" },
    { title: "Single Desk Window Facing", price: "₹399" },
    { title: "Cabin Subject to Availability", price: "₹599" },
  ],
};

export default function OfficeDetailsPage() {
  const params = useParams();
  const { id } = params;

  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:4000/api/office/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOffice(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching office details:", error);
        setLoading(false);
      });
  }, [id]);

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
    const [year, month, day] = date.split("-");
    return `${parseInt(day)}/${parseInt(month)}/${year}`;
  };

  const calculateTotalPrice = () => {
    if (!selectedPlan) return 0;
    const plan = plans[selectedCategory]?.find((p) => p.title === selectedPlan);
    if (!plan) return 0;
    const planPrice = parseInt(plan.price.replace("₹", ""), 10);
    let totalPrice = 0;

    if (selectedCategory === "hourly" && startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}`);
      const end = new Date(`1970-01-01T${endTime}`);
      const totalHours = (end - start) / (1000 * 60 * 60);
      if (totalHours > 0) totalPrice = planPrice * totalHours;
    } else if (selectedCategory === "daily" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (totalDays > 0) totalPrice = planPrice * totalDays;
    } else if (selectedCategory === "monthly" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (totalDays > 31) return -1; // flag invalid monthly range
      if (totalDays > 0) totalPrice = planPrice;
    }
    return totalPrice;
  };

  const handleAddToCart = () => {
    const newErrors = {};
    if (!selectedPlan) newErrors.selectedPlan = "Please select a plan.";
    if (!startDate) newErrors.startDate = "Start date is required.";
    if (!endDate) newErrors.endDate = "End date is required.";
    if (!startTime && selectedCategory === "hourly")
      newErrors.startTime = "Start time is required.";
    if (!endTime && selectedCategory === "hourly")
      newErrors.endTime = "End time is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Date validations
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start < today || end < today) {
      alert("Back date booking is not allowed.");
      return;
    }

    // For monthly category, check booking period is within 30 days
    if (selectedCategory === "monthly") {
      const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (totalDays > 31) {
        alert("Monthly plans can be booked for up to 30 days only.");
        return;
      }
    }

    // Calculate total price based on duration
    const totalPrice = calculateTotalPrice();
    if (
      selectedCategory === "hourly" ||
      selectedCategory === "daily" ||
      selectedCategory === "monthly"
    ) {
      if (totalPrice <= 0) {
        alert(
          "Please check the time/date inputs. The booking duration must be positive."
        );
        return;
      }
      // For monthly, -1 indicates booking period exceeds 30 days
      if (totalPrice === -1) {
        alert("Monthly plans can be booked for up to 30 days only.");
        return;
      }
    }

    addToCart({
      plan: `${selectedPlan} (${selectedCategory})`,
      price: totalPrice,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      startTime:
        selectedCategory === "hourly" ? convertTo12Hour(startTime) : "",
      endTime: selectedCategory === "hourly" ? convertTo12Hour(endTime) : "",
    });

    setErrors({});
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const totalCalculatedPrice = calculateTotalPrice();

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">
        Loading office details...
      </p>
    );
  if (!office)
    return <p className="text-center text-red-500">Office not found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-gray-100 to-white relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="md:col-span-2 bg-white p-6 sm:p-8 shadow-xl rounded-2xl">
          <motion.img
            src={office.image || "/fallback.jpg"}
            alt={office.name}
            className="w-full h-80 object-cover rounded-xl shadow-md"
          />
          <h1 className="text-3xl font-bold mt-6 text-gray-800">
            {office.name}
          </h1>
          <p className="text-gray-600 mt-4 text-lg">{office.description}</p>
        </div>

        <div className="bg-white p-6 sm:p-8 shadow-xl rounded-2xl">
          <h3 className="text-2xl font-semibold mb-6 text-black">
            🛒 Book Your Spot
          </h3>

          <label className="block mb-2 text-black font-medium">
            Select Plan Category:
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedPlan("");
            }}
          >
            <option value="">-- Choose Category --</option>
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
            <option value="hourly">Hourly</option>
          </select>

          {selectedCategory && (
            <>
              <label className="block mb-2 text-black font-medium">
                Select Plan:
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
              >
                <option value="">-- Choose Plan --</option>
                {plans[selectedCategory].map((plan) => (
                  <option key={plan.title} value={plan.title}>
                    {plan.title} - {plan.price}
                  </option>
                ))}
              </select>
              {errors.selectedPlan && (
                <p className="text-red-500 text-sm">{errors.selectedPlan}</p>
              )}
            </>
          )}

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block font-medium">Start Date</label>
              <input
                type="date"
                className="w-full p-2 mt-1 border rounded-lg"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={todayStr}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block font-medium">End Date</label>
              <input
                type="date"
                className="w-full p-2 mt-1 border rounded-lg"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={todayStr}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.endDate}</p>
              )}
            </div>
          </div>

          {selectedCategory === "hourly" && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block font-medium">Start Time</label>
                <input
                  type="time"
                  className="w-full p-2 mt-1 border rounded-lg"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm">{errors.startTime}</p>
                )}
              </div>
              <div>
                <label className="block font-medium">End Time</label>
                <input
                  type="time"
                  className="w-full p-2 mt-1 border rounded-lg"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm">{errors.endTime}</p>
                )}
              </div>
            </div>
          )}

          {selectedPlan && startDate && endDate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-gray-100 p-4 rounded-lg border border-gray-300"
            >
              <p className="text-gray-800 font-semibold mb-1">
                Booking Summary:
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  📝 Plan: {selectedPlan} ({selectedCategory})
                </p>
                <p>
                  📅 {formatDate(startDate)} → {formatDate(endDate)}
                </p>
                {selectedCategory === "hourly" && startTime && endTime && (
                  <p>
                    ⏱️ {convertTo12Hour(startTime)} → {convertTo12Hour(endTime)}
                  </p>
                )}
                {totalCalculatedPrice > 0 && (
                  <p>💰 Total Price: ₹{totalCalculatedPrice}</p>
                )}
              </div>
            </motion.div>
          )}

          <button
            onClick={handleAddToCart}
            className="mt-15 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-x8 font-semibold hover:scale-105 transition-transform"
          >
            ➕ Add to Cart
          </button>
        </div>
      </motion.div>

      <motion.div
        className="mt-12 bg-white p-6 shadow-xl rounded-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 mb-3">
          <BiBuilding /> Office Info
        </h2>
        <p className="text-gray-700 text-base mb-2">
          📍 Address:{" "}
          {office.address || "Kamdhenu Commerz, Kharghar, Navi Mumbai"}
        </p>
        <p className="text-gray-700 text-base">
          ⏰ Operating Hours: {office.operatingHours || "9 AM - 9 PM"}
        </p>
      </motion.div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50"
          >
            ✅ Added to your cart!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
