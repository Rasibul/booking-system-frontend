import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center p-6">
      <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">
        Resource Booking System
      </h1>
      <Link
        href="/dashboard/bookings"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors duration-300"
      >
        View Dashboard
      </Link>
    </main>
  );
}
