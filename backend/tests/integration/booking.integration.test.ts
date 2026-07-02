import { describe, it, expect, beforeEach, afterEach, afterAll } from '@jest/globals'
import { createBooking } from '../../src/models/booking.js'
import { seedBookingTestData, clearBookingTestData } from './seedHelpers.js'
import testPool from './testPool.js'

describe('createBooking (integration, real DB', () => {
    let ids: Awaited<ReturnType<typeof seedBookingTestData>>

    beforeEach(async () => {
        ids = await seedBookingTestData()
    })

    afterEach(async () => {
        await clearBookingTestData()
    })

    afterAll(async () => {
        await testPool.end()
    })

    it('sets is_booked to true after a successful booking', async () => {
        const result = await createBooking(ids.application1Id, ids.availabilityId, false)
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
            createBooking(ids.application1Id, ids.availabilityId, false),
            createBooking(ids.application2Id, ids.availabilityId, false),
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