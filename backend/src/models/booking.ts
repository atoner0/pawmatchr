import pool from '../config/db.js'
import type { Availability } from '../types/availability.js';
import type { Booking } from '../types/booking.js'
import type { BookingStatus } from '../types/bookingSchema.js'

type CreateBookingResult = 
    | { success: true; booking: Booking }
    | { success: false; error: 'not_found' | 'already_booked' | 'guidance_required' }

export const createBooking = async (
    application_id: number,
    availability_id: number,
    multi_pet_guidance: boolean
): Promise<CreateBookingResult> => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const availabilityResult = await client.query<Availability>(
            `SELECT * FROM availability
            WHERE availability_id = $1
            FOR UPDATE`,
            [availability_id] 
        )

        const availability = availabilityResult.rows[0]

        if (!availability) {
            await client.query('ROLLBACK')
            return { success: false, error: 'not_found'}
        }


        if (availability.is_booked) {
            await client.query('ROLLBACK')
            return { success: false, error: 'already_booked'}
        }

        if (availability.booking_type === 'pet_introduction' && !multi_pet_guidance) {
            await client.query('ROLLBACK')
            return { success: false, error: 'guidance_required'}
        }

        const bookingResult = await client.query<Booking>(
            `INSERT INTO bookings (application_id, availability_id, multi_pet_guidance)
            VALUES ($1, $2, $3) RETURNING *`,
            [application_id, availability_id, multi_pet_guidance]
        )

        const booking = bookingResult.rows[0]
        if (!booking) {
            throw new Error('Booking insert did not return a row')
        }

        await client.query(
            `UPDATE availability
            SET is_booked = true
            WHERE availability_id = $1`,
            [availability_id]
        )

        await client.query('COMMIT')

        return { success: true, booking }

    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

export const getBookingByApplication = async (application_id: number): Promise<Booking[]> => {
    const result = await pool.query<Booking>(
        `SELECT * FROM bookings
        WHERE application_id = $1`,
        [application_id]
    )
    return result.rows
}