import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

import * as AvailabilityModel from '../../src/models/availability.js'
import * as AdminModel from '../../src/models/shelterAdmin.js'
import { fakeAdmin, fakeAvailability } from '../utils/fakeProfiles.js'

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('GET /admin/availability', () => {
    it('gets the availability slots for shelter and returns 200', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByShelter').mockResolvedValue([fakeAvailability])

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get('/admin/availability')

        expect(res.status).toBe(200)
        expect(AvailabilityModel.getAvailabilityByShelter).toHaveBeenCalledTimes(1)
        expect(AvailabilityModel.getAvailabilityByShelter).toHaveBeenCalledWith(fakeAdmin.shelter_id)
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByShelter').mockRejectedValue(new Error('Database error'))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get('/admin/availability')

        expect(res.status).toBe(500)
        expect(AvailabilityModel.getAvailabilityByShelter).toHaveBeenCalledTimes(1)
    })
})

describe('POST /admin/availability', () => {
    it('creates new availability slot for shelter and returns 302', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'createAvailability').mockResolvedValue(fakeAvailability)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post('/admin/availability')
            .send({slot: '2026-08-15T10:00:00.000Z' })

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/admin/availability')

        expect(AvailabilityModel.createAvailability).toHaveBeenCalledTimes(1)
        
        const callArgs = (AvailabilityModel.createAvailability as jest.Mock).mock.calls[0]!
                expect(callArgs[0]).toBe(fakeAdmin.shelter_id)
                expect(callArgs[1]).toBe('2026-08-15T10:00:00.000Z')
    })

    it('should return 400 if slot is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'createAvailability').mockResolvedValue(fakeAvailability)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post('/admin/availability')
            .send({slot: 'abc' })

        expect(res.status).toBe(400)
        expect(AvailabilityModel.createAvailability).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'createAvailability').mockRejectedValue(new Error('Database error'))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post('/admin/availability')
            .send({slot: '2026-08-15T10:00:00.000Z' })

        expect(res.status).toBe(500)
        expect(AvailabilityModel.createAvailability).toHaveBeenCalledTimes(1)
    })
})

