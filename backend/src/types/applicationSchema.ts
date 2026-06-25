import { z } from 'zod'

export const ApplicationStatusEnum = z.enum(['submitted', 'under_review', 'approved', 'adopted', 'rejected', 'withdrawn'])

export type ApplicationStatus = z.infer<typeof ApplicationStatusEnum>

export const createApplicationSchema = z.object({
    dog_id: z.number().int()
})

export const updateStatusSchema = z.object({
    status: ApplicationStatusEnum
})

export const updateChecklistSchema = z.object({
    readiness_checklist: z.boolean()
})