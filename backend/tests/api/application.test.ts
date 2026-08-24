import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

import * as ApplicationModel from '../../src/models/application.js'
import * as AdopterModel from '../../src/models/adopter.js'
import * as AdminModel from '../../src/models/shelterAdmin.js'
import { createTestToken } from '../utils/createTestToken.js'

import { fakeAdopterPartial, fakeApplicationNotReady, fakeApplicationReady, fakeAdmin, fakeApplicationSubmitted, fakeApplicationWithdrawn, fakeApplicationUnderReview, fakeApplicationApproved, fakeApplicationOtherAdopter, fakeApplicationAdopted, fakeApplicationWithdrawnUpdated, withDetails } from '../utils/fakeProfiles.js'

beforeEach(() => {
  jest.restoreAllMocks()
})

//gets all applications from one adopter
describe('GET /api/adopter/applications', () => {
    it('gets the adopters applications and returns 200', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getAllAdopterApps').mockResolvedValue([withDetails(fakeApplicationReady), withDetails(fakeApplicationNotReady)])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/applications')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(200)
    })

    it('should return 401 if missing token', async () => {
        jest.spyOn(ApplicationModel, 'getAllAdopterApps').mockResolvedValue([withDetails(fakeApplicationReady), withDetails(fakeApplicationNotReady)])

        const res = await request(app)
      .get('/api/adopter/applications')

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Authentication required')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getAllAdopterApps').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
      .get('/api/adopter/applications')
      .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error fetching adopter applications')
    })
})

//gets a single application based on its id
describe('GET /api/adopter/applications/:id', () => {
    it('gets the adopter application and returns 200', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationReady))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/applications/1')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(200)
        expect(res.body.application.adopter_id).toBe(1)
    })

    it('should return 400 if id is invalid', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationReady))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/applications/abc')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid application ID')
    })

    it('should return 401 if missing token', async () => {
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationReady))

        const res = await request(app)
        .get('/api/adopter/applications/1')

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 404 if application not found', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(null)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/applications/1')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Application not found')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/applications/1')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error fetching adopter application')
    })
})

describe('POST /api/adopter/applications', () => {
    it('creates the adopter applications and returns 201', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getActiveApplicationsByDogAndAdopter').mockResolvedValue(null)

        jest.spyOn(ApplicationModel, 'createApplication').mockResolvedValue(fakeApplicationReady)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/applications')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ dog_id: 1 })

        expect(res.status).toBe(201)
        expect(res.body.application.adopter_id).toBe(1)
    })

    it('should return 409 if an application exists already for this dog', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getActiveApplicationsByDogAndAdopter').mockResolvedValue(fakeApplicationReady)

        jest.spyOn(ApplicationModel, 'createApplication').mockResolvedValue(fakeApplicationReady)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/applications')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ dog_id: 1 })

        expect(res.status).toBe(409)
        expect(ApplicationModel.createApplication).not.toHaveBeenCalled()
        expect(res.body.message).toBe('An active application already exists for this dog')
        expect(res.body.application).toEqual(fakeApplicationReady)
    })

    it('should return 400 if request body is invalid', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getActiveApplicationsByDogAndAdopter').mockResolvedValue(null)

        jest.spyOn(ApplicationModel, 'createApplication').mockResolvedValue(fakeApplicationReady)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/applications')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ dog_id: 'four' })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid request')
    })

    it('should return 401 if missing token', async () => {
        jest.spyOn(ApplicationModel, 'createApplication').mockResolvedValue(fakeApplicationReady)

        jest.spyOn(ApplicationModel, 'getActiveApplicationsByDogAndAdopter').mockResolvedValue(null)

        const res = await request(app)
        .post('/api/adopter/applications')
        .send({ dog_id: 1 })

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getActiveApplicationsByDogAndAdopter').mockResolvedValue(null)

        jest.spyOn(ApplicationModel, 'createApplication').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/applications')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ dog_id: 1 })

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error creating application')
    })
})

describe('PATCH /api/adopter/applications/:id/checklist', () => {
    it('updates the adopter application readiness checklist and returns 200', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationReady))
        jest.spyOn(ApplicationModel, 'updateReadinessCheck').mockResolvedValue(fakeApplicationReady)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/checklist')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ readiness_checklist: true })

        expect(res.status).toBe(200)
        expect(res.body.application.status).toBe('submitted')
    })

    it('should return 400 if request body is invalid', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationReady))
        jest.spyOn(ApplicationModel, 'updateReadinessCheck').mockResolvedValue(fakeApplicationReady)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/checklist')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ readiness_checklist: 'true' })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid request')
    })

    it('should return 400 if id is invalid', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationReady))
        jest.spyOn(ApplicationModel, 'updateReadinessCheck').mockResolvedValue(fakeApplicationReady)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/abc/checklist')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ readiness_checklist: true })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid application ID')
    })

    it('should return 403 if userType is not adopter', async () => {
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationReady))
        jest.spyOn(ApplicationModel, 'updateReadinessCheck').mockResolvedValue(fakeApplicationReady)

        const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/checklist')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ readiness_checklist: true })

        expect(res.status).toBe(403)
        expect(res.body.message).toBe('Adopter access only')
    })

    it('should return 404 if application not found', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(null)
        jest.spyOn(ApplicationModel, 'updateReadinessCheck').mockResolvedValue(fakeApplicationReady)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/checklist')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ readiness_checklist: true })

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Application not found')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationReady))
        jest.spyOn(ApplicationModel, 'updateReadinessCheck').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/checklist')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ readiness_checklist: true })

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error updating readiness checklist')
    })
})

describe('PATCH /adopter/applications/:id/withdraw', () => {
    it('application moves from submitted to withdrawn and returns 200', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationWithdrawn)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/withdraw')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(200)
        expect(res.body.application.status).toBe('withdrawn')
    })

    it('application moves from under review to withdrawn and returns 200', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationUnderReview))
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationWithdrawn)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/withdraw')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(200)
        expect(res.body.application.status).toBe('withdrawn')
    })

    it('application moves from approved to withdrawn and returns 200', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationApproved))
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationWithdrawn)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/withdraw')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(200)
        expect(res.body.application.status).toBe('withdrawn')
    })

    it('should return 400 if application id not valid', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationWithdrawn)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/abc/withdraw')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid application ID')
    })

    it('should return 404 if application not found', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(null)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/withdraw')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Application not found')
    })

    it('should return 403 if userId does not match that on application', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationOtherAdopter))
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationWithdrawn)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/withdraw')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(403)
        expect(res.body.message).toBe('Not your application')
    })

    it('should return 400 if application status is adopted', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationAdopted))
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationWithdrawn)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/withdraw')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Application cannot be withdrawn from its current status')
    })

    it('should return 400 if application status is already withdrawn', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationWithdrawn))
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationWithdrawnUpdated)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/withdraw')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Application cannot be withdrawn from its current status')
    })

    it('should return 401 if missing token', async () => {
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationAdopted))
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationWithdrawn)

        const res = await request(app)
        .patch('/api/adopter/applications/1/withdraw')

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(withDetails(fakeApplicationSubmitted))
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/withdraw')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error withdrawing application')
    })
})