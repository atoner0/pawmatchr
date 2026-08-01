import { matchResponseSchema, type MatchResultFromPython } from "../types/matchSchema.js";
import type { SafeAdopter } from "../types/adopter.js";
import type { Dog } from "../types/dog.js";

const MATCHING_SERVICE_URL = process.env.MATCHING_SERVICE_URL
export const TIMEOUT_MS = 15000

type MatchingServiceResult = 
    | { success: true; results: MatchResultFromPython[] }
    | { success: false, error: 'unavailable'}
    | { success: false, error: 'service_error'; status: number}
    | { success: false, error: 'contract_mismatch'; issues: unknown}

export const callMatchingService = async (
    adopter: SafeAdopter,
    dogs: Dog[]
): Promise<MatchingServiceResult> => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

    let response
    try {
        response = await fetch(`${MATCHING_SERVICE_URL}/match`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({adopter, dogs}),
            signal: controller.signal
        })
    } catch (error) {
        return {success: false, error: 'unavailable'}
    } finally {
        clearTimeout(timeout)
    }

    if (!response.ok) {
        return {success: false, error: 'service_error', status: response.status}
    }

    const json = await response.json()
    const parsed = matchResponseSchema.safeParse(json)

    if (!parsed.success) {
        return {success: false, error: 'contract_mismatch', issues: parsed.error.issues}
    }

    return {success: true, results: parsed.data.results}
}