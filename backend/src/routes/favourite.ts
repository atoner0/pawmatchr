import { Router } from 'express';
import { createFavourite, getFavourites, deleteFavouriteController } from '../controllers/favourite.js';

const router = Router()

router.get('/', getFavourites)
router.post('/', createFavourite)
router.delete('/:dogId', deleteFavouriteController)


export default router