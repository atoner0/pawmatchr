import { MatchWithDog } from "@/types/match";
import { apiFetch } from "./api";
import { Favourite } from "@/types/favourite";

export const addFavourite = async (dog_id: number): Promise<Favourite> => {
    const response = await apiFetch<{ favourite: Favourite }>("/adopter/favourites", {
        method: "POST",
        body: JSON.stringify({ dog_id })
    });
    return response.favourite
}

export const getFavourites = async (): Promise<MatchWithDog[]> => {
    const response = await apiFetch<{favourites: MatchWithDog[]}>("/adopter/favourites");
    return response.favourites
}