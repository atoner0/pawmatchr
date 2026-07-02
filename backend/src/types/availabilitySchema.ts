import { z } from 'zod'

export const BookingTypeEnum = z.enum(['initial_meet', 'home_check', 'pet_introduction'])

export type BookingType = z.infer<typeof BookingTypeEnum>