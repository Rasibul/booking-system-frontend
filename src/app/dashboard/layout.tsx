"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaList,
  FaPlusCircle,
  FaCalendarAlt,
} from "react-icons/fa";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <FaHome className="text-lg" />,
    },
    {
      name: "Booking List",
      href: "/dashboard/bookings",
      icon: <FaList className="text-lg" />,
    },
    {
      name: "Add Booking",
      href: "/dashboard/add-booking",
      icon: <FaPlusCircle className="text-lg" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static z-50 h-full w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 border-r border-gray-700`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  BookingHub
                </h1>
                <p className="text-xs text-gray-400">Resource Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 text-cyan-400 shadow-lg"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }`}
                  >
                    <span
                      className={`${
                        isActive(item.href) ? "text-cyan-400" : "text-gray-400"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="text-center text-xs text-gray-500">
              <p>© 2024 BookingHub</p>
              <p className="mt-1">All rights reserved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className="hidden lg:block">
              <h2 className="text-xl font-semibold text-gray-200">
                {navItems.find((item) => isActive(item.href))?.name ||
                  "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">U</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-gray-900 to-black">
          {children}
        </main>
      </div>
    </div>
  );
}
