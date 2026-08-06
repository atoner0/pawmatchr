import { apiFetch } from "./api";
import { Availability } from "@/types/availability";

export const getAvailability = async (shelterId: number): Promise<Availability[]> => {
    return apiFetch<Availability[]>(`/adopter/availability/${shelterId}`)
}