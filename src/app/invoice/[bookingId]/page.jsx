// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useRouter, useParams } from "next/navigation";
// import axios from "axios";
// import Cookies from "js-cookie";
// import {
//   Loader2,
//   AlertCircle,
//   BadgeCheck,
//   ReceiptText,
//   ArrowLeftCircle,
//   Printer,
//   Building2,
//   User,
//   MapPin,
//   Phone,
//   Mail,
//   Landmark,
//   Calendar,
//   IndianRupee,
//   FileText,
//   Clock,
//   Percent,
// } from "lucide-react";

// const InvoiceDetails = () => {
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [invoiceNumber, setInvoiceNumber] = useState("");
//   const router = useRouter();
//   const params = useParams();
//   const bookingId = params?.bookingId;
//   const printRef = useRef();

//   useEffect(() => {
//     if (!bookingId) return;

//     const fetchInvoiceData = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:4000/api/payment/invoice/${bookingId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${Cookies.get("token")}`,
//             },
//           }
//         );
//         setInvoiceData(response.data);

//         if (response.data.invoiceNumber) {
//           setInvoiceNumber(response.data.invoiceNumber);
//         } else {
//           const invNum = response.data.invoiceId;
//           setInvoiceNumber(invNum);
//           setInvoiceData((prev) => ({ ...prev, invoiceNumber: invNum }));

//           try {
//             await axios.patch(
//               `http://localhost:4000/api/payment/update-invoice-number/${bookingId}`,
//               { invoiceNumber: invNum },
//               {
//                 headers: {
//                   Authorization: `Bearer ${Cookies.get("token")}`,
//                 },
//               }
//             );
//           } catch (err) {
//             console.log("Failed to save invoice number to database");
//           }
//         }
//       } catch (err) {
//         setError(
//           err?.response?.data?.message || "Failed to fetch invoice data"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvoiceData();
//   }, [bookingId]);

//   const generateInvoiceNumber = () => {
//     const date = new Date();
//     const prefix = "PRO";
//     const month = date
//       .toLocaleString("default", { month: "short" })
//       .toUpperCase();
//     const day = String(date.getDate()).padStart(2, "0");
//     const year = date.getFullYear().toString().slice(-2);
//     const sequenceNumber = "01";

//     return `${prefix}-${month}${day}${year}-${sequenceNumber}`;
//   };

//   const determineGSTType = () => {
//     return "GST (18%)";
//   };

//   const calculateGST = (amount) => {
//     const gstRate = 0.18;
//     return amount * gstRate;
//   };

//   const handlePrint = () => {
//     const gstAmount = calculateGST(invoiceData.amount);
//     const subtotal = invoiceData.amount - gstAmount;

//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice - ${invoiceData?.bookingId}</title>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

//             body {
//               font-family: 'Inter', sans-serif;
//               background: white;
//               color: #1e293b;
//               padding: 0;
//               margin: 0;
//               line-height: 1.5;
//             }

//             .invoice-container {
//               max-width: 800px;
//               margin: 0 auto;
//               padding: 2rem;
//             }

//             .invoice-header {
//               display: flex;
//               justify-content: space-between;
//               align-items: flex-start;
//               margin-bottom: 2rem;
//               border-bottom: 1px solid #e2e8f0;
//               padding-bottom: 1.5rem;
//             }

//             .invoice-title {
//               color: #4f46e5;
//               font-size: 1.75rem;
//               font-weight: 700;
//               margin: 0;
//             }

//             .invoice-number {
//               background: #eef2ff;
//               color: #4f46e5;
//               padding: 0.5rem 1rem;
//               border-radius: 0.375rem;
//               font-weight: 600;
//               font-size: 1rem;
//             }

//             .info-grid {
//               display: grid;
//               grid-template-columns: repeat(2, 1fr);
//               gap: 2rem;
//               margin-bottom: 2rem;
//             }

//             .company-info, .client-info {
//               margin-bottom: 0;
//             }

//             .info-title {
//               color: #4f46e5;
//               font-weight: 600;
//               margin-bottom: 0.75rem;
//               font-size: 1rem;
//               border-bottom: 1px solid #e2e8f0;
//               padding-bottom: 0.375rem;
//             }

