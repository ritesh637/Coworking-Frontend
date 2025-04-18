"use client";

import { useEffect, useState } from "react";
import BookingCard from "./BookingCard";

export default function Home() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/office/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.offices)) {
          setOffices(data.offices);
        } else {
          console.error("Expected offices to be an array:", data);
          setOffices([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching offices:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-10 sm:px-10 md:px-20 lg:px-40">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Mumbai
      </h1>
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12">
          {offices.map((office) => (
            <BookingCard key={office._id || office.id} office={office} />
          ))}
        </div>
      )}
    </div>
  );
}
