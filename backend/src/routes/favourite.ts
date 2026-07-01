import { Router } from 'express';
import { createFavourite, getFavourites, deleteFavouriteController } from '../controllers/favourite.js';
import { requireAdopter } from '../middleware/auth.js';

const router = Router()

router.get('/adopter/favourites')


export default router