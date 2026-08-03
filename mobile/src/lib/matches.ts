import { apiFetch } from "./api";
import { MatchWithDog } from "@/types/match";

export function getMatches(): Promise<MatchWithDog[]> {
    return apiFetch<MatchWithDog[]>("/adopter/matches");
}