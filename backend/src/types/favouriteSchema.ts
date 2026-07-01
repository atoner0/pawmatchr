import { z } from 'zod'

export const createFavouriteSchema = z.object({
    dog_id: z.number().int()
})