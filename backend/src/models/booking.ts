import pool from '../config/db.js'
import type { Booking, BookingWithDetails } from '../types/booking.js'
import type { BookingStatus, BookingType } from '../types/bookingSchema.js'

type CreateBookingResult = 
    | { success: true; booking: Booking }
    | { success: false; error: 'not_found' | 'already_booked' | 'guidance_required' }

export const createBooking = async (
    application_id: number,
    availability_id: number,
    booking_type: BookingType,
    multi_pet_guidance: boolean
): Promise<CreateBookingResult> => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const availabilityResult = await client.query(
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

        if (booking_type === 'pet_introduction' && !multi_pet_guidance) {
            await client.query('ROLLBACK')
            return { success: false, error: 'guidance_required'}
        }

        const bookingResult = await client.query(
            `INSERT INTO bookings (application_id, availability_id, booking_type, multi_pet_guidance)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [application_id, availability_id, booking_type, multi_pet_guidance]
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
    const result = await pool.query(
        `SELECT * FROM bookings
        WHERE application_id = $1`,
        [application_id]
    )
    return result.rows
}

export const getBookingsByShelter = async (shelter_id: number): Promise<BookingWithDetails[]> => {
    const result = await pool.query(
        `SELECT bookings.*,
            availability.slot,
            dogs.name AS dog_name,
            adopters.first_name, adopters.last_name
        FROM bookings
        JOIN availability ON bookings.availability_id = availability.availability_id
        JOIN applications on bookings.application_id = applications.application_id
        JOIN dogs on applications.dog_id = dogs.dog_id
        JOIN adopters on applications.adopter_id = adopters.adopter_id
        WHERE dogs.shelter_id = $1
        ORDER BY availability.slot ASC`,
        [shelter_id]
    )
    return result.rows
}

export const getUpcomingBookingsByShelter = async (shelter_id: number, limit: number = 3): Promise<BookingWithDetails[]> => {
    const result = await pool.query(
        `SELECT bookings.*,
            availability.slot,
            dogs.name AS dog_name,
            adopters.first_name, adopters.last_name
        FROM bookings
        JOIN availability ON bookings.availability_id = availability.availability_id
        JOIN applications ON bookings.application_id = applications.application_id
        JOIN dogs ON applications.dog_id = dogs.dog_id
        JOIN adopters ON applications.adopter_id = adopters.adopter_id
        WHERE dogs.shelter_id = $1
        AND availability.slot > now()
        AND bookings.status = 'booked'
        ORDER BY availability.slot ASC
        LIMIT $2`,
        [shelter_id, limit]
    )
    return result.rows
}

export const getBookingStats = async (shelter_id: number) => {
    const result = await pool.query(
        `SELECT bookings.booking_type, COUNT(*) as count
        FROM bookings
        JOIN applications ON bookings.application_id = applications.application_id
        JOIN dogs ON applications.dog_id = dogs.dog_id
        WHERE dogs.shelter_id = $1
        GROUP BY bookings.booking_type`,
        [shelter_id]
    )

    const stats = {
        total: 0,
        initial_meet: 0,
        home_check: 0,
        pet_introduction: 0
    }

    for (const row of result.rows) {
        stats[row.booking_type as BookingType] = parseInt(row.count)
        stats.total += parseInt(row.count)
    }

    return stats
}

export const getBookingByIdAndShelter = async (booking_id: number, shelter_id: number): Promise<BookingWithDetails | null> => {
    const result = await pool.query(
        `SELECT bookings.*,
            availability.slot, 
            dogs.name AS dog_name,
            adopters.first_name, adopters.last_name
        FROM bookings
        JOIN availability ON bookings.availability_id = availability.availability_id
        JOIN applications on bookings.application_id = applications.application_id
        JOIN dogs on applications.dog_id = dogs.dog_id
        JOIN adopters on applications.adopter_id = adopters.adopter_id
        WHERE booking_id = $1 AND dogs.shelter_id = $2`,
        [booking_id, shelter_id]
    )
    return result.rows[0] ?? null
}

export const updateBookingStatus = async (
    booking_id: number, 
    status: BookingStatus, 
    shelter_id: number
): Promise<Booking | null > => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const result = await client.query(
            `UPDATE bookings
            SET status = $1
            FROM applications, dogs
            WHERE bookings.booking_id = $2
            AND bookings.application_id = applications.application_id
            AND applications.dog_id = dogs.dog_id
            AND dogs.shelter_id = $3
            RETURNING bookings.*`,
            [status, booking_id, shelter_id]
        )

        const booking = result.rows[0]

        if (!booking) {
            await client.query('ROLLBACK')
            return null
        }

        if(status === 'cancelled'){
            await client.query(
                `UPDATE availability
                SET is_booked = false
                WHERE availability_id = $1`,
                [booking.availability_id]
            )
        }

        await client.query('COMMIT')
        return booking
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}