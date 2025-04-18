
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:4000/api/user/update-profile";

export default function EditableUserProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const email = sessionStorage.getItem("email");
    const createdAt = sessionStorage.getItem("createdAt");

    // Fallback if not in sessionStorage
    const token = Cookies.get("token");
    const userId = sessionStorage.getItem("userId");

    if (username && email && createdAt) {
      const formattedDate = new Date(createdAt).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      setUser({
        name: username,
        email,
        joined: formattedDate,
        avatar: `https://i.pravatar.cc/150?u=${userId}`,
      });
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = Cookies.get("token");

    if (!token || !user) return;

    try {
      setLoading(true);
      const response = await axios.patch(
        API_URL,
        { username: user.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        sessionStorage.setItem("username", user.name);
        alert("✅ Profile updated!");
        setEditing(false);
      } else {
        alert("❌ Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-gray-500">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md"
    >
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar}
          alt={`Avatar of ${user.name}`}
          className="w-20 h-20 rounded-full border-4 border-blue-500"
        />
        <div>
          {editing ? (
            <>
              <input
                name="name"
                value={user.name}
                onChange={handleChange}
                className="text-xl font-semibold text-gray-900 dark:text-white bg-transparent border-b focus:outline-none"
              />
              <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center border-t pt-4 border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          🗓️ Joined: <span className="font-medium">{user.joined}</span>
        </p>
        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={loading}
          className="text-blue-500 hover:underline text-sm"
        >
          {editing ? (loading ? "Saving..." : "Save") : "Edit"}
        </button>
      </div>
    </motion.div>
  );
}

