import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../src/app.js'

import * as AdopterModel from '../src/models/adopter.js'
import { createTestToken } from './utils/createTestToken.js'
import type { Adopter } from '../src/types/adopter.js'
import type { QuestionnaireInput } from '../src/types/questionnaireSchema.js'

const fakeAdopter: Adopter = {
    adopter_id: 1,
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@example.com',
    password_hash: 'hashedpassword',
    phone: '07700900000',
    postcode: 'BT1 1AA',
    home_type: 'detached',
    home_location: 'suburban',
    outdoor_space: 'large',
    current_pets: false,
    current_pet_type: [],
    current_pet_count: null,
    children: false,
    youngest_child_age: null,
    hours_alone: '2_4',
    activity_level: 'moderate',
    first_time_owner: true,
    multi_pet_exp: false,
    multi_pet_exp_level: null,
    age_pref: '3_5',
    gender_pref: 'none',
    size_pref: 'medium',
    shedding_pref: 'low',
    training_commitment: 'basic',
    pref_notes: null,
    completed_at: null
}

const fakeQuestionnaireInput: QuestionnaireInput = {
    home_type: 'detached',
    home_location: 'rural',
    outdoor_space: 'large',
    current_pets: false,
    current_pet_type: [],
    current_pet_count: null,
    children: false,
    youngest_child_age: null,
    hours_alone: '2_4',
    activity_level: 'moderate',
    first_time_owner: true,
    multi_pet_exp: false,
    multi_pet_exp_level: null,
    age_pref: '3_5',
    gender_pref: 'none',
    size_pref: 'large',
    shedding_pref: 'low',
    training_commitment: 'basic',
    pref_notes: undefined
}

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('GET /api/adopter/questionnaire', () => {
    it('gets the adopter questionnaire and returns 200', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/questionnaire')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(200)
        expect(res.body.profile.first_name).toBe('Jane')
    })

    it('should return 401 if no token is found', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        const res = await request(app)
        .get('/api/adopter/questionnaire')

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 404 if no adopter is found', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById')
            .mockResolvedValueOnce(fakeAdopter)
            .mockResolvedValueOnce(null)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/questionnaire')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Profile not found')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById')
            .mockResolvedValueOnce(fakeAdopter)
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
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        jest.spyOn(AdopterModel, 'fillQuestionnaire').mockResolvedValue(fakeAdopter)

        const res = await request(app)
        .put('/api/adopter/questionnaire')
        .send(fakeQuestionnaireInput)
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(200)
        expect(res.body.fullAdopter.first_name).toBe('Jane')
    })

    it('should return 401 if no token is found', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(AdopterModel, 'fillQuestionnaire').mockResolvedValue(fakeAdopter)

        const res = await request(app)
        .put('/api/adopter/questionnaire')
        .send(fakeQuestionnaireInput)

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 400 if validation check fails', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        jest.spyOn(AdopterModel, 'fillQuestionnaire').mockResolvedValue(fakeAdopter)

        const res = await request(app)
        .put('/api/adopter/questionnaire')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid request')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

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
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        jest.spyOn(AdopterModel, 'updateQuestionnaire').mockResolvedValue(fakeAdopter)

        const res = await request(app)
        .patch('/api/adopter/questionnaire')
        .send( {activity_level: 'high'})
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(200)
        expect(res.body.updatedAdopter.first_name).toBe('Jane')
    })

    it('should return 401 if no token is found', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

        jest.spyOn(AdopterModel, 'updateQuestionnaire').mockResolvedValue(fakeAdopter)

        const res = await request(app)
        .patch('/api/adopter/questionnaire')
        .send( {activity_level: 'high'})

        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 400 if there are no fields to update', async () => {
    jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

    jest.spyOn(AdopterModel, 'updateQuestionnaire').mockResolvedValue(fakeAdopter)

    const adopterToken = createTestToken({ id: 1, type: 'adopter' })

    const res = await request(app)
      .patch('/api/adopter/questionnaire')
      .set('Authorization', `Bearer ${adopterToken}`)
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('No fields provided for update')
  })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

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