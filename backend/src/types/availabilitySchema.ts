import { z } from 'zod'

export const createAvailabilitySchema = z.object({
    slot: z.string().datetime({ local: true }),
})

export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>