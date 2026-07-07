import { z } from 'zod'

export const BookingTypeEnum = z.enum(['initial_meet', 'home_check', 'pet_introduction'])

export type BookingType = z.infer<typeof BookingTypeEnum>

export const createAvailabilitySchema = z.object({
    slot: z.string().datetime(),
    booking_type: BookingTypeEnum,
})

export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>