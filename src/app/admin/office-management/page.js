"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const OfficePage = () => {
  const [offices, setOffices] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    image: "",
    location: "",
    description: "",
    pricing: { Conference_Room: "", Meeting_Room: "", Day_Pass: "" },
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/office");
      const data = await res.json();

      const officeList = Array.isArray(data) ? data : data.offices;
      setOffices(officeList);
    } catch (error) {
      console.error("Error fetching offices:", error);
      setOffices([]); // Prevent map error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!token) {
      alert("Unauthorized! Please log in as an admin.");
      return;
    }

    try {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing
        ? `http://localhost:4000/api/office/${formData.id}`
        : "http://localhost:4000/api/office/create";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save office");
      fetchOffices();
      setFormData({
        id: "",
        name: "",
        image: "",
        location: "",
        description: "",
        pricing: { Conference_Room: "", Meeting_Room: "", Day_Pass: "" },
      });
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (office) => {
    setFormData(office);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Unauthorized! Please log in as an admin.");
      return;
    }
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/office/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete office");
      fetchOffices();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Office Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg text-black shadow-md max-w-lg mx-auto"
      >
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Office Name"
            className="border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="border p-2 rounded"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Location"
            className="border p-2 rounded"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            className="border p-2 rounded"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Conference Room Price"
            className="border p-2 rounded"
            value={formData.pricing.Conference_Room}
            onChange={(e) =>
              setFormData({
                ...formData,
                pricing: {
                  ...formData.pricing,
                  Conference_Room: e.target.value,
                },
              })
            }
          />
          <input
            type="text"
            placeholder="Meeting Room Price"
            className="border p-2 rounded"
            value={formData.pricing.Meeting_Room}
            onChange={(e) =>
              setFormData({
                ...formData,
                pricing: { ...formData.pricing, Meeting_Room: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="Day Pass Price"
            className="border p-2 rounded"
            value={formData.pricing.Day_Pass}
            onChange={(e) =>
              setFormData({
                ...formData,
                pricing: { ...formData.pricing, Day_Pass: e.target.value },
              })
            }
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>

      {/* Office List */}
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offices.map((office) => (
          <div
            key={office._id}
            className="bg-white shadow-md p-4 rounded-lg text-black"
          >
            <img
              src={office.image}
              alt={office.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="text-xl font-bold mt-2">{office.name}</h3>
            <p className="text-gray-600">{office.location}</p>
            <p className="text-sm mt-2">{office.description}</p>
            <div className="mt-4">
              <p className="text-sm font-semibold">
                Conference Room:{" "}
                <span className="text-blue-500">
                  {office.pricing.Conference_Room}
                </span>
              </p>
              <p className="text-sm font-semibold">
                Meeting Room:{" "}
                <span className="text-blue-500">
                  {office.pricing.Meeting_Room}
                </span>
              </p>
              <p className="text-sm font-semibold">
                Day Pass:{" "}
                <span className="text-blue-500">{office.pricing.Day_Pass}</span>
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(office)}
                className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(office._id)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficePage;
