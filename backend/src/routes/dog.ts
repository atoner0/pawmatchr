import { Router } from "express";
import { getDogbyId, getAvailableDogs } from "../controllers/dog.js";

const router = Router()

router.get('/dogs/available', getAvailableDogs)
router.get('/dogs/:id', getDogbyId)

export default router