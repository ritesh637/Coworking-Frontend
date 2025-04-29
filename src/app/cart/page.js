"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { AiOutlineShoppingCart, AiOutlineDelete } from "react-icons/ai";
import { FiArrowRight } from "react-icons/fi";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import gstStates from "@/utils/gstStates.json";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [gstType, setGstType] = useState("none");

  useEffect(() => {
    const authToken = Cookies.get("token") || localStorage.getItem("token");
    if (authToken) setToken(authToken);
  }, []);

  useEffect(() => {
    validateGST();
  }, [gstNumber]);

  const validateGST = () => {
    if (!gstNumber || gstNumber.length < 2) {
      setGstType("none");
      return;
    }

    const stateCode = gstNumber.substring(0, 2);
    const userState = gstStates[stateCode];
    const companyState = "27";

    if (!userState) {
      toast.error("Invalid GST Number: State not recognized");
      setGstType("none");
      return;
    }

    setGstType(stateCode === companyState ? "intra" : "inter");
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dateStr);
  };

  const getBookingDays = (startDate, endDate) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    const timeDiff = end - start;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 0;
    return days > 0 ? days : 1;
  };

  const calculateItemTotal = (item) => {
    if (item.plan.toLowerCase().includes("monthly")) {
      return Math.round(item.price);
    } else {
      const days = getBookingDays(item.startDate, item.endDate);
      return Math.round(item.price * days);
    }
  };

  const subtotal = cart.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );

  const discountedSubtotal = Math.round(subtotal - (subtotal * discount) / 100);

  const gstAmount =
    gstType === "intra"
      ? {
          cgst: Math.round(discountedSubtotal * 0.09),
          sgst: Math.round(discountedSubtotal * 0.09),
          igst: 0,
        }
      : gstType === "inter"
      ? {
          cgst: 0,
          sgst: 0,
          igst: Math.round(discountedSubtotal * 0.18),
        }
      : {
          cgst: 0,
          sgst: 0,
          igst: Math.round(discountedSubtotal * 0.18),
        };

  const totalPrice =
    discountedSubtotal + gstAmount.cgst + gstAmount.sgst + gstAmount.igst;

  const handleApplyPromo = async () => {
    if (!promoCode) {
      toast.error("Please enter a valid promo code");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/promocode/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDiscount(0);
        toast.error(data.message || "Invalid promo code");
        return;
      }

      setDiscount(data.discount);
      toast.success(`Promo applied! You got ${data.discount}% off`);
    } catch (error) {
      console.error("Promo apply error:", error);
      setDiscount(0);
      toast.error("Something went wrong applying the promo code");
    }
  };

  const handlePayment = async () => {
    if (!token) {
      toast.error("You are not logged in!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }

    setLoading(true);
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.id;
      if (!userId) throw new Error("Invalid token");

      const response = await fetch(
        "http://localhost:4000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            userId,
            cartItems: cart.map((item) => ({
              ...item,
              totalPrice: calculateItemTotal(item),
            })),
            totalAmount: Math.round(totalPrice),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create order!");

      processPayment(data.order);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  const processPayment = (order) => {
    const options = {
      key: "rzp_test_vRsGNtpLKKFI66",
      amount: order.amount,
      currency: "INR",
      name: "Space Hub",
      description: "Coworking Booking",
      order_id: order.id,
      handler: async (response) => await verifyPayment(response),
      prefill: { email: "mneshk480@gmail.com", contact: "9818507381" },
      theme: { color: "#3399cc" },
      external: {
        wallets: ["paytm", "phonepe"],
        upi: ["google_pay"],
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const verifyPayment = async (paymentResponse) => {
    if (!token) {
      toast.error("You need to log in before verifying payment!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/payment/verify-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(paymentResponse),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Payment verification failed!");

      toast.success("Payment successful! Redirecting to bookings...");
      setTimeout(() => {
        window.location.href = "/my-bookings";
      }, 1000);
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <AiOutlineShoppingCart className="text-6xl sm:text-8xl text-gray-300 mb-6" />
            <h3 className="text-xl sm:text-2xl font-medium text-gray-700 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6 max-w-md text-center">
              Looks like you haven't added anything to your cart yet.
            </p>
            <a
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Spaces <FiArrowRight />
            </a>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => {
                const bookingDays = getBookingDays(
                  item.startDate,
                  item.endDate
                );
                const isMonthly = item.plan.toLowerCase().includes("monthly");
                const isDaily = item.plan.toLowerCase().includes("daily");
                const isHourly = item.plan.toLowerCase().includes("hourly");

                return (
                  <motion.div
                    key={item.id || `cart-item-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-800">
                            {item.plan}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors ml-4"
                            aria-label="Remove item"
                          >
                            <AiOutlineDelete className="text-xl" />
                          </button>
                        </div>

                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Price:</span> ₹
                            {Math.round(item.price)}
                            {isMonthly && " (Monthly)"}
                            {isDaily && " /day"}
                            {isHourly && " /hour"}
                          </p>
                          {!isMonthly && (
                            <p>
                              <span className="font-medium">Duration:</span>{" "}
                              {bookingDays} day{bookingDays > 1 ? "s" : ""}
                            </p>
                          )}
                          <p>
                            <span className="font-medium">Dates:</span>{" "}
                            {item.startDate || "N/A"} to {item.endDate || "N/A"}
                          </p>
                          {isHourly && (
                            <p>
                              <span className="font-medium">Time:</span>{" "}
                              {item.startTime || "N/A"} -{" "}
                              {item.endTime || "N/A"}
                            </p>
                          )}
                          <p className="text-lg font-semibold text-green-600">
                            ₹{calculateItemTotal(item)}
                          </p>
                        </div>
                      </div>
                      <div className="sm:text-right"></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="sticky top-4 h-fit">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{Math.round(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%):</span>
                      <span>-₹{Math.round((subtotal * discount) / 100)}</span>
                    </div>
                  )}

                  {gstType === "intra" ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CGST (9%):</span>
                        <span>₹{gstAmount.cgst}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">SGST (9%):</span>
                        <span>₹{gstAmount.sgst}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-600">IGST (18%):</span>
                      <span>₹{gstAmount.igst}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-800">Total:</span>
                      <span className="text-blue-600">
                        ₹{Math.round(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-4">
                  <label
                    htmlFor="promo-code"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="promo-code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* GST Number */}
                <div className="mb-6">
                  <label
                    htmlFor="gst-number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="gst-number"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                    </span>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CartPage;
