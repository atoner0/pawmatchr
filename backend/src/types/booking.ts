import type { BookingStatus } from "./bookingSchema.js"

export interface Booking {
    booking_id: number
    application_id: number
    availability_id: number
    multi_pet_guidance: boolean
    status: BookingStatus
    created_at: string
}