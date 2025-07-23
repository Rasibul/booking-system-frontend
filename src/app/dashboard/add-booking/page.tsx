"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/app/lib/api";
import { toast, Toaster } from "react-hot-toast";
import {
  FaCalendarPlus,
  FaBuilding,
  FaUser,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";

const resources = [
  { id: "Conference Room A", name: "Conference Room A" },
  { id: "Projector X", name: "Projector X" },
  { id: "VR Lab", name: "VR Lab" },
  { id: "Recording Studio", name: "Recording Studio" },
];

export default function AddBookingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    resource: "",
    startTime: "",
    endTime: "",
    requestedBy: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (
      !formData.resource ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.requestedBy
    ) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      toast.error("End time must be after start time");
      setLoading(false);
      return;
    }

    const duration =
      (new Date(formData.endTime).getTime() -
        new Date(formData.startTime).getTime()) /
      (1000 * 60);
    if (duration < 15) {
      toast.error("Minimum booking duration is 15 minutes");
      setLoading(false);
      return;
    }

    try {
      await createBooking(formData);
      toast.success("Booking created successfully!");
      router.push("/dashboard/bookings");
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create booking";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#0ea5e9",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors"
          >
            <FaArrowLeft /> Back to Bookings
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Create New Booking
          </h1>
          <p className="text-gray-400 mt-2">
            Reserve resources for your meetings and events
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resource Selection */}
              <div className="space-y-2">
                <label className="block text-gray-300  items-center gap-2">
                  <FaBuilding className="text-cyan-400" />
                  Resource
                </label>
                <select
                  name="resource"
                  value={formData.resource}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select a resource</option>
                  {resources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Requested By */}
              <div className="space-y-2">
                <label className="block text-gray-300  items-center gap-2">
                  <FaUser className="text-cyan-400" />
                  Requested By
                </label>
                <input
                  type="text"
                  name="requestedBy"
                  value={formData.requestedBy}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <label className="block text-gray-300  items-center gap-2">
                  <FaClock className="text-cyan-400" />
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <label className="block text-gray-300  items-center gap-2">
                  <FaClock className="text-cyan-400" />
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Booking...
                  </>
                ) : (
                  <>
                    <FaCalendarPlus className="text-lg" />
                    Create Booking
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <h3 className="text-cyan-400 font-semibold mb-2">
              📅 Minimum Duration
            </h3>
            <p className="text-gray-300 text-sm">
              Bookings must be at least 15 minutes long
            </p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <h3 className="text-cyan-400 font-semibold mb-2">
              ⏰ Time Validation
            </h3>
            <p className="text-gray-300 text-sm">
              End time must be after start time
            </p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <h3 className="text-cyan-400 font-semibold mb-2">
              ✅ Required Fields
            </h3>
            <p className="text-gray-300 text-sm">
              All fields must be filled to create a booking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
