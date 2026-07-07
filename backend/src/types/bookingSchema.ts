import { z } from 'zod'

export const BookingStatusEnum = z.enum(['booked', 'completed', 'cancelled'])

export type BookingStatus = z.infer<typeof BookingStatusEnum>

export const BookingTypeEnum = z.enum(['initial_meet', 'home_check', 'pet_introduction'])

export type BookingType = z.infer<typeof BookingTypeEnum>

export const createBookingSchema = z.object({
    application_id: z.number().int().positive(),
    availability_id: z.number().int().positive(),
    multi_pet_guidance: z.boolean().optional().default(false),
    booking_type: BookingTypeEnum
})