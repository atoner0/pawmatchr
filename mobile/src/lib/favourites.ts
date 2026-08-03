import { MatchWithDog } from "@/types/match";
import { apiFetch } from "./api";

export function addFavourite(dog_id: number): Promise<{ favourite_id: number; dog_id: number; adopter_id: number; saved_at: string}> {
    return apiFetch("/adopter/favourites", {
        method: "POST",
        body: JSON.stringify({ dog_id })
    });
}

export function getFavourites(): Promise<MatchWithDog[]> {
    return apiFetch<{favourites: MatchWithDog[]}>("/adopter/favourites").then(res => res.favourites);
}