"use client";
import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BiBuilding,
  BiCalendar,
  BiTime,
  BiWallet,
  BiHome,
  BiChevronRight,
  BiStar,
  BiMap,
} from "react-icons/bi";
import { FiCheckCircle, FiAlertCircle, FiShoppingCart } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import axios from "axios";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PlanBookingPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch office details
        const officeRes = await axios.get(
          `http://localhost:4000/api/office/${id}`
        );
        setOffice(officeRes.data);

        const plansRes = await axios.get(
          `http://localhost:4000/api/plans/office/${id}`
        );
        setPlans(plansRes.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
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
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
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
    if (!office) newErrors.office = "Office details not loaded.";

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
      location: office.name,
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
      image: office.image || "/workspace-default.jpg",
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

  const amenities = [
    { name: "ʜɪɢʜ-ꜱᴘᴇᴇᴅ ᴡɪ-ꜰɪ", emoji: "📶" },
    { name: "ᴄᴏᴍꜰᴏʀᴛᴀʙʟᴇ ꜱᴇᴀᴛɪɴɢ", emoji: "🪑" },
    { name: "ᴍᴇᴇᴛɪɴɢ ʀᴏᴏᴍꜱ", emoji: "👥" },
    { name: "ᴘʀɪᴠᴀᴛᴇ ᴄᴀʙɪɴꜱ", emoji: "🚪" },
    { name: "ᴄᴄᴛᴠ ꜱᴜʀᴠᴇɪʟʟᴀɴᴄᴇ", emoji: "📹" },
    { name: "ᴘᴀʀᴋɪɴɢ ᴀᴠᴀɪʟᴀʙʟᴇ", emoji: "🅿️" },
    { name: "ɴᴇᴀʀ ᴍᴇᴛʀᴏ ꜱᴛᴀᴛɪᴏɴ", emoji: "🚇" },
    { name: "24/7 ᴀᴄᴄᴇꜱꜱ", emoji: "⏰" },
    { name: "ᴀɪʀ ᴄᴏɴᴅɪᴛɪᴏɴɪɴɢ", emoji: "❄️" },
    { name: "ᴘʀɪɴᴛɪɴɢ ꜰᴀᴄɪʟɪᴛɪᴇꜱ", emoji: "🖨️" },
    { name: "ᴄᴏꜰꜰᴇᴇ/ᴛᴇᴀ", emoji: "☕" },
    { name: "ʟᴏᴜɴɢᴇ ᴀʀᴇᴀ", emoji: "🛋️" },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-200 rounded-full mb-4"></div>
          <div className="h-4 bg-indigo-200 rounded w-48"></div>
        </div>
      </div>
    );

  if (!office) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">
            Office not found
          </h2>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <BiHome className="w-4 h-4 mr-2" />
                Home
              </button>
            </li>

            <li>
              <div className="flex items-center">
                <IoIosArrowForward className="w-4 h-4 text-gray-400 mx-1" />
                <span className="ml-1 text-sm font-medium text-gray-500">
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative h-80 sm:h-96 w-full">
                <Image
                  src={office.image || "/workspace-default.jpg"}
                  alt={office.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {office.name}
                    </h2>
                    <div className="flex items-center mt-1 text-gray-200">
                      <p className="text-sm">{office.address}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {office.amenities?.slice(0, 5).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {office.amenities?.length > 5 && (
                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                          +{office.amenities.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ᴀʙᴏᴜᴛ ᴛʜɪꜱ ᴡᴏʀᴋꜱᴘᴀᴄᴇ
                </h3>
                <p className="text-gray-600 mb-6">
                  {office.description ||
                    "This premium workspace offers a professional environment with all the amenities you need to be productive. Enjoy high-speed internet, comfortable seating, and access to meeting rooms when you need them."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Operating Hours */}
                  <div className="flex items-start">
                    <div className="p-2.5 bg-purple-50 rounded-lg mr-3 text-purple-600">
                      <BiTime className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                      ᴏᴘᴇʀᴀᴛɪɴɢ ʜᴏᴜʀꜱ
                      </h3>
                      <p className="text-gray-900 font-medium">
                        {office.operatingHours || "9 ᴀᴍ - 9 ᴘᴍ"}
                      </p>
                    </div>
                  </div>

                  {/* Starting Price */}
                  <div className="flex items-start">
                    <div className="p-2.5 bg-orange-50 rounded-lg mr-3 text-orange-600">
                      <BiWallet className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                      ꜱᴛᴀʀᴛɪɴɢ ᴘʀɪᴄᴇ ꜰʀᴏᴍ
                      </h3>
                      <p className="text-gray-900 font-medium">
                        ₹
                        {plans.length > 0
                          ? Math.min(...plans.map((p) => p.price))
                          : "--"}
                        /ʜᴏᴜʀ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🏢</span>
                ᴀᴍᴇɴɪᴛɪᴇꜱ & ꜰᴀᴄɪʟɪᴛɪᴇꜱ
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {amenities.map((amenity) => (
                  <div
                    key={amenity.name}
                    className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-indigo-50 transition-colors"
                  >
                    <span className="text-lg mr-2">{amenity.emoji}</span>
                    <span className="text-gray-700 text-sm truncate">
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Plans Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">💰</span>
                ᴘʀɪᴄɪɴɢ ᴘʟᴀɴꜱ
              </h2>

              <div className="space-y-8">
                {/* Hourly Plans */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3 flex items-center">
                    <span className="mr-2">⏱️</span>
                    ʜᴏᴜʀʟʏ ᴘʟᴀɴꜱ
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                          >
                            Plan
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                          >
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {plans
                          .filter((plan) => plan.category === "hourly")
                          .map((plan) => (
                            <tr key={plan._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                                {plan.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                ₹{plan.price}/hour
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                <div className="flex flex-wrap gap-1">
                                  {plan.features?.map((feature, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Daily Plans */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3 flex items-center">
                    <span className="mr-2">📅</span>
                    ᴅᴀɪʟʏ ᴘʟᴀɴꜱ
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                          >
                            Plan
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                          >
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {plans
                          .filter((plan) => plan.category === "daily")
                          .map((plan) => (
                            <tr key={plan._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                                {plan.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                ₹{plan.price}/day
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                <div className="flex flex-wrap gap-1">
                                  {plan.features?.map((feature, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Monthly Plans */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🏢</span>
                    ᴍᴏɴᴛʜʟʏ ᴘʟᴀɴꜱ
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                          >
                            Plan
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                          >
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {plans
                          .filter((plan) => plan.category === "monthly")
                          .map((plan) => (
                            <tr key={plan._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                                {plan.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                ₹{plan.price}/month
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                <div className="flex flex-wrap gap-1">
                                  {plan.features?.map((feature, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📅</span>
              ʙᴏᴏᴋ ʏᴏᴜʀ ꜱᴘᴏᴛ
            </h3>

            <div className="space-y-6">
              {/* Plan Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ᴘʟᴀɴ ᴄᴀᴛᴇɢᴏʀʏ
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "hourly", emoji: "", label: "ʜᴏᴜʀʟʏ" },
                    { value: "daily", emoji: "", label: "ᴅᴀɪʟʏ" },
                    { value: "monthly", emoji: "", label: "ᴍᴏɴᴛʜʟʏ" },
                  ].map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        setSelectedCategory(category.value);
                        setSelectedPlan(null);
                        setStartDate(null);
                        setEndDate(null);
                        setStartTime("");
                        setEndTime("");
                        setErrors({}); // Clear errors when changing category
                      }}
                      className={`py-2 px-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                        selectedCategory === category.value
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="mr-1">{category.emoji}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
                {errors.selectedCategory && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.selectedCategory}
                  </p>
                )}
              </div>

              {/* Plan Selection */}
              {selectedCategory ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ꜱᴇʟᴇᴄᴛ ᴘʟᴀɴ
                  </label>
                  <div className="relative">
                    <select
                      className={`w-full p-3 border ${
                        errors.selectedPlan
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none`}
                      value={selectedPlan?._id || ""}
                      onChange={(e) => {
                        const plan = plans.find(
                          (p) => p._id === e.target.value
                        );
                        setSelectedPlan(plan);
                        if (errors.selectedPlan) {
                          setErrors({ ...errors, selectedPlan: undefined });
                        }
                      }}
                    >
                      <option value="">ᴄʜᴏᴏꜱᴇ ᴘʟᴀɴ</option>
                      {filteredPlans.map((plan) => (
                        <option key={plan._id} value={plan._id}>
                          {plan.title} - ₹{plan.price.toLocaleString()}
                          {selectedCategory === "hourly"
                            ? "/hour"
                            : selectedCategory === "daily"
                            ? "/day"
                            : "/month"}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.selectedPlan && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.selectedPlan}
                    </p>
                  )}
                </div>
              ) : (
                errors.selectedCategory && (
                  <p className="text-sm text-red-600">
                    ᴘʟᴇᴀꜱᴇ ꜱᴇʟᴇᴄᴛ ᴀ ᴘʟᴀɴ ᴄᴀᴛᴇɢᴏʀʏ ꜰɪʀꜱᴛ
                  </p>
                )
              )}

              {/* Date Selection */}
              {selectedPlan && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ꜱᴛᴀʀᴛ ᴅᴀᴛᴇ
                    </label>
                    {selectedCategory === "monthly" ? (
                      <div className="relative">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => {
                            setStartDate(date);
                            if (errors.startDate) {
                              setErrors({ ...errors, startDate: undefined });
                            }
                            if (date) {
                              const endDate = new Date(date);
                              endDate.setDate(endDate.getDate() + 30);
                              setEndDate(endDate);
                            }
                          }}
                          minDate={new Date()}
                          dateFormat="dd MMM yyyy"
                          className={`w-full p-3 border ${
                            errors.startDate
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10`}
                          placeholderText="Select date"
                        />
                        <BiCalendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                      </div>
                    ) : (
                      <div className="relative">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => {
                            setStartDate(date);
                            if (errors.startDate) {
                              setErrors({ ...errors, startDate: undefined });
                            }
                          }}
                          minDate={new Date()}
                          dateFormat="dd MMM yyyy"
                          className={`w-full p-3 border ${
                            errors.startDate
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10`}
                          placeholderText="Select date"
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
                        ᴇɴᴅ ᴅᴀᴛᴇ
                      </label>
                      <div className="relative">
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => {
                            setEndDate(date);
                            if (errors.endDate) {
                              setErrors({ ...errors, endDate: undefined });
                            }
                          }}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate || new Date()}
                          dateFormat="dd MMM yyyy"
                          className={`w-full p-3 border ${
                            errors.endDate
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10`}
                          placeholderText="Select date"
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
              )}

              {/* Time Selection (Hourly Only) */}
              {selectedCategory === "hourly" && selectedPlan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ꜱᴛᴀʀᴛ ᴛɪᴍᴇ
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
                        onChange={(e) => {
                          setStartTime(e.target.value);
                          if (errors.startTime) {
                            setErrors({ ...errors, startTime: undefined });
                          }
                        }}
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
                      ᴇɴᴅ ᴛɪᴍᴇ
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        className={`w-full p-3 border ${
                          errors.endTime ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        value={endTime}
                        onChange={(e) => {
                          setEndTime(e.target.value);
                          if (errors.endTime) {
                            setErrors({ ...errors, endTime: undefined });
                          }
                        }}
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
                    <span className="mr-2">💰</span>
                    ʙᴏᴏᴋɪɴɢ ꜱᴜᴍᴍᴀʀʏ
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
                        ₹{selectedPlan.price.toLocaleString()}
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
                      <span className="text-gray-600 font-semibold">
                        ᴛᴏᴛᴀʟ ᴘʀɪᴄᴇ:
                      </span>
                      <span className="font-bold text-lg text-indigo-700">
                        ₹{bookingTotal.toLocaleString()}
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
                  !office ||
                  (selectedCategory === "daily" && !endDate) ||
                  (selectedCategory === "hourly" && (!startTime || !endTime))
                }
              >
                <FiShoppingCart className="w-5 h-5 mr-2" />
                ᴀᴅᴅ ᴛᴏ ᴄᴀʀᴛ
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
            } text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center max-w-xs sm:max-w-sm`}
          >
            {showToast.type === "success" ? (
              <FiCheckCircle className="mr-2 text-xl flex-shrink-0" />
            ) : (
              <FiAlertCircle className="mr-2 text-xl flex-shrink-0" />
            )}
            <span className="truncate">{showToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