//             .info-item {
//               margin-bottom: 0.5rem;
//             }

//             .info-label {
//               font-weight: 500;
//               color: #64748b;
//               font-size: 0.875rem;
//             }

//             .info-value {
//               font-weight: 500;
//               color: #1e293b;
//               margin-top: 0.25rem;
//               font-size: 0.875rem;
//             }

//             .invoice-table {
//               width: 100%;
//               border-collapse: collapse;
//               margin: 2rem 0;
//             }

//             .invoice-table th {
//               background: #eef2ff;
//               color: #4f46e5;
//               text-align: left;
//               padding: 0.75rem 1rem;
//               font-weight: 600;
//               font-size: 0.875rem;
//             }

//             .invoice-table td {
//               padding: 0.75rem 1rem;
//               border-bottom: 1px solid #e2e8f0;
//               font-size: 0.875rem;
//             }

//             .invoice-table tr:last-child td {
//               border-bottom: none;
//             }

//             .text-right {
//               text-align: right;
//             }

//             .text-left {
//               text-align: left;
//             }

//             .total-section {
//               margin-top: 2rem;
//               background: #f8fafc;
//               border-radius: 0.5rem;
//               padding: 1.25rem;
//             }

//             .total-row {
//               display: flex;
//               justify-content: space-between;
//               margin-bottom: 0.75rem;
//             }

//             .total-label {
//               font-weight: 500;
//               color: #64748b;
//               font-size: 0.875rem;
//             }

//             .total-value {
//               font-weight: 600;
//               color: #1e293b;
//               font-size: 0.875rem;
//             }

//             .grand-total {
//               font-size: 1.125rem;
//               color: #4f46e5;
//               border-top: 1px solid #e2e8f0;
//               padding-top: 0.75rem;
//               margin-top: 0.75rem;
//             }

//             .footer {
//               margin-top: 2.5rem;
//               text-align: center;
//               color: #64748b;
//               font-size: 0.75rem;
//               padding-top: 1.25rem;
//               border-top: 1px solid #e2e8f0;
//             }

//             .status-badge {
//               display: inline-flex;
//               align-items: center;
//               gap: 0.25rem;
//               padding: 0.25rem 0.5rem;
//               border-radius: 0.75rem;
//               font-size: 0.75rem;
//               font-weight: 500;
//             }

//             .status-paid {
//               background: #dcfce7;
//               color: #166534;
//             }

//             .status-pending {
//               background: #fef9c3;
//               color: #854d0e;
//             }

//             @media print {
//               body {
//                 -webkit-print-color-adjust: exact;
//                 print-color-adjust: exact;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="invoice-container">
//             <div class="invoice-header">
//               <h1 class="invoice-title">INVOICE</h1>
//               <div class="invoice-number">${invoiceNumber}</div>
//             </div>

//             <div class="info-grid">
//               <div class="company-info">
//                 <div class="info-title">From</div>
//                 <div class="info-item">
//                   <div class="info-label">Company</div>
//                   <div class="info-value">Pro-CoWorking</div>
//                 </div>
//                 <div class="info-item">
//                   <div class="info-label">Address</div>
//                   <div class="info-value">123 Coworking Street, Bangalore, KA 560001</div>
//                 </div>
//                 <div class="info-item">
//                   <div class="info-label">GSTIN</div>
//                   <div class="info-value">29ABCDE1234F1Z5</div>
//                 </div>
//               </div>

//               <div class="client-info">
//                 <div class="info-title">Bill To</div>
//                 <div class="info-item">
//                   <div class="info-label">Name</div>
//                   <div class="info-value">${invoiceData.username}</div>
//                 </div>
//                 <div class="info-item">
//                   <div class="info-label">Booking ID</div>
//                   <div class="info-value">${invoiceData.bookingId}</div>
//                 </div>
//                 <div class="info-item">
//                   <div class="info-label">Invoice Date</div>
//                   <div class="info-value">${new Date().toLocaleDateString(
//                     "en-IN"
//                   )}</div>
//                 </div>
//                 <div class="info-item">
//                   <div class="info-label">Payment Status</div>
//                   <div class="info-value">
//                     <span class="status-badge ${
//                       invoiceData.status?.toLowerCase() === "paid"
//                         ? "status-paid"
//                         : "status-pending"
//                     }">
//                       ${invoiceData.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <table class="invoice-table">
//               <thead>
//                 <tr>
//                   <th class="text-left">Description</th>
//                   <th class="text-left">Period</th>
//                   <th class="text-right">Amount (₹)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>${invoiceData.plan} Membership</td>
//                   <td>${invoiceData.startDate} to ${invoiceData.endDate}</td>
//                   <td class="text-right">₹${invoiceData.amount.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>

