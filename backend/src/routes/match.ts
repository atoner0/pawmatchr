import { Router } from 'express';
import { getMatches } from '../controllers/match.js';

const router = Router()

router.get('/', getMatches)

export default router