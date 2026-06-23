import { Router } from "express";
import { getDogbyId, getDogsForShelter, postDog, patchDog, deleteDogController, getAvailableDogs } from "../controllers/dog.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router()

router.get('/dogs/:id', getDogbyId)
router.get('/dogs/available', getAvailableDogs)

router.get('/dogs', requireAdmin, getDogsForShelter)
router.post('/dogs', requireAdmin, postDog)
router.patch('/dogs/:id', requireAdmin, patchDog)
router.delete('/dogs/:id', requireAdmin, deleteDogController)

export default router