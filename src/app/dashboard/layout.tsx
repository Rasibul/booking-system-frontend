export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Booking System</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <a
                href="/dashboard/bookings"
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                Booking List
              </a>
            </li>
            <li>
              <a
                href="/dashboard/add-booking"
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                Add Booking
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
