import type { ApplicationStatus } from "./applicationSchema.js";

export interface Application {
    application_id: number
    dog_id: number
    adopter_id: number
    status: ApplicationStatus
    readiness_checklist: boolean
    submitted_at: string
    decision_at: string | null
    adopted_at: string | null
}

export interface ApplicationWithDetails extends Application {
    dog_name: string
    photo_url: string 
    first_name: string
    last_name: string
    shelter_id: number
}