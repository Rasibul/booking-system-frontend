import { Booking } from "../types";

const API_BASE_URL = 'http://localhost:5000/api';

export async function getBookings(resource?: string, date?: string): Promise<{ success: boolean; message: string; data: Booking[] }> {
    const url = new URL(`${API_BASE_URL}/bookings`);
    if (resource) url.searchParams.append('resource', resource);
    if (date) url.searchParams.append('date', date);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch bookings');

    return response.json();
}

export async function createBooking(bookingData: {
    resource: string;
    startTime: string;
    endTime: string;
    requestedBy: string;
}) {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
}