import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../src/app.js'

import * as ApplicationModel from '../src/models/application.js'
import * as AdopterModel from '../src/models/adopter.js'
import * as AdminModel from '../src/models/shelterAdmin.js'
import { createTestToken } from './utils/createTestToken.js'
import type { Application } from '../src/types/application.js'

const fakeAdopter = {
  adopter_id: 1,
  first_name: "Test",
  last_name: "User",
  email: "test@test.com",
  password_hash: "hash",
  phone: "07700000000",
  postcode: "BT35 9SP"
}

const fakeAdmin = {
  staff_id: 10,
  shelter_id: 5,
  name: "Sarah Connor",
  email: "admin@shelter.com",
  password_hash: "hashed_password",
  phone: "07712345678"
}

const fakeApplicationReady: Application = {
    application_id: 1,
    dog_id: 1,
    adopter_id: 1,
    status: 'submitted',
    readiness_checklist: true,
    submitted_at: '2026-01-01T00:00:00.000Z',
    decision_at: null,
    adopted_at: null
}

const fakeApplicationReadyUpdated: Application = {
    application_id: 1,
    dog_id: 1,
    adopter_id: 1,
    status: 'under_review',
    readiness_checklist: true,
    submitted_at: '2026-01-01T00:00:00.000Z',
    decision_at: null,
    adopted_at: null
}

const fakeApplicationNotReady: Application = {
    application_id: 2,
    dog_id: 4,
    adopter_id: 3,
    status: 'submitted',
    readiness_checklist: false,
    submitted_at: '2026-01-01T00:00:00.000Z',
    decision_at: null,
    adopted_at: null
}

const fakeApplicationNotReadyUpdated: Application = {
    application_id: 2,
    dog_id: 4,
    adopter_id: 3,
    status: 'under_review',
    readiness_checklist: false,
    submitted_at: '2026-01-01T00:00:00.000Z',
    decision_at: null,
    adopted_at: null
}

beforeEach(() => {
  jest.restoreAllMocks()
})

//gets all applications from one adopter
describe('GET /api/adopter/applications', () => {
    it('gets the adopters applications and returns 200', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'getAllAdopterApps').mockResolvedValue([fakeApplicationReady, fakeApplicationNotReady])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
      .get('/api/adopter/applications')
      .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(200)
    })

    it('should return 401 if missing token', async () => {
        jest.spyOn(ApplicationModel, 'getAllAdopterApps').mockResolvedValue([fakeApplicationReady, fakeApplicationNotReady])

        const res = await request(app)
      .get('/api/adopter/applications')

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Authentication required')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'getAllAdopterApps').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
      .get('/api/adopter/applications')
      .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error fetching adopter applications')
    })
})

//gets all applications for dogs in a single shelter
describe('GET /api/admin/applications/shelter', () => {
    it('gets the applications for shelter and returns 200', async () => {
        jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(ApplicationModel, 'getAppsByShelter').mockResolvedValue([fakeApplicationReady, fakeApplicationNotReady])

        const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

        const res = await request(app)
      .get('/api/admin/applications/shelter')
      .set('Authorization', `Bearer ${adminToken}`)

      expect(res.status).toBe(200)
    })

    it('should return 403 if userType is not shelter_admin', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'getAppsByShelter').mockResolvedValue([fakeApplicationReady, fakeApplicationNotReady])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
            .get('/api/admin/applications/shelter')
            .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(403)
        expect(res.body.message).toBe('Admin access only')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(ApplicationModel, 'getAppsByShelter').mockRejectedValue(new Error('Database error'))

        const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

        const res = await request(app)
      .get('/api/admin/applications/shelter')
      .set('Authorization', `Bearer ${adminToken}`)

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error fetching applications')
    })
})

//gets a single application based on its id
describe('GET /api/adopter/applications/:id', () => {
    it('gets the adopter application and returns 200', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/applications/1')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(200)
        expect(res.body.application.adopter_id).toBe(1)
    })

    it('should return 400 if id is invalid', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/applications/abc')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid application ID')
    })

    it('should return 401 if missing token', async () => {
        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)

        const res = await request(app)
        .get('/api/adopter/applications/1')

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 404 if application not found', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(null)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/applications/1')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Application not found')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

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
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'createApplication').mockResolvedValue(fakeApplicationReady)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/applications')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ dog_id: 1 })

        expect(res.status).toBe(201)
        expect(res.body.application.adopter_id).toBe(1)
    })

    it('should return 400 if request body is invalid', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

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

        const res = await request(app)
        .post('/api/adopter/applications')
        .send({ dog_id: 1 })

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

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

describe('PATCH /api/adopter/applications/:id/status', () => {
    it('updates the adopter application status and returns 200', async () => {
        jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationReadyUpdated)

        const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'under_review' })

        expect(res.status).toBe(200)
        expect(res.body.application.status).toBe('under_review')
    })

    it('should return 400 if request body is invalid', async () => {
        jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationReadyUpdated)

        const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 4 })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid request')
    })

    it('should return 400 if id is invalid', async () => {
        jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationReadyUpdated)

        const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

        const res = await request(app)
        .patch('/api/adopter/applications/abc/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'under_review' })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid application ID')
    })

    it('should return 400 if transition is invalid', async () => {
        jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationReadyUpdated)

        const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'adopted' })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid transition')
    })


    it('should return 403 if userType is not shelter_admin', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationReadyUpdated)

        const adoperToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/status')
        .set('Authorization', `Bearer ${adoperToken}`)
        .send({ status: 'under_review' })

        expect(res.status).toBe(403)
        expect(res.body.message).toBe('Admin access only')
    })

    it('should return 403 if readiness checklist is incomplete', async () => {
        jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationNotReady)
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationNotReadyUpdated)

        const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

        const res = await request(app)
        .patch('/api/adopter/applications/2/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'under_review' })

        expect(res.status).toBe(403)
        expect(res.body.message).toBe('Readiness checklist not complete')
    })

    it('should return 404 if application not found', async () => {
        jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(null)
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(fakeApplicationReadyUpdated)

        const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

        const res = await request(app)
        .patch('/api/adopter/applications/2/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'under_review' })

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Application not found')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)
        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockRejectedValue(new Error('Database error'))

        const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

        const res = await request(app)
        .patch('/api/adopter/applications/1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'under_review' })

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error updating application status')
    })
})

describe('PATCH /api/adopter/applications/:id/checklist', () => {
    it('updates the adopter application readiness checklist and returns 200', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)
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
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)
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
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)
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
        jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)
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
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

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
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(ApplicationModel, 'getOneAdopterApp').mockResolvedValue(fakeApplicationReady)
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