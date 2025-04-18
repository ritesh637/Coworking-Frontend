"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Loader2,
  AlertCircle,
  IndianRupee,
  CalendarDays,
  BadgeCheck,
  ReceiptText,
  ArrowLeftCircle,
  Printer,
  Building2,
  User,
  MapPin,
  Phone,
} from "lucide-react";

const InvoiceDetails = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.bookingId;
  const printRef = useRef();

  useEffect(() => {
    if (!bookingId) return;

    const fetchInvoiceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/payment/invoice/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setInvoiceData(response.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch invoice data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [bookingId]);

  const generateInvoiceNumber = (prefix = "PRO", count = 1) => {
    const date = new Date();
    const month = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    const paddedCount = String(count).padStart(4, "0");
    return `${prefix}-${month}${year}-${paddedCount}`;
  };

  const determineGSTType = () => {
    const userCode = invoiceData?.userStateCode;
    const companyCode = invoiceData?.companyStateCode;
    if (!userCode || !companyCode) return null;
    return userCode === companyCode ? "CGST + SGST" : "IGST";
  };

  const calculateGST = (amount) => {
    const gstRate = 0.18; // 18% GST
    return amount * gstRate;
  };

  const handlePrint = () => {
    const gstType = determineGSTType();
    const invoiceNo = generateInvoiceNumber("PRO", invoiceData.invoiceCount);
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
              background: #f8fafc;
              color: #1e293b;
              padding: 0;
              margin: 0;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
            }
            
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
            }
            
            .invoice-title {
              color: #4f46e5;
              font-size: 28px;
              font-weight: 700;
              margin: 0;
            }
            
            .invoice-number {
              background: #eef2ff;
              color: #4f46e5;
              padding: 8px 16px;
              border-radius: 6px;
              font-weight: 600;
            }
            
            .company-info, .client-info {
              margin-bottom: 30px;
            }
            
            .info-title {
              color: #4f46e5;
              font-weight: 600;
              margin-bottom: 12px;
              font-size: 16px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 6px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
            }
            
            .info-item {
              margin-bottom: 8px;
            }
            
            .info-label {
              font-weight: 500;
              color: #64748b;
              font-size: 14px;
            }
            
            .info-value {
              font-weight: 500;
              color: #1e293b;
              margin-top: 4px;
            }
            
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            
            .invoice-table th {
              background: #eef2ff;
              color: #4f46e5;
              text-align: left;
              padding: 12px 16px;
              font-weight: 600;
              font-size: 14px;
            }
            
            .invoice-table td {
              padding: 12px 16px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 14px;
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
              margin-top: 30px;
              background: #f8fafc;
              border-radius: 8px;
              padding: 20px;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
            }
            
            .total-label {
              font-weight: 500;
              color: #64748b;
            }
            
            .total-value {
              font-weight: 600;
              color: #1e293b;
            }
            
            .grand-total {
              font-size: 18px;
              color: #4f46e5;
              border-top: 1px solid #e2e8f0;
              padding-top: 12px;
              margin-top: 12px;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #64748b;
              font-size: 12px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
            
            .status-paid {
              background: #ecfdf5;
              color: #059669;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
            }
            
            .status-pending {
              background: #fef2f2;
              color: #dc2626;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h1 class="invoice-title">INVOICE</h1>
              <div class="invoice-number">${invoiceNo}</div>
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
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">support@procoworking.com</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone</div>
                  <div class="info-value">+91 7707076831</div>
                </div>
              </div>
              
              <div class="client-info">
                <div class="info-title">Bill To</div>
                  <div class="info-item">
                  <div class="info-label">MR / MRS</div>
                  <div class="info-value">${invoiceData.username}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Booking ID</div>
                  <div class="info-value">${invoiceData.bookingId}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${invoiceData.email}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone</div>
                  <div class="info-value">${sessionStorage.getItem(
                    "phoneNumber"
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Invoice Date</div>
                  <div class="info-value">${new Date().toLocaleDateString(
                    "en-IN"
                  )}</div>
                </div>
                <div class="info-item">
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
                  <td class="text-right">${invoiceData.amount.toFixed(2)}</td>
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
              <p>Thank you for choosing Pro-CoWorking. This is a computer generated invoice and does not require a signature.</p>
              <p style="margin-top: 8px;">For any queries, please contact support@procoworking.com or call +91 7707076831</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const renderPaymentStatus = (status) => {
    const normalized = status?.toLowerCase();
    if (["completed", "paid"].includes(normalized)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <BadgeCheck className="w-3.5 h-3.5" />
          Paid
        </span>
      );
    }
    if (["pending", "unpaid"].includes(normalized)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <AlertCircle className="w-3.5 h-3.5" />
          Unpaid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 dark:bg-red-950">
        <div className="text-center text-red-700 dark:text-red-400">
          <AlertCircle className="mx-auto mb-2 w-8 h-8" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const gstType = determineGSTType();
  const invoiceNo = generateInvoiceNumber("PRO", invoiceData.invoiceCount);
  const gstAmount = calculateGST(invoiceData.amount);
  const subtotal = invoiceData.amount - gstAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <div
        ref={printRef}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-hidden"
      >
        {/* Invoice Header */}
        <div className="bg-indigo-600 dark:bg-indigo-800 text-white p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <ReceiptText className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Invoice</h1>
            </div>
            <div className="bg-indigo-500 dark:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium">
              {invoiceNo}
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-6 sm:p-8">
          {/* From/To Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Company Info */}
            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
              <h2 className="text-indigo-600 dark:text-indigo-400 font-semibold mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Info
              </h2>
              <div className="space-y-2 text-sm">
                <div className="font-medium">PRO - CoWorking</div>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>123 Coworking Street, Bangalore, KA 560001</span>
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  GSTIN: 29ABCDE1234F1Z5
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>+91 7707076831</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>support@procoworking.com</span>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
              <h2 className="text-indigo-600 dark:text-indigo-400 font-semibold mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Client Info
              </h2>
              <div className="space-y-2 text-sm">
                <div className="font-medium">
                  {invoiceData.username || "Customer"}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>{invoiceData.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>{sessionStorage.getItem("phoneNumber") || "N/A"}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Booking ID: {invoiceData.bookingId}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Invoice Date: {new Date().toLocaleDateString("en-IN")}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  Status: {renderPaymentStatus(invoiceData.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-indigo-50 dark:bg-gray-800">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Description
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Period
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="py-3 px-4 text-sm">
                    {invoiceData.plan} Membership
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                    {invoiceData.startDate} to {invoiceData.endDate}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-medium">
                    ₹{invoiceData.amount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  Subtotal:
                </span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  GST (18%):
                </span>
                <span className="font-medium">
                  ₹{gstAmount.toFixed(2)} ({gstType})
                </span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 text-base font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Total Amount:</span>
                <span>₹{invoiceData.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              Thank you for choosing Pro-CoWorking. This is a computer generated
              invoice and does not require a signature.
            </p>
            <p className="mt-1">
              For any queries, please contact support@procoworking.com
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all text-sm font-medium shadow-sm"
            >
              <Printer className="w-5 h-5" /> Print / Download PDF
            </button>
            <button
              onClick={() => router.push("/my-bookings")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg transition-all text-sm font-medium shadow-sm"
            >
              <ArrowLeftCircle className="w-5 h-5" /> Back to Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, icon = null, valueClass = "" }) => (
  <div className="flex justify-between items-center flex-wrap gap-y-2 text-sm sm:text-base">
    <span className="font-semibold flex items-center gap-1">
      {icon}
      {label}:
    </span>
    <span
      className={`text-right break-words max-w-[70%] sm:max-w-full ${valueClass}`}
    >
      {value}
    </span>
  </div>
);

export default InvoiceDetails;
