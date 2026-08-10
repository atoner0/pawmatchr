import type { Response } from 'express';
import type { AdopterAuthRequest } from '../middleware/auth.js';
import { getMatchesByAdopterId, createMatches } from '../models/match.js';
import { callMatchingService } from '../services/matchingService.js';
import { getAllAvailableDogs } from '../models/dog.js';

export const getMatches = async (req: AdopterAuthRequest, res: Response): Promise<void> => {
    try {
        const adopter = req.user!

        const cached = await getMatchesByAdopterId(adopter.adopter_id)

        if (cached.length > 0) {
            res.status(200).json(cached)
            return
        }

        const dogs = await getAllAvailableDogs()
        const result = await callMatchingService(adopter, dogs)

        if (!result.success) {
            const statusMap = {
                unavailable: 503,
                service_error: 502,
                contract_mismatch: 500,
            } as const
            res.status(statusMap[result.error]).json({ message: 'Unable to generate matches right now'})
            return
        }

        await createMatches(adopter.adopter_id, result.results)

        const matches = await getMatchesByAdopterId(adopter.adopter_id)

        res.status(200).json(matches)
    } catch (error) {
        console.error('Error generating matches:', error)
        res.status(500).json({ message: 'Something went wrong generating matches'})
    }
}