//             <div class="total-section">
//               <div class="total-row">
//                 <div class="total-label">Subtotal</div>
//                 <div class="total-value">₹${subtotal.toFixed(2)}</div>
//               </div>
//               <div class="total-row">
//                 <div class="total-label">GST (18%)</div>
//                 <div class="total-value">₹${gstAmount.toFixed(2)}</div>
//               </div>
//               <div class="total-row grand-total">
//                 <div class="total-label">Total Amount</div>
//                 <div class="total-value">₹${invoiceData.amount.toFixed(2)}</div>
//               </div>
//             </div>

//             <div class="footer">
//               <p>Thank you for choosing Pro-CoWorking. This is a computer generated invoice.</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.focus();
//     setTimeout(() => {
//       printWindow.print();
//     }, 500);
//   };

//   const renderPaymentStatus = (status) => {
//     if (!status) {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//           <AlertCircle className="w-3.5 h-3.5" />
//           Unknown
//         </span>
//       );
//     }

//     const normalized = String(status).toLowerCase().trim();
//     const successStatuses = [
//       "paid",
//       "success",
//       "completed",
//       "captured",
//       "succeeded",
//     ];

//     if (successStatuses.includes(normalized)) {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//           <BadgeCheck className="w-3.5 h-3.5" />
//           Paid
//         </span>
//       );
//     }

//     return (
//       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//         <AlertCircle className="w-3.5 h-3.5" />
//         Pending
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center text-red-600">
//           <AlertCircle className="mx-auto mb-2 w-8 h-8" />
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!invoiceData) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center text-red-600">
//           <AlertCircle className="mx-auto mb-2 w-8 h-8" />
//           <p>No invoice data found</p>
//         </div>
//       </div>
//     );
//   }

//   const gstAmount = calculateGST(invoiceData.amount);
//   const subtotal = invoiceData.amount - gstAmount;

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
//       <div
//         ref={printRef}
//         className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
//       >
//         <div className="bg-indigo-600 text-white p-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div className="flex items-center gap-3">
//               <ReceiptText className="w-8 h-8" />
//               <h1 className="text-2xl font-bold">Invoice</h1>
//             </div>
//             <div className="flex items-center gap-2 bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium">
//               <FileText className="w-4 h-4" />
//               {invoiceNumber}
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//             <div className="bg-gray-50 p-5 rounded-lg">
//               <h2 className="text-indigo-600 font-semibold mb-3 flex items-center gap-2">
//                 <Building2 className="w-5 h-5" />
//                 Company Info
//               </h2>
//               <div className="space-y-2 text-sm">
//                 <div className="font-medium">PRO - CoWorking</div>
//                 <div className="flex items-start gap-2 text-gray-600">
//                   <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                   <span>123 Coworking Street, Bangalore, KA 560001</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <Phone className="w-4 h-4" />
//                   <span>+91 7707076831</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <Landmark className="w-4 h-4" />
//                   <span>GST: 29ABCDE1234F1Z5</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <Mail className="w-4 h-4" />
//                   <span>support@procoworking.com</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-5 rounded-lg">
//               <h2 className="text-indigo-600 font-semibold mb-3 flex items-center gap-2">
//                 <User className="w-5 h-5" />
//                 Client Info
//               </h2>
//               <div className="space-y-2 text-sm">
//                 <div className="font-medium">
//                   {invoiceData.username || "Customer"}
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <Mail className="w-4 h-4" />
//                   <span>{invoiceData.email || "N/A"}</span>
//                 </div>

//                 <div className="flex items-center gap-2 text-gray-600">
//                   <Phone className="w-4 h-4" />
//                   <span>{sessionStorage.getItem("phoneNumber") || "N/A"}</span>
//                 </div>

