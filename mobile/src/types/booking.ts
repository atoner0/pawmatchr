import type { BookingStatus, BookingType } from "./bookingSchema.js"

export interface Booking {
    booking_id: number
    application_id: number
    availability_id: number
    multi_pet_guidance: boolean
    status: BookingStatus
    booking_type: BookingType
    created_at: string
}

export interface BookingWithDetails extends Booking {
    slot: string
    dog_name: string
    first_name: string
    last_name: string
}