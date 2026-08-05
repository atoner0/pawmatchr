import { Booking, BookingWithDetails } from "@/types/booking";
import { apiFetch } from "./api";
import { BookingType } from "@/types/bookingSchema";

export const getBookingsByApplication = async (applicationId: number): Promise<BookingWithDetails[]> => {
    return apiFetch<BookingWithDetails[]>(`/adopter/bookings/${applicationId}`);
}

export const createBooking = async (
    application_id: number,
    availability_id: number,
    booking_type: BookingType,
    multi_pet_guidance: boolean
): Promise<Booking> => {
    return apiFetch<Booking>("/adopter/bookings", {
        method: "POST",
        body: JSON.stringify({ application_id, availability_id, booking_type, multi_pet_guidance})
    });
}