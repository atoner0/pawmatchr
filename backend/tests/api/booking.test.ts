import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

import * as BookingModel from '../../src/models/booking.js'
import * as ApplicationModel from '../../src/models/application.js'
import * as AdopterModel from '../../src/models/adopter.js'
import { createTestToken } from '../utils/createTestToken.js'
import { fakeAdopterPartial, fakeApplicationOtherAdopter, fakeApplicationSubmitted, fakeBooking, fakeBookingPetIntroduction, fakeBookingPetIntroductionWithDetails, fakeBookingWithDetails, withDetails } from '../utils/fakeProfiles.js'

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('GET /api/adopter/bookings/:applicationId', () => {
    it('gets bookings for application and returns 200', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'getBookingByApplication').mockResolvedValue([fakeBookingWithDetails, fakeBookingPetIntroductionWithDetails])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/bookings/1')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(200)
    })

    it('gets bookings for application and returns 200, even if array is empty', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'getBookingByApplication').mockResolvedValue([])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/bookings/1')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(200)
    })

    it('should return 400 if id is invalid', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'getBookingByApplication').mockResolvedValue([fakeBookingWithDetails, fakeBookingPetIntroductionWithDetails])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/bookings/abc')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid application ID')
    })

    it('should return 401 if missing token', async () => {
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'getBookingByApplication').mockResolvedValue([fakeBookingWithDetails, fakeBookingPetIntroductionWithDetails])

        const res = await request(app)
        .get('/api/adopter/bookings/1')

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 404 if application not found', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(null)
        jest.spyOn(BookingModel, 'getBookingByApplication').mockResolvedValue([])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/bookings/1')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Application not found')
    })

    it('should return 403 if application belongs to a different adopter', async () => {
    jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
    jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationOtherAdopter))
    jest.spyOn(BookingModel, 'getBookingByApplication').mockResolvedValue([])

    const adopterToken = createTestToken({ id: 1, type: 'adopter' })

    const res = await request(app)
        .get('/api/adopter/bookings/6')
        .set('Authorization', `Bearer ${adopterToken}`)

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Not your application')
})

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'getBookingByApplication').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/bookings/1')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error fetching bookings')
    })
}) 

describe('POST /api/adopter/bookings', () => {
    it('creates booking and returns 201', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'createBooking').mockResolvedValue({
            success: true,
            booking: fakeBooking
        })

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/bookings')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({
            application_id: 1,
            availability_id: 1,
            booking_type: 'initial_meet',
            multi_pet_guidance: false
        })

      expect(res.status).toBe(201)
      expect(res.body).toEqual(fakeBooking)
    })

    it('creates booking for pet introduction and returns 201', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'createBooking').mockResolvedValue({
            success: true,
            booking: fakeBookingPetIntroduction
        })

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/bookings')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({
            application_id: 1,
            availability_id: 1,
            booking_type: 'pet_introduction',
            multi_pet_guidance: true
        })

      expect(res.status).toBe(201)
      expect(res.body).toEqual(fakeBookingPetIntroduction)
    })

    it('should return 400 if zod schema is invalid', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'createBooking').mockResolvedValue({
            success: true,
            booking: fakeBooking
        })

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/bookings')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({
            application_id: 1,
            availability_id: 'four',
            booking_type: 'initial_meet',
            multi_pet_guidance: false
        })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Invalid request')
    })

    it('should return 401 if missing token', async () => {
    jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
    jest.spyOn(BookingModel, 'createBooking').mockResolvedValue({
        success: true,
        booking: fakeBooking
    })

    const res = await request(app)
        .post('/api/adopter/bookings')
        .send({
            application_id: 1,
            availability_id: 1,
            booking_type: 'initial_meet',
            multi_pet_guidance: false
        })

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 404 if application not found', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(null)
        jest.spyOn(BookingModel, 'createBooking').mockResolvedValue({
            success: true,
            booking: fakeBooking
        })

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/bookings')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({
            application_id: 1,
            availability_id: 1,
            booking_type: 'initial_meet',
            multi_pet_guidance: false
        })

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Application not found')
    })

    it('should return 403 if application belongs to a different adopter', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationOtherAdopter))
        jest.spyOn(BookingModel, 'createBooking').mockResolvedValue({
            success: true,
            booking: fakeBooking
        })

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/bookings')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({
            application_id: 6,
            availability_id: 1,
            booking_type: 'initial_meet',
            multi_pet_guidance: false
        })

        expect(res.status).toBe(403)
        expect(res.body.message).toBe('Not your application')
    })

    it('should return 404 if availability slot not found', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'createBooking').mockResolvedValue({
            success: false,
            error: 'not_found'
        })

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/bookings')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({
            application_id: 1,
            availability_id: 10,
            booking_type: 'initial_meet',
            multi_pet_guidance: false
        })

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('not_found')
    })

    it('should return 409 if slot is already booked', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'createBooking').mockResolvedValue({
            success: false,
            error: 'already_booked'
        })

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/bookings')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({
            application_id: 1,
            availability_id: 11,
            booking_type: 'initial_meet',
            multi_pet_guidance: false
        })

      expect(res.status).toBe(409)
      expect(res.body.message).toBe('already_booked')
    })

    it('should return 400 if multi pet guidance needs to be read', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'createBooking').mockResolvedValue({
            success: false,
            error: 'guidance_required'
        })

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/bookings')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({
            application_id: 1,
            availability_id: 11,
            booking_type: 'pet_introduction',
            multi_pet_guidance: false
        })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('guidance_required')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(BookingModel, 'createBooking').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/bookings')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({
            application_id: 1,
            availability_id: 1,
            booking_type: 'initial_meet',
            multi_pet_guidance: false
        })

      expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error creating booking')
    })
})