describe('GET /admin/availability/:id/edit', () => {
    it('gets the availability slot to be edited and returns 200', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(fakeAvailability)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/availability/${fakeAvailability.availability_id}/edit`)

        expect(res.status).toBe(200)
        expect(AvailabilityModel.getAvailabilityByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(AvailabilityModel.getAvailabilityByIdAndShelter).toHaveBeenCalledWith(fakeAvailability.availability_id, fakeAdmin.shelter_id)
    })

    it('should return 400 if availability id is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(fakeAvailability)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get('/admin/availability/abc/edit')

        expect(res.status).toBe(400)
        expect(AvailabilityModel.getAvailabilityByIdAndShelter).not.toHaveBeenCalled()
    })

    it('should return 404 if availability slot is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(null)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/availability/${fakeAvailability.availability_id}/edit`)

        expect(res.status).toBe(404)
        expect(AvailabilityModel.getAvailabilityByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(AvailabilityModel.getAvailabilityByIdAndShelter).toHaveBeenCalledWith(fakeAvailability.availability_id, fakeAdmin.shelter_id)
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockRejectedValue(new Error('Database error'))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/availability/${fakeAvailability.availability_id}/edit`)

        expect(res.status).toBe(500)
        expect(AvailabilityModel.getAvailabilityByIdAndShelter).toHaveBeenCalledTimes(1)
    })
})

describe('POST /admin/availability/:id/edit', () => {
    it('updates availability slot for shelter and returns 302', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(fakeAvailability)

        jest.spyOn(AvailabilityModel, 'updateAvailability').mockResolvedValue(fakeAvailability)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/availability/${fakeAvailability.availability_id}/edit`)
            .send({slot: '2026-08-18T10:00:00.000Z' })

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/admin/availability')

        expect(AvailabilityModel.updateAvailability).toHaveBeenCalledTimes(1)
        
        const callArgs = (AvailabilityModel.updateAvailability as jest.Mock).mock.calls[0]!
            expect(callArgs[0]).toBe('2026-08-18T10:00:00.000Z')
            expect(callArgs[1]).toBe(fakeAvailability.availability_id)        
            expect(callArgs[2]).toBe(fakeAdmin.shelter_id)
    })

    it('should return 400 if slot is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(fakeAvailability)

        jest.spyOn(AvailabilityModel, 'updateAvailability').mockResolvedValue(fakeAvailability)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/availability/${fakeAvailability.availability_id}/edit`)
            .send({slot: 'abc' })

        expect(res.status).toBe(400)
        expect(AvailabilityModel.updateAvailability).not.toHaveBeenCalled()
    })

    it('should return 400 if availability id is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(fakeAvailability)

        jest.spyOn(AvailabilityModel, 'updateAvailability').mockResolvedValue(fakeAvailability)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/availability/abc/edit`)
            .send({slot: '2026-08-18T10:00:00.000Z' })

        expect(res.status).toBe(400)
        expect(AvailabilityModel.updateAvailability).not.toHaveBeenCalled()
    })

    it('should return 400 if slot is already booked', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(fakeAvailability)

        jest.spyOn(AvailabilityModel, 'updateAvailability').mockResolvedValue(null)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/availability/${fakeAvailability.availability_id}/edit`)
            .send({slot: '2026-08-15T10:00:00.000Z' })

        expect(res.status).toBe(400)
        expect(AvailabilityModel.updateAvailability).toHaveBeenCalledTimes(1)
    })

    it('should return 404 if availability slot is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(null)

        jest.spyOn(AvailabilityModel, 'updateAvailability').mockResolvedValue(fakeAvailability)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/availability/${fakeAvailability.availability_id}/edit`)
            .send({slot: '2026-08-18T10:00:00.000Z' })

        expect(res.status).toBe(404)
        expect(AvailabilityModel.updateAvailability).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(fakeAvailability)

        jest.spyOn(AvailabilityModel, 'updateAvailability').mockRejectedValue(new Error('Database error'))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/availability/${fakeAvailability.availability_id}/edit`)
            .send({slot: '2026-08-18T10:00:00.000Z' })

        expect(res.status).toBe(500)
        expect(AvailabilityModel.updateAvailability).toHaveBeenCalledTimes(1)
    })
})

describe('POST /admin/availability/:id/delete', () => {
    it('deletes availability slot for shelter and returns 302', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(fakeAvailability)

        jest.spyOn(AvailabilityModel, 'deleteAvailability').mockResolvedValue(1)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/availability/${fakeAvailability.availability_id}/delete`)
            

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/admin/availability')

        expect(AvailabilityModel.getAvailabilityByIdAndShelter).toHaveBeenCalledWith(fakeAvailability.availability_id, fakeAdmin.shelter_id)
        expect(AvailabilityModel.deleteAvailability).toHaveBeenCalledWith(fakeAvailability.availability_id, fakeAdmin.shelter_id)

    })

    it('should return 400 if availability id is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(fakeAvailability)

        jest.spyOn(AvailabilityModel, 'deleteAvailability').mockResolvedValue(1)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/availability/abc/delete`)
            

        expect(res.status).toBe(400)
        expect(AvailabilityModel.deleteAvailability).not.toHaveBeenCalled()
    })

    it('should return 400 if slot is already booked', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(fakeAvailability)

        jest.spyOn(AvailabilityModel, 'deleteAvailability').mockResolvedValue(0)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/availability/${fakeAvailability.availability_id}/delete`)
            

        expect(res.status).toBe(400)
        expect(AvailabilityModel.deleteAvailability).toHaveBeenCalledTimes(1)
    })

    it('should return 404 if availability slot is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(null)

        jest.spyOn(AvailabilityModel, 'deleteAvailability').mockResolvedValue(1)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/availability/${fakeAvailability.availability_id}/delete`)
            

        expect(res.status).toBe(404)
        expect(AvailabilityModel.deleteAvailability).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(AvailabilityModel, 'getAvailabilityByIdAndShelter').mockResolvedValue(fakeAvailability)

        jest.spyOn(AvailabilityModel, 'deleteAvailability').mockRejectedValue(new Error('Database error'))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/availability/${fakeAvailability.availability_id}/delete`)
            

        expect(res.status).toBe(500)
        expect(AvailabilityModel.deleteAvailability).toHaveBeenCalledTimes(1)
    })
})

