import { describe, it, expect, beforeEach, afterEach, afterAll } from '@jest/globals'
import { createBooking, updateBookingStatus } from '../../src/models/booking.js'
import { seedBookingTestData, clearBookingTestData } from './seedHelpers.js'
import testPool from './testPool.js'

afterAll(async () => {
    await testPool.end()
})

describe('createBooking (integration, real DB)', () => {
    let ids: Awaited<ReturnType<typeof seedBookingTestData>>

    beforeEach(async () => {
        ids = await seedBookingTestData()
    })

    afterEach(async () => {
        await clearBookingTestData()
    })

    it('sets is_booked to true after a successful booking', async () => {
        const result = await createBooking(ids.application1Id, ids.availabilityId, 'initial_meet', false)
        expect(result.success).toBe(true)

        const check = await testPool.query(
            `SELECT is_booked FROM availability
            WHERE availability_id = $1`,
            [ids.availabilityId]
        )
        expect(check.rows[0].is_booked).toBe(true)
    })

    it('only allows one of two concurrent bookings on the same slot to succeed', async () => {
        const [res1, res2] = await Promise.all([
            createBooking(ids.application1Id, ids.availabilityId, 'initial_meet', false),
            createBooking(ids.application2Id, ids.availabilityId, 'initial_meet', false),
        ])

        const results = [res1, res2]
        const successes = results.filter(r => r.success)
        const failures = results.filter(r => !r.success)

        expect(successes).toHaveLength(1)
        expect(failures).toHaveLength(1)
        expect(failures[0]).toMatchObject({ success: false, error: 'already_booked'})

        const bookingsCheck = await testPool.query(
            `SELECT * FROM bookings
            WHERE availability_id = $1`,
            [ids.availabilityId]
        )
        expect(bookingsCheck.rows).toHaveLength(1)
    })
})

describe('updateBookingStatus (integration, real DB)', () => {
    let ids: Awaited<ReturnType<typeof seedBookingTestData>>

    beforeEach(async () => {
        ids = await seedBookingTestData()
    })

    afterEach(async () => {
        await clearBookingTestData()
    })

    it('sets availability is_booked to false when booking is cancelled', async () => {
        const result = await updateBookingStatus(ids.bookingId, 'cancelled', ids.shelterId)
        expect(result).not.toBeNull()
        expect(result!.status).toBe('cancelled')

        const check = await testPool.query(
            `SELECT is_booked FROM availability WHERE availability_id = $1`,
            [ids.bookedAvailabilityId]
        )
        expect(check.rows[0].is_booked).toBe(false)
    })

    it('does not change availability is_booked when booking is completed', async () => {
        const result = await updateBookingStatus(ids.bookingId, 'completed', ids.shelterId)
        expect(result).not.toBeNull()
        expect(result!.status).toBe('completed')

        const check = await testPool.query(
            `SELECT is_booked FROM availability WHERE availability_id = $1`,
            [ids.bookedAvailabilityId]
        )
        expect(check.rows[0].is_booked).toBe(true)
    })

    it('returns null and does not update when booking belongs to a different shelter', async () => {
        const result = await updateBookingStatus(ids.bookingId, 'cancelled', ids.otherShelterId)
        expect(result).toBeNull()

        const check = await testPool.query(
            `SELECT status FROM bookings WHERE booking_id = $1`,
            [ids.bookingId]
        )
        expect(check.rows[0].status).toBe('booked')

        const availabilityCheck = await testPool.query(
            `SELECT is_booked FROM availability WHERE availability_id = $1`,
            [ids.bookedAvailabilityId]
        )
        expect(availabilityCheck.rows[0].is_booked).toBe(true)
    })
})       