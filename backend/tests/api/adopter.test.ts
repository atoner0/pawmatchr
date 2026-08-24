import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

import * as AdopterModel from '../../src/models/adopter.js'
import { createTestToken } from '../utils/createTestToken.js'

import { fakeAdopterFull, fakeQuestionnaireInput } from '../utils/fakeProfiles.js'

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('GET /api/adopter/questionnaire', () => {
    it('gets the adopter questionnaire and returns 200', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/questionnaire')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(200)
        expect(res.body.adopter.first_name).toBe('Jane')
    })

    it('should return 401 if no token is found', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        const res = await request(app)
        .get('/api/adopter/questionnaire')

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 404 if no adopter is found', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById')
            .mockResolvedValueOnce(fakeAdopterFull)
            .mockResolvedValueOnce(null)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/questionnaire')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Profile not found')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById')
            .mockResolvedValueOnce(fakeAdopterFull)
            .mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/questionnaire')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error getting profile')
    })
})

describe('PUT /api/adopter/questionnaire', () => {
    it('updates adopter with full questionnaire fields and returns 200 with updated adopter', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        jest.spyOn(AdopterModel, 'fillQuestionnaire').mockResolvedValue(fakeAdopterFull)

        const res = await request(app)
        .put('/api/adopter/questionnaire')
        .send(fakeQuestionnaireInput)
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(200)
        expect(res.body.adopter.first_name).toBe('Jane')
    })

    it('should return 401 if no token is found', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        jest.spyOn(AdopterModel, 'fillQuestionnaire').mockResolvedValue(fakeAdopterFull)

        const res = await request(app)
        .put('/api/adopter/questionnaire')
        .send(fakeQuestionnaireInput)

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 400 if validation check fails', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        jest.spyOn(AdopterModel, 'fillQuestionnaire').mockResolvedValue(fakeAdopterFull)

        const res = await request(app)
        .put('/api/adopter/questionnaire')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid request')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        jest.spyOn(AdopterModel, 'fillQuestionnaire').mockRejectedValue(new Error('Database error'))

        const res = await request(app)
        .put('/api/adopter/questionnaire')
        .send(fakeQuestionnaireInput)
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error filling questionnaire')
    })
})

describe('PATCH /api/adopter/questionnaire', () => {
    it('updates adopter with full questionnaire fields and returns 200 with updated adopter', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        jest.spyOn(AdopterModel, 'updateQuestionnaire').mockResolvedValue(fakeAdopterFull)

        const res = await request(app)
        .patch('/api/adopter/questionnaire')
        .send( {activity_level: 'high'})
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(200)
        expect(res.body.adopter.first_name).toBe('Jane')
    })

    it('should return 401 if no token is found', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        jest.spyOn(AdopterModel, 'updateQuestionnaire').mockResolvedValue(fakeAdopterFull)

        const res = await request(app)
        .patch('/api/adopter/questionnaire')
        .send( {activity_level: 'high'})

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 400 if there are no fields to update', async () => {
    jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

    jest.spyOn(AdopterModel, 'updateQuestionnaire').mockResolvedValue(fakeAdopterFull)

    const adopterToken = createTestToken({ id: 1, type: 'adopter' })

    const res = await request(app)
      .patch('/api/adopter/questionnaire')
      .set('Authorization', `Bearer ${adopterToken}`)
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('No fields provided for update')
  })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        jest.spyOn(AdopterModel, 'updateQuestionnaire').mockRejectedValue(new Error('Database error'))

        const res = await request(app)
        .patch('/api/adopter/questionnaire')
        .send( {activity_level: 'high'})
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error updating questionnaire')
    })
})