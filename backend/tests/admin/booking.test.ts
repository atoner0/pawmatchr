import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

import * as BookingModel from '../../src/models/booking.js'
import * as AdminModel from '../../src/models/shelterAdmin.js'
import * as ApplicationModel from '../../src/models/application.js'
import * as AdopterModel from '../../src/models/adopter.js'
import { fakeAdmin, fakeAdopterFull, fakeApplicationSubmitted, fakeBookingStats, fakeBookingWithDetails, withDetails } from '../utils/fakeProfiles.js'

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('GET /admin/bookings', () => {
    it('gets all bookings for shelter and returns 200', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(BookingModel, 'getBookingsByShelter').mockResolvedValue([fakeBookingWithDetails])
        jest.spyOn(BookingModel, 'getBookingStats').mockResolvedValue(fakeBookingStats)
        jest.spyOn(BookingModel, 'getUpcomingBookingsByShelter').mockResolvedValue([fakeBookingWithDetails])

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get('/admin/bookings')

        expect(res.status).toBe(200)
        expect(BookingModel.getBookingsByShelter).toHaveBeenCalledTimes(1)
        expect(BookingModel.getBookingsByShelter).toHaveBeenCalledWith(fakeAdmin.shelter_id)

        expect(BookingModel.getBookingStats).toHaveBeenCalledTimes(1)
        expect(BookingModel.getBookingStats).toHaveBeenCalledWith(fakeAdmin.shelter_id)

        expect(BookingModel.getUpcomingBookingsByShelter).toHaveBeenCalledTimes(1)
        expect(BookingModel.getUpcomingBookingsByShelter).toHaveBeenCalledWith(fakeAdmin.shelter_id)
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(BookingModel, 'getBookingsByShelter').mockRejectedValue(new Error('Database error'))
        jest.spyOn(BookingModel, 'getBookingStats').mockResolvedValue(fakeBookingStats)
        jest.spyOn(BookingModel, 'getUpcomingBookingsByShelter').mockResolvedValue([fakeBookingWithDetails])

        /* preventing the console.error from catch blocks cluttering terminal */ 
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get('/admin/bookings')

        expect(res.status).toBe(500)
        expect(BookingModel.getBookingsByShelter).toHaveBeenCalledTimes(1)
        expect(BookingModel.getBookingStats).not.toHaveBeenCalled()
        expect(BookingModel.getUpcomingBookingsByShelter).not.toHaveBeenCalled()

        consoleErrorSpy.mockRestore()
    })
})

describe('GET /admin/bookings/:id', () => {
    it('gets a booking for shelter and returns 200', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(fakeBookingWithDetails)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/bookings/${fakeBookingWithDetails.booking_id}`)

        expect(res.status).toBe(200)
        expect(BookingModel.getBookingByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(BookingModel.getBookingByIdAndShelter).toHaveBeenCalledWith(fakeBookingWithDetails.booking_id, fakeAdmin.shelter_id)

        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledWith(fakeApplicationSubmitted.application_id, fakeAdmin.shelter_id)

        expect(AdopterModel.getAdopterById).toHaveBeenCalledTimes(1)
        expect(AdopterModel.getAdopterById).toHaveBeenCalledWith(fakeApplicationSubmitted.adopter_id)
    })

    it('should return 400 if booking id is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(fakeBookingWithDetails)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/bookings/abc`)

        expect(res.status).toBe(400)
        expect(BookingModel.getBookingByIdAndShelter).not.toHaveBeenCalled()
        expect(ApplicationModel.getAppByIdAndShelter).not.toHaveBeenCalled()
        expect(AdopterModel.getAdopterById).not.toHaveBeenCalled()
    })

    it('should return 404 if booking is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(null)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/bookings/${fakeBookingWithDetails.booking_id}`)

        expect(res.status).toBe(404)
        expect(BookingModel.getBookingByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(BookingModel.getBookingByIdAndShelter).toHaveBeenCalledWith(fakeBookingWithDetails.booking_id, fakeAdmin.shelter_id)
        
        expect(ApplicationModel.getAppByIdAndShelter).not.toHaveBeenCalled()
        expect(AdopterModel.getAdopterById).not.toHaveBeenCalled()
    })

    it('should return 404 if application is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(fakeBookingWithDetails)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(null)
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/bookings/${fakeBookingWithDetails.booking_id}`)

        expect(res.status).toBe(404)
        expect(BookingModel.getBookingByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(BookingModel.getBookingByIdAndShelter).toHaveBeenCalledWith(fakeBookingWithDetails.booking_id, fakeAdmin.shelter_id)
        
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledWith(fakeApplicationSubmitted.application_id, fakeAdmin.shelter_id)

        expect(AdopterModel.getAdopterById).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockRejectedValue(new Error('Database error'))
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        /* preventing the console.error from catch blocks cluttering terminal */ 
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/bookings/${fakeBookingWithDetails.booking_id}`)

        expect(res.status).toBe(500)
        expect(BookingModel.getBookingByIdAndShelter).toHaveBeenCalledTimes(1)      
        expect(ApplicationModel.getAppByIdAndShelter).not.toHaveBeenCalled()
        expect(AdopterModel.getAdopterById).not.toHaveBeenCalled()

        consoleErrorSpy.mockRestore()
    })
}) 

