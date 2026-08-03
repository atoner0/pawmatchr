import { apiFetch } from "./api";

export function markMatchesReviewed(): Promise<{ adopter_id: number; matches_reviewed: boolean }> {
    return apiFetch("/adopter/matches/reviewed", {
        method: "PATCH",
    });
}