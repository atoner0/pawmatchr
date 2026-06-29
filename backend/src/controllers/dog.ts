import type { Request, Response } from 'express';
import { getDogById, getAllAvailableDogs } from '../models/dog.js';
import { createDogSchema } from '../types/dogSchemas.js';
import type { AuthRequest } from '../middleware/auth.js';

export const getDogbyId = async ( req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] as string)
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid dog ID'})
        return
    }

    try {
        const dog = await getDogById(id)
        if(!dog){
            res.status(404).json({ message: 'Dog not found' })
            return
        }

        res.status(200).json(dog)
    } catch (error) {
        res.status(500).json({ message: 'Error during dog search', error})
    }
}

export const getAvailableDogs = async ( req: Request, res: Response): Promise<void> => {
    try {
        const dogs = await getAllAvailableDogs()
        if(!dogs || dogs.length === 0){
            res.status(404).json({ message: 'Dogs not found' })
            return
        }

        res.status(200).json(dogs)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available dogs', error})
    }
}

