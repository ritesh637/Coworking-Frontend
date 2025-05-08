"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Tab } from "@headlessui/react";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { BASE_URL } from "@/lib/config";


const BASE_URLI = `${BASE_URL}/user`;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    address: "",
    companyName: "",
    gstNumber: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    phoneNumber: "",
    gstNumber: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URLI}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setFormData({
          username: response.data.username,
          phoneNumber: response.data.phoneNumber,
          address: response.data.address || "",
          companyName: response.data.companyName || "",
          gstNumber: response.data.gstNumber || "",
        });
      } catch (err) {
        toast.error("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const validateGST = (gstNumber) => {
    if (!gstNumber.trim()) return true; // Skip validation if empty

    // GST number should be 15 characters long
    if (gstNumber.length !== 15) return false;

    // First 2 characters should be state code (numbers)
    const stateCode = gstNumber.substring(0, 2);
    if (!/^\d{2}$/.test(stateCode)) return false;

    // Next 10 characters should be PAN number (alphanumeric)
    const panNumber = gstNumber.substring(2, 12);
    if (!/^[A-Za-z0-9]{10}$/.test(panNumber)) return false;

    // 13th character should be entity code (number or letter)
    const entityCode = gstNumber[12];
    if (!/^[A-Za-z0-9]$/.test(entityCode)) return false;

    // 14th character should be Z by default
    if (gstNumber[13] !== "Z") return false;

    // Last character should be check digit (number or letter)
    const checkDigit = gstNumber[14];
    if (!/^[A-Za-z0-9]$/.test(checkDigit)) return false;

    return true;
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "username") {
      if (!value.trim()) {
        error = "Username is required";
      } else if (value.length < 3) {
        error = "Username must be at least 3 characters";
      } else if (value.length > 20) {
        error = "Username must be less than 20 characters";
      }
    }

    if (name === "phoneNumber") {
      if (!value.trim()) {
        error = "Phone number is required";
      } else if (!/^\d{10}$/.test(value)) {
        error = "Phone number must be 10 digits";
      }
    }

    if (name === "gstNumber" && value.trim()) {
      if (!validateGST(value)) {
        error =
          "Please enter a valid GST number (15 characters in format: 22ABCDE1234F1Z5)";
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate the field
    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(URL.createObjectURL(file));
    toast.success("Avatar preview updated!");
  };

  const validateForm = () => {
    const newErrors = {
      username: validateField("username", formData.username),
      phoneNumber: validateField("phoneNumber", formData.phoneNumber),
      gstNumber: validateField("gstNumber", formData.gstNumber),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    // Additional GST validation if GST number is provided
    if (formData.gstNumber && !validateGST(formData.gstNumber)) {
      toast.error("Please enter a valid GST number");
      return;
    }

    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.put(`${BASE_URLI}/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`Dark mode ${!darkMode ? "enabled" : "disabled"}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 min-h-screen">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <Toaster position="top-right" />

        {/* Header with dark mode toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            My Account
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-200 text-gray-700"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-700 p-1 mb-8">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-sm font-medium leading-5 rounded-lg",
                  selected
                    ? darkMode
                      ? "bg-gray-800 shadow text-white"
                      : "bg-white shadow text-blue-700"
                    : darkMode
                    ? "text-purple-600 hover:bg-gray-600 hover:text-white"
                    : "text-blue-600 hover:bg-white/[0.12] hover:text-blue-700"
                )
              }
            >
              Profile
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-sm font-medium leading-5 rounded-lg",
                  selected
                    ? darkMode
                      ? "bg-gray-800 shadow text-white"
                      : "bg-white shadow text-blue-700"
                    : darkMode
                    ? "text-purple-600 hover:bg-gray-600 hover:text-white"
                    : "text-blue-600 hover:bg-white/[0.12] hover:text-blue-700"
                )
              }
            >
              Settings
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl shadow-xl overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center md:w-1/3">
                    <div className="relative group">
                      <img
                        src={
                          avatar ||
                          "https://randomuser.me/api/portraits/men/1.jpg"
                        }
                        alt="Avatar"
                        className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-indigo-500 shadow-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="file"
                        onChange={handleAvatarChange}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        title="Change avatar"
                        accept="image/*"
                      />
                    </div>
                    <h1 className="text-2xl font-bold mt-4 text-center">
                      {user.username}
                    </h1>
                    <p
                      className={`mt-1 ${
                        darkMode ? "text-indigo-300" : "text-indigo-600"
                      }`}
                    >
                      {user.email}
                    </p>
                    <p
                      className={`mt-1 ${
                        darkMode ? "text-indigo-300" : "text-indigo-600"
                      }`}
                    >
                      {user.phoneNumber}
                    </p>
                  </div>

                  <div className="md:w-2/3">
                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            {
                              field: "username",
                              label: "Username",
                              type: "text",
                            },
                            {
                              field: "phoneNumber",
                              label: "Phone Number",
                              type: "tel",
                            },
                            {
                              field: "address",
                              label: "Address",
                              type: "text",
                            },
                            {
                              field: "companyName",
                              label: "Company Name",
                              type: "text",
                            },
                            {
                              field: "gstNumber",
                              label: "GST Number",
                              type: "text",
                              placeholder: "22ABCDE1234F1Z5",
                            },
                          ].map(({ field, label, type, placeholder }) => (
                            <div key={field} className="space-y-1">
                              <label
                                className={`block text-sm font-medium ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {label}
                              </label>
                              <input
                                type={type}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                } ${errors[field] ? "border-red-500" : ""}`}
                              />
                              {errors[field] && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors[field]}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setErrors({
                                username: "",
                                phoneNumber: "",
                                gstNumber: "",
                              });
                            }}
                            className={`px-4 py-2 rounded-md font-medium ${
                              darkMode
                                ? "bg-gray-600 hover:bg-gray-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-200"
                            disabled={Object.values(errors).some(
                              (error) => error
                            )}
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3
                              className={`text-sm font-medium ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Address
                            </h3>
                            <p className="mt-1">
                              {user.address || "Not Provided"}
                            </p>
                          </div>
                          <div>
                            <h3
                              className={`text-sm font-medium ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Company
                            </h3>
                            <p className="mt-1">
                              {user.companyName || "Not Provided"}
                            </p>
                          </div>
                          <div>
                            <h3
                              className={`text-sm font-medium ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              GST Number
                            </h3>
                            <p className="mt-1">
                              {user.gstNumber || "Not Provided"}
                            </p>
                          </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-200"
                          >
                            Edit Profile
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Tab.Panel>

            <Tab.Panel>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl shadow-xl p-6 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h3 className="text-lg font-medium mb-3">Security</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Password</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Change your account password
                          </p>
                        </div>
                        <button
                          disabled
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
                        >
                          Coming Soon
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add an extra layer of security
                          </p>
                        </div>
                        <button
                          disabled
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
                        >
                          Coming Soon
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h3 className="text-lg font-medium mb-3">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manage email preferences
                          </p>
                        </div>
                        <button
                          disabled
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
                        >
                          Coming Soon
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Push Notifications</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Control app notifications
                          </p>
                        </div>
                        <button
                          disabled
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed"
                        >
                          Coming Soon
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Preferences</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Dark Mode</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Toggle between light and dark theme
                        </p>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          darkMode ? "bg-indigo-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            darkMode ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg animate-pulse"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center md:w-1/3 space-y-4">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300 dark:bg-gray-600" />
          <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="md:w-2/3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-10 bg-gray-100 dark:bg-gray-600 rounded-md" />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" />
            <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded-md" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