//                 <div className="flex items-center gap-2 text-gray-600">
//                   <FileText className="w-4 h-4" />
//                   <span>Booking ID: {invoiceData.bookingId}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <Calendar className="w-4 h-4" />
//                   <span>
//                     Invoice Date: {new Date().toLocaleDateString("en-IN")}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <Clock className="w-4 h-4" />
//                   <span>Status: {renderPaymentStatus(invoiceData.status)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
//             <table className="w-full">
//               <thead className="bg-indigo-50">
//                 <tr>
//                   <th className="py-3 px-4 text-left text-sm font-medium text-indigo-600">
//                     Description
//                   </th>
//                   <th className="py-3 px-4 text-left text-sm font-medium text-indigo-600">
//                     Period
//                   </th>
//                   <th className="py-3 px-4 text-right text-sm font-medium text-indigo-600">
//                     Amount (₹)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 <tr>
//                   <td className="py-3 px-4 text-sm">
//                     {invoiceData.plan} Membership
//                   </td>
//                   <td className="py-3 px-4 text-sm text-gray-600">
//                     {invoiceData.startDate} to {invoiceData.endDate}
//                   </td>
//                   <td className="py-3 px-4 text-sm text-right font-medium">
//                     <span className="flex items-center justify-end gap-1">
//                       <IndianRupee className="w-4 h-4" />
//                       {invoiceData.amount.toFixed(2)}
//                     </span>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="max-w-xs ml-auto space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Subtotal:</span>
//                 <span className="font-medium flex items-center gap-1">
//                   <IndianRupee className="w-4 h-4" />
//                   {subtotal.toFixed(2)}
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600 flex items-center gap-1">
//                   GST (18%):
//                 </span>
//                 <span className="font-medium flex items-center gap-1">
//                   <IndianRupee className="w-4 h-4" />
//                   {gstAmount.toFixed(2)}
//                 </span>
//               </div>
//               <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 text-base font-semibold text-indigo-600">
//                 <span>Total Amount:</span>
//                 <span className="flex items-center gap-1">
//                   <IndianRupee className="w-4 h-4" />
//                   {invoiceData.amount.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 text-center text-xs text-gray-500">
//             <p>Thank you for choosing Pro-CoWorking.</p>
//             <p className="mt-1">This is a computer generated invoice.</p>
//           </div>

//           <div className="mt-8 flex flex-wrap justify-center gap-4">
//             <button
//               onClick={handlePrint}
//               className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
//             >
//               <Printer className="w-5 h-5" /> Print Invoice
//             </button>
//             <button
//               onClick={() => router.push("/my-bookings")}
//               className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium"
//             >
//               <ArrowLeftCircle className="w-5 h-5" /> Back to Bookings
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceDetails;

"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Loader2,
  AlertCircle,
  BadgeCheck,
  ReceiptText,
  ArrowLeftCircle,
  Printer,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Landmark,
  Calendar,
  IndianRupee,
  FileText,
  Clock,
  Percent,
} from "lucide-react";