describe('POST /admin/bookings/:id/complete', () => {
    it('should update booking status to complete and return 302', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(fakeBookingWithDetails)
        jest.spyOn(BookingModel, 'updateBookingStatus').mockResolvedValue(fakeBookingWithDetails)


        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/bookings/${fakeBookingWithDetails.booking_id}/complete`)

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe(`/admin/bookings/${fakeBookingWithDetails.booking_id}`)

        expect(BookingModel.updateBookingStatus).toHaveBeenCalledTimes(1)

        const callArgs = (BookingModel.updateBookingStatus as jest.Mock).mock.calls[0]!
            expect(callArgs[0]).toBe(fakeBookingWithDetails.booking_id)
            expect(callArgs[1]).toBe('completed')
            expect(callArgs[2]).toBe(fakeAdmin.shelter_id)
    })

    it('should return 400 if booking is in invalid status to be completed', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue({...fakeBookingWithDetails, status: 'cancelled'})
        jest.spyOn(BookingModel, 'updateBookingStatus').mockResolvedValue({...fakeBookingWithDetails, status: 'cancelled'})


        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/bookings/${fakeBookingWithDetails.booking_id}/complete`)

        expect(res.status).toBe(400)
        expect(BookingModel.updateBookingStatus).not.toHaveBeenCalled()
    })

    it('should return 400 if booking id is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(fakeBookingWithDetails)
        jest.spyOn(BookingModel, 'updateBookingStatus').mockResolvedValue(fakeBookingWithDetails)


        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/bookings/abc/complete`)

        expect(res.status).toBe(400)
        expect(BookingModel.updateBookingStatus).not.toHaveBeenCalled()
    })

    it('should return 404 if booking is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(null)
        jest.spyOn(BookingModel, 'updateBookingStatus').mockResolvedValue(fakeBookingWithDetails)


        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/bookings/${fakeBookingWithDetails.booking_id}/complete`)

        expect(res.status).toBe(404)
        expect(BookingModel.getBookingByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(BookingModel.updateBookingStatus).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(fakeBookingWithDetails)
        jest.spyOn(BookingModel, 'updateBookingStatus').mockRejectedValue(new Error('Database error'))

        /* preventing the console.error from catch blocks cluttering terminal */ 
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})


        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/bookings/${fakeBookingWithDetails.booking_id}/complete`)

        expect(res.status).toBe(500)
        expect(BookingModel.updateBookingStatus).toHaveBeenCalledTimes(1) 

        consoleErrorSpy.mockRestore()
    })
})

describe('POST /admin/bookings/:id/cancel', () => {
    it('should update booking status to cancelled and return 302', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(fakeBookingWithDetails)
        jest.spyOn(BookingModel, 'updateBookingStatus').mockResolvedValue(fakeBookingWithDetails)


        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/bookings/${fakeBookingWithDetails.booking_id}/cancel`)

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe(`/admin/bookings/${fakeBookingWithDetails.booking_id}`)

        expect(BookingModel.updateBookingStatus).toHaveBeenCalledTimes(1)

        const callArgs = (BookingModel.updateBookingStatus as jest.Mock).mock.calls[0]!
            expect(callArgs[0]).toBe(fakeBookingWithDetails.booking_id)
            expect(callArgs[1]).toBe('cancelled')
            expect(callArgs[2]).toBe(fakeAdmin.shelter_id)
    })

    it('should return 400 if booking is in invalid status to be completed', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue({...fakeBookingWithDetails, status: 'completed'})
        jest.spyOn(BookingModel, 'updateBookingStatus').mockResolvedValue({...fakeBookingWithDetails, status: 'completed'})


        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/bookings/${fakeBookingWithDetails.booking_id}/cancel`)

        expect(res.status).toBe(400)
        expect(BookingModel.updateBookingStatus).not.toHaveBeenCalled()
    })

    it('should return 400 if booking id is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(fakeBookingWithDetails)
        jest.spyOn(BookingModel, 'updateBookingStatus').mockResolvedValue(fakeBookingWithDetails)


        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/bookings/abc/cancel`)

        expect(res.status).toBe(400)
        expect(BookingModel.updateBookingStatus).not.toHaveBeenCalled()
    })

    it('should return 404 if booking is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(null)
        jest.spyOn(BookingModel, 'updateBookingStatus').mockResolvedValue(fakeBookingWithDetails)


        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/bookings/${fakeBookingWithDetails.booking_id}/cancel`)

        expect(res.status).toBe(404)
        expect(BookingModel.getBookingByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(BookingModel.updateBookingStatus).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(BookingModel, 'getBookingByIdAndShelter').mockResolvedValue(fakeBookingWithDetails)
        jest.spyOn(BookingModel, 'updateBookingStatus').mockRejectedValue(new Error('Database error'))

        /* preventing the console.error from catch blocks cluttering terminal */ 
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})


        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/bookings/${fakeBookingWithDetails.booking_id}/cancel`)

        expect(res.status).toBe(500)
        expect(BookingModel.updateBookingStatus).toHaveBeenCalledTimes(1) 

        consoleErrorSpy.mockRestore()
    })
})