import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resource Booking System</h1>
      <div className="flex gap-4">
        <Link
          href="/bookings"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          View Bookings
        </Link>
        <Link
          href="/bookings/new"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          New Booking
        </Link>
      </div>
    </main>
  );
}
