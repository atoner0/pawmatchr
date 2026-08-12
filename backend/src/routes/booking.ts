import { Router } from 'express';
import { createBookingController, getAllAdopterBookings, getBooking, getUpcomingBooking } from '../controllers/booking.js';

const router = Router()

router.get('/', getAllAdopterBookings)
router.get('/upcoming', getUpcomingBooking)
router.get('/:applicationId', getBooking)

router.post('/', createBookingController)



export default router