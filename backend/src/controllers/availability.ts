import type { Response } from "express"; 
import type { AdopterAuthRequest } from "../middleware/auth.js";
import { getAvailabilityByShelter } from "../models/availability.js";

export const getAvailableSlots = async (req: AdopterAuthRequest, res: Response): Promise<void> => {
    const shelterId = parseInt(req.params['shelterId'] as string)
    if (isNaN(shelterId)) {
        res.status(400).json({ message: 'Invalid shelter ID'})
        return
    }

    try {
        const slots = await getAvailabilityByShelter(shelterId)
        const availableSlots = slots.filter(slot => !slot.is_booked)
        res.status(200).json(availableSlots)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availability', error})
    }
}