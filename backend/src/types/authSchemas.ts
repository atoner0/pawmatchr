import { z } from 'zod'

export const signupSchema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().min(1),
    postcode: z.string().min(1)
})

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
})