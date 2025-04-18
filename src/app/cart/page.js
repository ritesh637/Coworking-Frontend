"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { AiOutlineShoppingCart, AiOutlineDelete } from "react-icons/ai";
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
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const calculateItemTotal = (item) => {
    if (item.plan.toLowerCase().includes("monthly")) {
      return item.price;
    } else {
      const days = getBookingDays(item.startDate, item.endDate);
      return item.price * days;
    }
  };

  const subtotal = cart.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );

  const discountedSubtotal = subtotal - (subtotal * discount) / 100;

  const gstAmount =
    gstType === "intra"
      ? {
          cgst: discountedSubtotal * 0.09,
          sgst: discountedSubtotal * 0.09,
          igst: 0,
        }
      : gstType === "inter"
      ? {
          cgst: 0,
          sgst: 0,
          igst: discountedSubtotal * 0.18,
        }
      : {
          cgst: 0,
          sgst: 0,
          igst: discountedSubtotal * 0.18,
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
            cartItems: cart,
            totalAmount: totalPrice.toFixed(2),
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

  // const processPayment = (order) => {
  //   const options = {
  //     key: "rzp_test_vRsGNtpLKKFI66",
  //     amount: order.amount,
  //     currency: "INR",
  //     name: "Space Hub",
  //     description: "Coworking Booking",
  //     order_id: order.id,
  //     handler: async (response) => await verifyPayment(response),
  //     prefill: { email: "mneshk480@gmail.com", contact: "9818507381" },
  //     theme: { color: "#3399cc" },
  //   };
  //   const rzp = new window.Razorpay(options);
  //   rzp.open();
  // };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4 md:px-10">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10 animate-pulse">
          🛒 Your Shopping Cart
        </h2>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center">
            <AiOutlineShoppingCart className="text-9xl text-gray-400 mb-4 animate-bounce" />
            <p className="text-lg text-gray-600">
              Your cart is currently empty!
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid gap-6">
              {cart.map((item, index) => {
                const bookingDays = getBookingDays(
                  item.startDate,
                  item.endDate
                );
                const isMonthly = item.plan.toLowerCase().includes("monthly");
                return (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={item.id || `cart-item-${index}`}
                    className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold text-blue-600">
                          {item.plan}
                        </h4>
                        <p className="text-sm text-black">
                          Price: ₹{item.price.toFixed(2)}{" "}
                          {isMonthly ? "(Monthly)" : "/day"}
                        </p>
                        {!isMonthly && (
                          <p className="text-sm text-black">
                            Booked for: {bookingDays} day
                            {bookingDays > 1 ? "s" : ""}
                          </p>
                        )}
                        <p className="text-sm text-black">
                          Date: {item.startDate || "N/A"} -{" "}
                          {item.endDate || "N/A"}
                        </p>
                        <p className="text-sm text-black">
                          Time: {item.startTime || "N/A"} -{" "}
                          {item.endTime || "N/A"}
                        </p>
                        <p className="text-md font-semibold text-green-600 mt-2">
                          Total: ₹{calculateItemTotal(item).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:scale-125 transition-transform"
                      >
                        <AiOutlineDelete className="text-2xl" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-700 mb-6">
                Order Summary
              </h3>
              <div className="space-y-3 text-gray-800">
                <div className="flex justify-between">
                  <span>Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount ({discount}%):</span>
                  <span>-₹{((subtotal * discount) / 100).toFixed(2)}</span>
                </div>
                {gstType === "intra" ? (
                  <>
                    <div className="flex justify-between">
                      <span>CGST (9%):</span>{" "}
                      <span>₹{gstAmount.cgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST (9%):</span>{" "}
                      <span>₹{gstAmount.sgst.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>IGST (18%):</span>{" "}
                    <span>₹{gstAmount.igst.toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span> <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter Promo Code"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                />
                <button
                  onClick={handleApplyPromo}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  Apply Promo Code
                </button>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="Enter GST Number (Optional)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-green-500 text-white py-3 mt-4 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </motion.div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CartPage;
