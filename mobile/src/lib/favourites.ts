import { apiFetch } from "./api";

export function addFavourite(dog_id: number): Promise<{ favourite_id: number; dog_id: number; adopter_id: number; saved_at: string}> {
    return apiFetch("/adopter/favourites", {
        method: "POST",
        body: JSON.stringify({ dog_id })
    });
}