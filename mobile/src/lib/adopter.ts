import { apiFetch } from "./api";

export const markMatchesReviewed = async (): Promise<{ adopter_id: number; matches_reviewed: boolean}> => {
    const response = await apiFetch<{ adopter: { adopter_id: number; matches_reviewed: boolean} }>("/adopter/matches/reviewed", {
        method: "PATCH",
    });
    return response.adopter
}