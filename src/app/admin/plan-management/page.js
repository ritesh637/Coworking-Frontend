"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "@/lib/config";

const API_BASE = `${BASE_URL}/plans`;
const OFFICE_API = `${BASE_URL}/office`;

const Icon = ({ path, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`h-5 w-5 ${className}`}
  >
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

const PlanManager = () => {
  const [state, setState] = useState({
    plans: [],
    form: { title: "", price: "", category: "hourly", officeId: "" },
    editId: null,
    filter: "",
    search: "",
    loading: false,
    error: null,
    success: null,
    pagination: { page: 1, limit: 5, total: 0 },
    deleteModal: false,
    offices: [],
    selectedOffice: "",
  });

  const token = Cookies.get("token");
  const update = (updates) => setState((prev) => ({ ...prev, ...updates }));

  // Fetch offices
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await axios.get(OFFICE_API);
        if (Array.isArray(res.data.offices)) {
          update({ offices: res.data.offices });
          if (res.data.offices.length > 0) {
            update({ selectedOffice: res.data.offices[0].id });
          }
        }
      } catch (err) {
        update({
          error: err.response?.data?.message || "Failed to fetch offices",
        });
      }
    };
    fetchOffices();
  }, []);

  // Fetch plans
  const fetchPlans = async () => {
    update({ loading: true, error: null });
    try {
      const url = `${API_BASE}/office/${state.selectedOffice}?page=${state.pagination.page}&limit=${state.pagination.limit}`;
      const res = await axios.get(url);
      update({
        plans: res.data.plans || res.data,
        pagination: {
          ...state.pagination,
          total: res.data.total || res.data.length,
        },
      });
    } catch (err) {
      update({ error: err.response?.data?.message || "Failed to fetch plans" });
    } finally {
      update({ loading: false });
    }
  };

  useEffect(() => {
    if (state.selectedOffice) {
      fetchPlans();
    }
  }, [state.pagination.page, state.pagination.limit, state.selectedOffice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.form.title.trim()) return update({ error: "Title is required" });
    if (
      !state.form.price ||
      isNaN(state.form.price) ||
      Number(state.form.price) <= 0
    )
      return update({ error: "Please enter a valid price" });
    if (!state.selectedOffice) return update({ error: "Office is required" });

    update({ loading: true, error: null });
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const method = state.editId ? "put" : "post";
      const url = state.editId ? `${API_BASE}/${state.editId}` : API_BASE;

      const payload = {
        ...state.form,
        officeId: state.selectedOffice,
      };

      await axios[method](url, payload, { headers });

      update({
        form: { title: "", price: "", category: "hourly", officeId: "" },
        editId: null,
        success: `Plan ${state.editId ? "updated" : "created"} successfully!`,
      });
      fetchPlans();
    } catch (err) {
      update({ error: err.response?.data?.message || "Error saving plan" });
    } finally {
      update({ loading: false });
    }
  };

  const deletePlan = async (id) => {
    update({ loading: true });
    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      update({ success: "Plan deleted!", deleteModal: false });
      fetchPlans();
    } catch (err) {
      update({ error: err.response?.data?.message || "Delete failed" });
    } finally {
      update({ loading: false });
    }
  };

  const handleEdit = (plan) => {
    update({
      form: {
        title: plan.title,
        price: plan.price,
        category: plan.category,
        officeId: plan.officeId,
      },
      editId: plan._id,
    });
    // Smooth scroll to form
    document
      .getElementById("plan-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredPlans = state.plans.filter((plan) => {
    const matchesSearch = plan.title
      .toLowerCase()
      .includes(state.search.toLowerCase());
    const matchesFilter = state.filter ? plan.category === state.filter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📋 Plan Manager</h1>
          <p className="mt-2 text-gray-600">
            Manage subscription plans by office
          </p>
        </div>

        {/* Office Selection */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon path="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            Office Selection
          </h2>
          <select
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={state.selectedOffice}
            onChange={(e) => update({ selectedOffice: e.target.value })}
          >
            {state.offices.map((office) => (
              <option key={office.id} value={office.id}>
                {office.name} ({office.id})
              </option>
            ))}
          </select>
        </div>

        {/* Plan Form */}
        <div id="plan-form" className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {state.editId ? (
              <>
                <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                Edit Plan
              </>
            ) : (
              <>
                <Icon path="M12 4.5v15m7.5-7.5h-15" />
                Create New Plan
              </>
            )}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Title
                </label>
                <input
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Plan title"
                  value={state.form.title}
                  onChange={(e) =>
                    update({ form: { ...state.form, title: e.target.value } })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    className="w-full p-3 pl-8 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    value={state.form.price}
                    onChange={(e) =>
                      update({ form: { ...state.form, price: e.target.value } })
                    }
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Category
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={state.form.category}
                  onChange={(e) =>
                    update({
                      form: { ...state.form, category: e.target.value },
                    })
                  }
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={state.loading}
                  className={`w-full p-3 rounded-lg font-medium transition-colors ${
                    state.loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {state.loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                  ) : state.editId ? (
                    "Update Plan"
                  ) : (
                    "Create Plan"
                  )}
                </button>
              </div>
            </div>
            {state.editId && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    update({
                      form: {
                        title: "",
                        price: "",
                        category: "hourly",
                        officeId: "",
                      },
                      editId: null,
                    });
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel edit
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Search and Filter */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            Search & Filter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search plans..."
                value={state.search}
                onChange={(e) => update({ search: e.target.value })}
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <Icon path="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" />
              </div>
            </div>
            <div>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={state.filter}
                onChange={(e) => update({ filter: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {state.error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center text-red-700">
              <Icon
                path="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                className="flex-shrink-0"
              />
              <p className="ml-2">{state.error}</p>
            </div>
          </div>
        )}

        {state.success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center text-green-700">
              <Icon
                path="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                className="flex-shrink-0"
              />
              <p className="ml-2">{state.success}</p>
              <button
                onClick={() => update({ success: null })}
                className="ml-auto text-green-700 hover:text-green-900"
              >
                <Icon path="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </button>
            </div>
          </div>
        )}

        {/* Plans Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {state.loading && !state.plans.length ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-indigo-600"
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
              </div>
              <p className="mt-4">Loading plans...</p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <Icon path="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No plans found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {state.search || state.filter
                  ? "Try adjusting your search or filter"
                  : "Get started by creating a new plan"}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    document
                      .getElementById("plan-form")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Icon
                    path="M12 4.5v15m7.5-7.5h-15"
                    className="-ml-1 mr-2 h-5 w-5"
                  />
                  Create Plan
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Office
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPlans.map((plan) => (
                      <tr key={plan._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Icon
                                path="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                                className="h-5 w-5 text-indigo-500"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {state.offices.find(
                                  (o) => o.id === plan.officeId
                                )?.name || plan.officeId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {plan.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            ₹{Number(plan.price).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              plan.category === "hourly"
                                ? "bg-blue-100 text-blue-800"
                                : plan.category === "daily"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {plan.category.charAt(0).toUpperCase() +
                              plan.category.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() => handleEdit(plan)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            >
                              <Icon
                                path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                className="mr-1"
                              />
                              Edit
                            </button>
                            <button
                              onClick={() => update({ deleteModal: plan._id })}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <Icon
                                path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                className="mr-1"
                              />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center sm:hidden">
                  <button
                    onClick={() =>
                      update({
                        pagination: {
                          ...state.pagination,
                          page: Math.max(1, state.pagination.page - 1),
                        },
                      })
                    }
                    disabled={state.pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {state.pagination.page}
                  </span>
                  <button
                    onClick={() =>
                      update({
                        pagination: {
                          ...state.pagination,
                          page: state.pagination.page + 1,
                        },
                      })
                    }
                    disabled={
                      state.pagination.page * state.pagination.limit >=
                      state.pagination.total
                    }
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(state.pagination.page - 1) * state.pagination.limit +
                          1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          state.pagination.page * state.pagination.limit,
                          state.pagination.total
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {state.pagination.total}
                      </span>{" "}
                      plans
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          update({
                            pagination: {
                              ...state.pagination,
                              page: Math.max(1, state.pagination.page - 1),
                            },
                          })
                        }
                        disabled={state.pagination.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <Icon path="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
                      </button>
                      <button
                        onClick={() =>
                          update({
                            pagination: {
                              ...state.pagination,
                              page: state.pagination.page + 1,
                            },
                          })
                        }
                        disabled={
                          state.pagination.page * state.pagination.limit >=
                          state.pagination.total
                        }
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <Icon path="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {state.deleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full transform transition-all">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Icon
                    path="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    className="h-6 w-6 text-red-600"
                  />
                </div>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">
                Delete Plan
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete this plan? This action cannot be
                undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => update({ deleteModal: false })}
                  className="flex-1 border border-gray-300 rounded-md py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deletePlan(state.deleteModal)}
                  className="flex-1 bg-red-600 text-white rounded-md py-2 hover:bg-red-700 transition-colors"
                >
                  {state.loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanManager;
