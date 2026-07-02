import { Router } from 'express';
import { createBookingController, getBooking } from '../controllers/booking.js';

const router = Router()

router.get('/:applicationId', getBooking)

router.post('/', createBookingController)



export default router