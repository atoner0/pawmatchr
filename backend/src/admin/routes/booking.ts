import { Router } from 'express';
import { renderBookings, renderSingleBooking, postCancelBooking, postCompleteBooking } from '../controllers/booking.js';
const router = Router()

router.get('/', renderBookings)
router.get('/:id', renderSingleBooking)

router.post('/:id/complete', postCompleteBooking)
router.post('/:id/cancel', postCancelBooking)

export default router