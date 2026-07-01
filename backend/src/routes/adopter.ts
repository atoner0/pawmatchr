import { Router } from 'express';
import { requireAdopter } from '../middleware/auth.js';
import favouriteRoutes from './favourite.js'
import applicationRoutes from './application.js'
import questionnaireRoutes from './questionnaire.js'

const router = Router()

router.use(requireAdopter)

router.use('/favourites', favouriteRoutes)
router.use('/applications', applicationRoutes)
router.use('/questionnaire', questionnaireRoutes)

export default router