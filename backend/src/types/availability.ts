import type { BookingType } from "./availabilitySchema.js"

export interface Availability {
    availability_id: number
    shelter_id: number
    slot: string
    booking_type:BookingType
    is_booked: boolean
}