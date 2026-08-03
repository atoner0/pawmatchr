import { Router } from 'express';
import { getMatches } from '../controllers/match.js';
import { markMatchesReviewedController } from '../controllers/adopter.js';

const router = Router()

router.get('/', getMatches)
router.patch('/reviewed', markMatchesReviewedController)

export default router