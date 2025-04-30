// "use client";
// export const dynamic = "force-dynamic";

// import React, { useEffect } from "react";
// import { useSearchParams } from "next/navigation";

// const PaymentPage = () => {
//   const searchParams = useSearchParams();
//   const amount = searchParams.get("amount");

//   useEffect(() => {
//     // Load Razorpay script dynamically
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   const handlePayment = () => {
//     const options = {
//       key: "Xdebdnlka0uxa", // Replace Razorpay API key
//       amount: amount * 100,
//       currency: "INR",
//       name: "Co-Prowroking",
//       description: "Order Payment",
//       handler: function (response) {
//         alert(
//           "Payment Successful! Payment ID: " + response.razorpay_payment_id
//         );
//       },
//       prefill: {
//         name: "RITESH",
//         email: "Test@example.com",
//         contact: "9999999999",
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-4">
//           Complete Your Payment
//         </h2>
//         <p className="text-center text-gray-600 mb-4">
//           Total Amount: ₹{amount}
//         </p>
//         <button
//           onClick={handlePayment}
//           className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
//         >
//           Pay ₹{amount}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;









"use client";
export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import PaymentPage from "./PaymentComponent";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPage />
    </Suspense>
  );
};

export default Page;
