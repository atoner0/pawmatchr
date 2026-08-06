import { Router } from 'express';
import { getAvailableSlots } from '../controllers/availability.js';

const router = Router()

router.get('/:shelterId', getAvailableSlots)


export default router