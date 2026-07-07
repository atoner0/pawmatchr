import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { getBookingByIdAndShelter, getBookingsByShelter, updateBookingStatus } from '../../models/booking.js';
import { getAdopterById } from '../../models/adopter.js';
import { getAppByIdAndShelter } from '../../models/application.js';

export const renderBookings = async (req: AuthRequest, res: Response) => {
    try {
        const shelterId = req.user.shelter_id
        const bookings = await getBookingsByShelter(shelterId)

        res.render('bookings/all', { title: 'Bookings', bookings: bookings})
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
}

export const renderSingleBooking = async (req: AuthRequest, res: Response) => {
    const bookingId = parseInt(req.params['id'] as string)
    if (isNaN(bookingId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid booking ID' })
        return
    }

    try {
        const shelterId = req.user.shelter_id

        const booking = await getBookingByIdAndShelter(bookingId, shelterId)
        if (!booking){
            res.status(404).render('error', { title: 'Error', message: 'Booking not found' })
            return
        }

        const application = await getAppByIdAndShelter(booking.application_id, shelterId)
        if(!application){
            res.status(404).render('error', { title: 'Error', message: 'Application not found' })
            return
        }

        const adopter = await getAdopterById(application.adopter_id)

        res.render('bookings/view', {
            title: 'Bookings',
            user: req.user,
            application: application,
            adopter: adopter,
            booking: booking,
        })
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
}

export const postCompleteBooking = async (req: AuthRequest, res: Response) => {
    const bookingId = parseInt(req.params['id'] as string)
    if (isNaN(bookingId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid booking ID' })
        return
    }
    
    try {
        const shelterId = req.user.shelter_id

        const booking = await getBookingByIdAndShelter(bookingId, shelterId)
        if (!booking){
            res.status(404).render('error', { title: 'Error', message: 'Booking not found' })
            return
        }

        if(booking.status !== 'booked') {
            res.status(400).render('error', { title: 'Error', message: 'Booking cannot be moved to completed from its current status' })
            return
        }

        await updateBookingStatus(bookingId, 'completed', shelterId)

        res.redirect(`/admin/bookings/${bookingId}`)

    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong when updating booking status' })
    }
}

export const postCancelBooking = async (req: AuthRequest, res: Response) => {
    const bookingId = parseInt(req.params['id'] as string)
    if (isNaN(bookingId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid booking ID' })
        return
    }
    
    try {
        const shelterId = req.user.shelter_id

        const booking = await getBookingByIdAndShelter(bookingId, shelterId)
        if (!booking){
            res.status(404).render('error', { title: 'Error', message: 'Booking not found' })
            return
        }

        if(booking.status !== 'booked') {
            res.status(400).render('error', { title: 'Error', message: 'Booking cannot be moved to cancelled from its current status' })
            return
        }

        await updateBookingStatus(bookingId, 'cancelled', shelterId)

        res.redirect(`/admin/bookings/${bookingId}`)

    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong when updating booking status' })
    }
}