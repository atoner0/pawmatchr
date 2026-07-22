import { Router } from 'express';
import { requireAdopter } from '../middleware/auth.js';
import favouriteRoutes from './favourite.js'
import applicationRoutes from './application.js'
import questionnaireRoutes from './questionnaire.js'
import bookingRoutes from './booking.js'
import matchRoutes from './match.js'

const router = Router()

router.use(requireAdopter)

router.use('/favourites', favouriteRoutes)
router.use('/applications', applicationRoutes)
router.use('/questionnaire', questionnaireRoutes)
router.use('/bookings', bookingRoutes)
router.use('/matches', matchRoutes)

export default router