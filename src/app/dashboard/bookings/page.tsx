"use client";
import { useState, useEffect } from "react";
import { Booking } from "../../types/index";
import { getBookings } from "@/app/lib/api";
import { FaTrash, FaFilter, FaCalendarAlt, FaBuilding } from "react-icons/fa";
import toast from "react-hot-toast";

export default function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterResource, setFilterResource] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [filterResource, filterDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getBookings(filterResource, filterDate);
      console.log("Fetched bookings:", response);

      setBookings(Array.isArray(response?.data) ? response.data : []);
      setError("");
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
      modal.innerHTML = `
      <div class="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full shadow-2xl">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white">Delete Booking</h3>
        </div>
        <p class="text-gray-300 mb-6">Are you sure you want to delete this booking? This action cannot be undone.</p>
        <div class="flex gap-3 justify-end">
          <button id="cancel-btn" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            Cancel
          </button>
          <button id="confirm-btn" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
            Delete
          </button>
        </div>
      </div>
    `;

      document.body.appendChild(modal);

      const cancelBtn = modal.querySelector("#cancel-btn");
      const confirmBtn = modal.querySelector("#confirm-btn");

      const cleanup = () => {
        document.body.removeChild(modal);
      };

      cancelBtn?.addEventListener("click", () => {
        cleanup();
        resolve(false);
      });

      confirmBtn?.addEventListener("click", () => {
        cleanup();
        resolve(true);
      });

      // Close on backdrop click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          cleanup();
          resolve(false);
        }
      });
    });

    if (confirmed) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          toast.success("Booking deleted successfully!");
          fetchBookings();
        } else {
          throw new Error("Failed to delete booking");
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
        toast.error("Failed to delete booking. Please try again.");
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Booking Management
        </h1>
        <p className="text-gray-400 mb-8">Manage your room reservations</p>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Filters Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <FaFilter className="text-cyan-400" />
                <h2 className="text-xl font-semibold">Filters</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-300 items-center gap-2">
                    <FaBuilding className="text-cyan-400" />
                    Filter by Resource
                  </label>
                  <input
                    type="text"
                    value={filterResource}
                    onChange={(e) => setFilterResource(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Meeting Room A"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300  items-center gap-2">
                    <FaCalendarAlt className="text-cyan-400" />
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bookings Section */}
            {bookings.length === 0 ? (
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-12 text-center border border-gray-700">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-2xl font-semibold mb-2">
                  No Bookings Found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your filters or create a new booking
                </p>
              </div>
            ) : (
              <>
                {groupByResource(bookings).map(
                  ([resource, resourceBookings]) => (
                    <div key={resource} className="mb-10">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                          <span className="bg-gradient-to-r from-cyan-500 to-blue-500 w-1 h-8 rounded-full"></span>
                          {resource}
                        </h2>
                        <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                          {resourceBookings.length} bookings
                        </span>
                      </div>

                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-700/50">
                              <tr>
                                <th className="py-4 px-6 text-left font-semibold text-cyan-400">
                                  Requested By
                                </th>
                                <th className="py-4 px-6 text-left font-semibold text-cyan-400">
                                  Date
                                </th>
                                <th className="py-4 px-6 text-left font-semibold text-cyan-400">
                                  Time
                                </th>
                                <th className="py-4 px-6 text-left font-semibold text-cyan-400">
                                  Status
                                </th>
                                <th className="py-4 px-6 text-left font-semibold text-cyan-400">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {resourceBookings.map((booking) => (
                                <tr
                                  key={booking.id}
                                  className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                                >
                                  <td className="py-4 px-6">
                                    <div className="font-medium">
                                      {booking.requestedBy}
                                    </div>
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="font-medium">
                                      {formatDate(booking.startTime)}
                                    </div>
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="font-mono">
                                      {formatTime(booking.startTime)} -{" "}
                                      {formatTime(booking.endTime)}
                                    </div>
                                  </td>
                                  <td className="py-4 px-6">
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        booking.status === "Past"
                                          ? "bg-gray-700 text-gray-300"
                                          : booking.status === "Upcoming"
                                          ? "bg-blue-900/50 text-blue-300"
                                          : "bg-green-900/50 text-green-300"
                                      }`}
                                    >
                                      {booking.status}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6">
                                    <button
                                      onClick={() => handleDelete(booking.id)}
                                      className="p-2 rounded-lg bg-red-900/30 hover:bg-red-800/50 text-red-400 hover:text-red-300 transition-all duration-200 flex items-center gap-2 group"
                                      title="Delete booking"
                                    >
                                      <FaTrash className="group-hover:scale-110 transition-transform" />
                                      <span className="hidden md:inline">
                                        Delete
                                      </span>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function groupByResource(bookings: Booking[]): [string, Booking[]][] {
  const groups = bookings.reduce((acc, booking) => {
    if (!acc[booking.resource]) {
      acc[booking.resource] = [];
    }
    acc[booking.resource].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  return Object.entries(groups);
}
