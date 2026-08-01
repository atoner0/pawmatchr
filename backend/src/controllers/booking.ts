import type { Response } from 'express';
import type { AdopterAuthRequest } from '../middleware/auth.js';
import { createBooking, getBookingByApplication } from '../models/booking.js';
import { getOneAdopterApp } from '../models/application.js';
import { createBookingSchema } from '../types/bookingSchema.js';

export const createBookingController = async ( req: AdopterAuthRequest, res: Response): Promise<void> => {
    try {
        const result = createBookingSchema.safeParse(req.body)
            if (!result.success){
                res.status(400).json({ message: 'Invalid request', errors: result.error.issues})
                return
            }
        
        const application = await getOneAdopterApp(result.data.application_id)
        if (!application) {
            res.status(404).json({ message: 'Application not found' })
            return
        }

        const adopter = req.user

        if (application.adopter_id !== adopter.adopter_id) {
            res.status(403).json({ message: 'Not your application' })
            return
        }

        const bookingResult = await createBooking(
            application.application_id, 
            result.data.availability_id,
            result.data.booking_type, 
            result.data.multi_pet_guidance
        )

        if (!bookingResult.success) {
            const statusMap = {
                not_found: 404,
                already_booked: 409,
                guidance_required: 400,
            } as const
            res.status(statusMap[bookingResult.error]).json({ message: bookingResult.error})
            return
        }

        res.status(201).json(bookingResult.booking)

        
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error})
    }
}

export const getBooking = async( req: AdopterAuthRequest, res: Response): Promise<void> => {
    const applicationId = parseInt(req.params['applicationId'] as string)
    if (isNaN(applicationId)) {
        res.status(400).json({ message: 'Invalid application ID'})
        return
    }

    try {
        const adopter = req.user

        const application = await getOneAdopterApp(applicationId)
        if(!application) {
            res.status(404).json({ message: 'Application not found' })
            return
        }

        if (application.adopter_id !== adopter.adopter_id) {
            res.status(403).json({ message: 'Not your application' })
            return
        }

        const bookings = await getBookingByApplication(applicationId)
        res.status(200).json(bookings)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error })
    }
}