const InvoiceDetails = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.bookingId;
  const printRef = useRef();

  useEffect(() => {
    if (!bookingId) return;

    const fetchData = async () => {
      try {
        // Fetch invoice data
        const invoiceResponse = await axios.get(
          `http://localhost:4000/api/payment/invoice/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setInvoiceData(invoiceResponse.data);

        // Fetch user profile data
        const userResponse = await axios.get(
          `http://localhost:4000/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setUserData(userResponse.data);

        // Handle invoice number
        if (invoiceResponse.data.invoiceNumber) {
          setInvoiceNumber(invoiceResponse.data.invoiceNumber);
        } else {
          const invNum = invoiceResponse.data.invoiceId;
          setInvoiceNumber(invNum);
          setInvoiceData((prev) => ({ ...prev, invoiceNumber: invNum }));

          try {
            await axios.patch(
              `http://localhost:4000/api/payment/update-invoice-number/${bookingId}`,
              { invoiceNumber: invNum },
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get("token")}`,
                },
              }
            );
          } catch (err) {
            console.log("Failed to save invoice number to database");
          }
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  const generateInvoiceNumber = () => {
    const date = new Date();
    const prefix = "PRO";
    const month = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    const sequenceNumber = "01";

    return `${prefix}-${month}${day}${year}-${sequenceNumber}`;
  };

  const determineGSTType = () => {
    return "GST (18%)";
  };

  const calculateGST = (amount) => {
    const gstRate = 0.18;
    return amount * gstRate;
  };

  const handlePrint = () => {
    const gstAmount = calculateGST(invoiceData.amount);
    const subtotal = invoiceData.amount - gstAmount;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoiceData?.bookingId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

            body {
              font-family: 'Inter', sans-serif;
              background: white;
              color: #1e293b;
              padding: 0;
              margin: 0;
              line-height: 1.5;
            }

            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
            }

            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 2rem;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 1.5rem;
            }

            .invoice-title {
              color: #4f46e5;
              font-size: 1.75rem;
              font-weight: 700;
              margin: 0;
            }

            .invoice-number {
              background: #eef2ff;
              color: #4f46e5;
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              font-weight: 600;
              font-size: 1rem;
            }

            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 2rem;
              margin-bottom: 2rem;
            }

            .company-info, .client-info {
              margin-bottom: 0;
            }

            .info-title {
              color: #4f46e5;
              font-weight: 600;
              margin-bottom: 0.75rem;
              font-size: 1rem;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 0.375rem;
            }

            .info-item {
              margin-bottom: 0.5rem;
            }

            .info-label {
              font-weight: 500;
              color: #64748b;
              font-size: 0.875rem;
            }

            .info-value {
              font-weight: 500;
              color: #1e293b;
              margin-top: 0.25rem;
              font-size: 0.875rem;
            }

            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin: 2rem 0;
            }

            .invoice-table th {
              background: #eef2ff;
              color: #4f46e5;
              text-align: left;
              padding: 0.75rem 1rem;
              font-weight: 600;
              font-size: 0.875rem;
            }

            .invoice-table td {
              padding: 0.75rem 1rem;
              border-bottom: 1px solid #e2e8f0;
              font-size: 0.875rem;
            }

            .invoice-table tr:last-child td {
              border-bottom: none;
            }

            .text-right {
              text-align: right;
            }

            .text-left {
              text-align: left;
            }

            .total-section {
              margin-top: 2rem;
              background: #f8fafc;
              border-radius: 0.5rem;
              padding: 1.25rem;
            }

            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 0.75rem;
            }

            .total-label {
              font-weight: 500;
              color: #64748b;
              font-size: 0.875rem;
            }

            .total-value {
              font-weight: 600;
              color: #1e293b;
              font-size: 0.875rem;
            }

            .grand-total {
              font-size: 1.125rem;
              color: #4f46e5;
              border-top: 1px solid #e2e8f0;
              padding-top: 0.75rem;
              margin-top: 0.75rem;
            }

            .footer {
              margin-top: 2.5rem;
              text-align: center;
              color: #64748b;
              font-size: 0.75rem;
              padding-top: 1.25rem;
              border-top: 1px solid #e2e8f0;
            }

            .status-badge {
              display: inline-flex;
              align-items: center;
              gap: 0.25rem;
              padding: 0.25rem 0.5rem;
              border-radius: 0.75rem;
              font-size: 0.75rem;
              font-weight: 500;
            }

            .status-paid {
              background: #dcfce7;
              color: #166534;
            }

            .status-pending {
              background: #fef9c3;
              color: #854d0e;
            }

            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h1 class="invoice-title">INVOICE</h1>
              <div class="invoice-number">${invoiceNumber}</div>
            </div>

            <div class="info-grid">
              <div class="company-info">
                <div class="info-title">From</div>
                <div class="info-item">
                  <div class="info-label">Company</div>
                  <div class="info-value">Pro-CoWorking</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Address</div>
                  <div class="info-value">123 Coworking Street, Bangalore, KA 560001</div>
                </div>
                <div class="info-item">
                  <div class="info-label">GSTIN</div>
                  <div class="info-value">29ABCDE1234F1Z5</div>
                </div>
              </div>

              <div class="client-info">
                <div class="info-title">Bill To</div>
                <div class="info-item">
                  <div class="info-label">${
                    userData?.companyName ? "Company" : "Name"
                  }</div>
                  <div class="info-value">${
                    userData?.companyName || invoiceData.username
                  }</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Booking ID</div>
                  <div class="info-value">${invoiceData.bookingId}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Invoice Date</div>
                  <div class="info-value">${new Date().toLocaleDateString(
                    "en-IN"
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Payment Status</div>
                  <div class="info-value">
                    <span class="status-badge ${
                      invoiceData.status?.toLowerCase() === "paid"
                        ? "status-paid"
                        : "status-pending"
                    }">
                      ${invoiceData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <table class="invoice-table">
              <thead>
                <tr>
                  <th class="text-left">Description</th>
                  <th class="text-left">Period</th>
                  <th class="text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${invoiceData.plan} Membership</td>
                  <td>${invoiceData.startDate} to ${invoiceData.endDate}</td>
                  <td class="text-right">₹${invoiceData.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-row">
                <div class="total-label">Subtotal</div>
                <div class="total-value">₹${subtotal.toFixed(2)}</div>
              </div>
              <div class="total-row">
                <div class="total-label">GST (18%)</div>
                <div class="total-value">₹${gstAmount.toFixed(2)}</div>
              </div>
              <div class="total-row grand-total">
                <div class="total-label">Total Amount</div>
                <div class="total-value">₹${invoiceData.amount.toFixed(2)}</div>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for choosing Pro-CoWorking. This is a computer generated invoice.</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const renderPaymentStatus = (status) => {
    if (!status) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <AlertCircle className="w-3.5 h-3.5" />
          Unknown
        </span>
      );
    }

    const normalized = String(status).toLowerCase().trim();
    const successStatuses = [
      "paid",
      "success",
      "completed",
      "captured",
      "succeeded",
    ];

    if (successStatuses.includes(normalized)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <BadgeCheck className="w-3.5 h-3.5" />
          Paid
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-3.5 h-3.5" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-600">
          <AlertCircle className="mx-auto mb-2 w-8 h-8" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-600">
          <AlertCircle className="mx-auto mb-2 w-8 h-8" />
          <p>No invoice data found</p>
        </div>
      </div>
    );
  }

  const gstAmount = calculateGST(invoiceData.amount);
  const subtotal = invoiceData.amount - gstAmount;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div
        ref={printRef}
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div className="bg-indigo-600 text-white p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <ReceiptText className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Invoice</h1>
            </div>
            <div className="flex items-center gap-2 bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium">
              <FileText className="w-4 h-4" />
              {invoiceNumber}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-5 rounded-lg">
              <h2 className="text-indigo-600 font-semibold mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Info
              </h2>
              <div className="space-y-2 text-sm">
                <div className="font-medium">PRO - CoWorking</div>
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>123 Coworking Street, Bangalore, KA 560001</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span> 7707076831</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Landmark className="w-4 h-4" />
                  <span>GST: 29ABCDE1234F1Z5</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>support@procoworking.com</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h2 className="text-indigo-600 font-semibold mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Client Info
              </h2>
              <div className="space-y-2 text-sm">
                <div className="font-medium">
                  {userData?.companyName || invoiceData.username}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{invoiceData.email || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{userData?.phoneNumber || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>Booking ID: {invoiceData.bookingId}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Invoice Date: {new Date().toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Status: {renderPaymentStatus(invoiceData.status)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-indigo-600">
                    Description
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-indigo-600">
                    Period
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-indigo-600">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 text-sm">
                    {invoiceData.plan} Membership
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {invoiceData.startDate} to {invoiceData.endDate}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-medium">
                    <span className="flex items-center justify-end gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {invoiceData.amount.toFixed(2)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  GST (18%):
                </span>
                <span className="font-medium flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {gstAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 text-base font-semibold text-indigo-600">
                <span>Total Amount:</span>
                <span className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {invoiceData.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Thank you for choosing Pro-CoWorking.</p>
            <p className="mt-1">This is a computer generated invoice.</p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
            >
              <Printer className="w-5 h-5" /> Print Invoice
            </button>
            <button
              onClick={() => router.push("/my-bookings")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium"
            >
              <ArrowLeftCircle className="w-5 h-5" /> Back to Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
