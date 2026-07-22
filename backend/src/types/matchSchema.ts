import { z } from 'zod'

export const matchResultSchema = z.object({
    dog_id: z.number().int(),
    overall_score: z.number(),
    fuzzy_score: z.number(),
    semantic_score: z.number(),
    warnings: z.array(z.string()),
    explanation: z.string()
})

export type MatchResultFromPython = z.infer<typeof matchResultSchema>

export const matchResponseSchema = z.object({
    results: z.array(matchResultSchema)
})