import { apiFetch } from "./api";
import { MatchWithDog } from "@/types/match";

export const getMatches = async (): Promise<MatchWithDog[]> => {
    return apiFetch<MatchWithDog[]>("/adopter/matches");
}