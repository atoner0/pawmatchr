import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { getFavouritesByAdopter, addFavourite, deleteFavourite } from '../models/favourite.js';
import { createFavouriteSchema } from '../types/favouriteSchema.js';
import { getDogById } from '../models/dog.js';

export const createFavourite = async ( req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = createFavouriteSchema.safeParse(req.body)
            if (!result.success){
                res.status(400).json({ message: 'Invalid request', errors: result.error.issues})
                return
            }

        const dog_id = result.data.dog_id
        const adopter = req.user

        const dog = await getDogById(dog_id)
        if (!dog) {
            res.status(404).json({ message: 'Dog not found' })
            return
        }

        const favourite = await addFavourite(adopter.adopter_id, dog_id)
        res.status(201).json({favourite})
    } catch (error: any) {
        if(error.code === '23505'){
            res.status(409).json({ message: 'Dog already favourited'})
            return
        }

        res.status(500).json({ message: 'Error favouriting dog', error})
    }
}

export const getFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const adopter = req.user

        const favourites = await getFavouritesByAdopter(adopter.adopter_id)

        res.status(200).json({favourites})
    } catch (error) {
        res.status(500).json({ message: 'Error fetching adopter favourites', error})
    }
}

export const deleteFavouriteController = async (req: AuthRequest, res: Response): Promise<void> => {
    const dogId = parseInt(req.params['id'] as string)
    if (isNaN(dogId)) {
        res.status(400).json({ message: 'Invalid application ID'})
        return
    }
    
    try {
        const adopter = req.user

        const deletedCount = await deleteFavourite(adopter.adopter_id, dogId)
        if (deletedCount === 0){
            res.status(404).json({ message: 'Favourite not found'})
            return
        }

        res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: 'Error deleting favourite', error})
    }
}