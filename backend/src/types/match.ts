import type { Dog } from "./dog.js"

export interface Match {
    match_id: number
    dog_id: number
    adopter_id: number
    overall_score: number
    fuzzy_score: number
    semantic_score: number
    warnings: string[]
    explanation: string
    generated_at: string
}

export interface MatchWithDog extends Match {
    dog: Dog
    shelter: {
        shelter_id: number
        name: string
        city: string
        postcode: string
    }
}