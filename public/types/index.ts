export type Booking = {
    id: string;
    resource: string;
    requestedBy: string;
    startTime: string;
    endTime: string;
    status: "Upcoming" | "Past" | "Cancelled";
};