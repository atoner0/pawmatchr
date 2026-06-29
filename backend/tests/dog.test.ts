import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../src/app.js'

import * as DogModel from '../src/models/dog.js'
import * as AdopterModel from '../src/models/adopter.js'
import * as AdminModel from '../src/models/shelterAdmin.js'
import { createTestToken } from './utils/createTestToken.js'
import type { Dog } from '../src/types/dog.js'

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

const fakeDogWrongShelter : Dog = {
  dog_id: 1,
  shelter_id: 10,
  name: "Buddy",
  breed: "Labrador Retriever",
  age: "3_5",
  gender: "male",
  size: "large",
  colour: ["black"],
  neutered: true,
  house_trained: true,
  vaccinated: true,
  good_with_dogs: "yes",
  good_with_cats: "unknown",
  good_with_children: "yes",
  children_age: "any",
  alone_tolerance: "2_4",
  activity_level: "moderate",
  training_level: "basic",
  coat_length: "short",
  coat_type: "smooth",
  shedding_level: "medium",
  medical_issues: [],
  medical_notes: null,
  behavioural_flags: [],
  behavioural_notes: null,
  known_triggers: [],
  trigger_notes: null,
  status: "available",
  description: "Friendly and energetic dog looking for a loving home.",
  intake_date: new Date().toISOString()
}

const fakeDogSameShelter : Dog = {
  dog_id: 4,
  shelter_id: 5,
  name: "Chewie",
  breed: "Cavapoo",
  age: "8_plus",
  gender: "male",
  size: "small",
  colour: ["brown"],
  neutered: true,
  house_trained: true,
  vaccinated: true,
  good_with_dogs: "yes",
  good_with_cats: "no",
  good_with_children: "yes",
  children_age: "any",
  alone_tolerance: "6_8",
  activity_level: "moderate",
  training_level: "basic",
  coat_length: "short",
  coat_type: "smooth",
  shedding_level: "medium",
  medical_issues: [],
  medical_notes: null,
  behavioural_flags: [],
  behavioural_notes: null,
  known_triggers: [],
  trigger_notes: null,
  status: "available",
  description: "Friendly and relaxed dog looking for a loving home.",
  intake_date: new Date().toISOString()
}

const fakeDogUpdated : Dog = {
  dog_id: 4,
  shelter_id: 5,
  name: "Updated Name",
  breed: "Cavapoo",
  age: "8_plus",
  gender: "male",
  size: "small",
  colour: ["brown"],
  neutered: true,
  house_trained: true,
  vaccinated: true,
  good_with_dogs: "yes",
  good_with_cats: "no",
  good_with_children: "yes",
  children_age: "any",
  alone_tolerance: "6_8",
  activity_level: "moderate",
  training_level: "basic",
  coat_length: "short",
  coat_type: "smooth",
  shedding_level: "medium",
  medical_issues: [],
  medical_notes: null,
  behavioural_flags: [],
  behavioural_notes: null,
  known_triggers: [],
  trigger_notes: null,
  status: "available",
  description: "Friendly and relaxed dog looking for a loving home.",
  intake_date: new Date().toISOString()
}

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('GET /api/dogs/:id', () => {
  it('gets the dog and returns 200', async () => {
    jest.spyOn(DogModel, 'getDogById').mockResolvedValue(fakeDogSameShelter)

      const res = await request(app)
      .get('/api/dogs/4')

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Chewie')
  })

    it('should return 404 if dog doesnt exist', async () => {
    jest.spyOn(DogModel, 'getDogById').mockResolvedValue(null)

      const res = await request(app)
      .get('/api/dogs/4')

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Dog not found')
  })

  it('should return 500 if a database error occurs', async() => {
    jest.spyOn(DogModel, 'getDogById').mockRejectedValue(new Error('Database error'))

    const res = await request(app)
      .get('/api/dogs/4')

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error during dog search')
  })
})

describe('GET /api/dogs/available', () => {
  it('gets all dogs and returns 200', async () => {
    jest.spyOn(DogModel, 'getAllAvailableDogs').mockResolvedValue([fakeDogSameShelter, fakeDogUpdated, fakeDogWrongShelter])

      const res = await request(app)
      .get('/api/dogs/available')

    expect(res.status).toBe(200)
  })

    it('should return 404 if dog doesnt exist', async () => {
    jest.spyOn(DogModel, 'getAllAvailableDogs').mockResolvedValue([])

      const res = await request(app)
      .get('/api/dogs/available')

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Dogs not found')
  })

  it('should return 500 if a database error occurs', async() => {
    jest.spyOn(DogModel, 'getAllAvailableDogs').mockRejectedValue(new Error('Database error'))

    const res = await request(app)
      .get('/api/dogs/available')

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error fetching available dogs')
  })
})




