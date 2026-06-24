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
  phone: "07700000000"
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
    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(fakeDogSameShelter)

      const res = await request(app)
      .get('/api/dogs/4')

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Chewie')
  })

    it('should return 404 if dog doesnt exist', async () => {
    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(null)

      const res = await request(app)
      .get('/api/dogs/4')

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Dog not found')
  })

  it('should return 500 if a database error occurs', async() => {
    jest.spyOn(DogModel, 'findDogById').mockRejectedValue(new Error('Database error'))

    const res = await request(app)
      .get('/api/dogs/4')

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error during dog search')
  })
})

describe('GET /api/dogs/available', () => {
  it('gets all dogs and returns 200', async () => {
    jest.spyOn(DogModel, 'getAllDogs').mockResolvedValue([fakeDogSameShelter, fakeDogUpdated, fakeDogWrongShelter])

      const res = await request(app)
      .get('/api/dogs/available')

    expect(res.status).toBe(200)
  })

    it('should return 404 if dog doesnt exist', async () => {
    jest.spyOn(DogModel, 'getAllDogs').mockResolvedValue([])

      const res = await request(app)
      .get('/api/dogs/available')

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Dogs not found')
  })

  it('should return 500 if a database error occurs', async() => {
    jest.spyOn(DogModel, 'getAllDogs').mockRejectedValue(new Error('Database error'))

    const res = await request(app)
      .get('/api/dogs/available')

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error fetching available dogs')
  })
})

describe('GET /api/dogs', () => {
  it('gets all dogs belonging to shelter and returns 200', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogByShelterId').mockResolvedValue([fakeDogSameShelter])

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

      const res = await request(app)
      .get('/api/dogs')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
  })

  it('should return 403 if userType is not shelter_admin', async () => {
    jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

    jest.spyOn(DogModel, 'findDogByShelterId').mockResolvedValue([fakeDogSameShelter])

    const adopterToken = createTestToken({ id: 1, type: 'adopter' })

    const res = await request(app)
      .get('/api/dogs')
      .set('Authorization', `Bearer ${adopterToken}`)

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Admin access only')
  })

  it('should return 404 if dog doesnt exist', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogByShelterId').mockResolvedValue([])

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .get('/api/dogs')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Dogs not found')
  })

  it('should return 500 if a database error occurs', async() => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogByShelterId').mockRejectedValue(new Error('Database error'))

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .get('/api/dogs')
      .set('Authorization', `Bearer ${adminToken}`)

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error during dog search')
  })
})

describe('POST /api/dogs', () => {
  it('creates dog and returns 201', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'createDog').mockResolvedValue(fakeDogSameShelter)

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .post('/api/dogs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: "Chewie", breed: "Cavapoo", age: "8_plus", gender: "male", size: "small", colour: ["brown"], neutered: true, house_trained: true, vaccinated: true, good_with_dogs: "yes", good_with_cats: "no", good_with_children: "yes", children_age: "any", alone_tolerance: "6_8", activity_level: "moderate", training_level: "basic", coat_length: "short", coat_type: "smooth", shedding_level: "medium", medical_issues: [], medical_notes: null, behavioural_flags: [], behavioural_notes: null, known_triggers: [], trigger_notes: null, description: "Friendly and relaxed dog looking for a loving home." })

      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Chewie')
  })
  
  it('should return 400 if request body is invalid', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'createDog').mockResolvedValue(fakeDogSameShelter)

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .post('/api/dogs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: "Chewie", breed: "Cavapoo", age: "4", gender: "male", size: "small", colour: ["brown"], neutered: true, house_trained: true, vaccinated: true, good_with_dogs: "yes", good_with_cats: "no", good_with_children: "yes", children_age: "any", alone_tolerance: "6_8", activity_level: "moderate", training_level: "basic", coat_length: "short", coat_type: "smooth", shedding_level: "medium", medical_issues: [], medical_notes: null, behavioural_flags: [], behavioural_notes: null, known_triggers: [], trigger_notes: null, description: "Friendly and relaxed dog looking for a loving home." })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Invalid request')
  })

  it('should return 403 if userType is not shelter_admin', async () => {
    jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

    const adopterToken = createTestToken({ id: 1, type: 'adopter' })

    const res = await request(app)
      .post('/api/dogs')
      .set('Authorization', `Bearer ${adopterToken}`)

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Admin access only')
  })

  it('should return 500 if a database error occurs', async() => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'createDog').mockRejectedValue(new Error('Database error'))

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .post('/api/dogs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: "Chewie", breed: "Cavapoo", age: "8_plus", gender: "male", size: "small", colour: ["brown"], neutered: true, house_trained: true, vaccinated: true, good_with_dogs: "yes", good_with_cats: "no", good_with_children: "yes", children_age: "any", alone_tolerance: "6_8", activity_level: "moderate", training_level: "basic", coat_length: "short", coat_type: "smooth", shedding_level: "medium", medical_issues: [], medical_notes: null, behavioural_flags: [], behavioural_notes: null, known_triggers: [], trigger_notes: null, description: "Friendly and relaxed dog looking for a loving home." })

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error creating dog')
  })
})

describe('PATCH /api/dogs/:id', () => {
  it('updates the dog and returns 200 with updated dog', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(fakeDogSameShelter)

    jest.spyOn(DogModel, 'updateDog').mockResolvedValue(fakeDogUpdated)

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .patch('/api/dogs/4')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name' })

    expect(res.status).toBe(200)
    expect(res.body.updatedDog.name).toBe('Updated Name')
  })

  it('should return 403 if userType is not shelter_admin', async () => {
    jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(fakeDogSameShelter)

    jest.spyOn(DogModel, 'updateDog').mockResolvedValue(fakeDogSameShelter)

    const adopterToken = createTestToken({ id: 1, type: 'adopter' })

    const res = await request(app)
      .patch('/api/dogs/4')
      .set('Authorization', `Bearer ${adopterToken}`)
      .send({ name: 'Updated Name' })

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Admin access only')
  })

  it('should return 404 if dog doesnt exist', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(null)

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .patch('/api/dogs/1000')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name' })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Dog not found')
  })

  it('should return 403 if dog belongs to a different shelter', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(fakeDogWrongShelter)

    jest.spyOn(DogModel, 'updateDog').mockResolvedValue(fakeDogWrongShelter)

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .patch('/api/dogs/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name' })

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('You cannot edit dogs from another shelter')
  })

  it('should return 400 if there are no fields to update', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(fakeDogSameShelter)

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .patch('/api/dogs/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('No fields provided for update')
  })

  it('should return 500 if a database error occurs', async() => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(fakeDogSameShelter)

    jest.spyOn(DogModel, 'updateDog').mockRejectedValue(new Error('Database error'))

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .patch('/api/dogs/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name' })

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error updating dog')
  })
})

describe('DELETE /api/dogs/:id', () => {
  it('deletes the dog and returns 200 when no applications exist', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(fakeDogSameShelter)

    jest.spyOn(DogModel, 'hasApplications').mockResolvedValue(false)

    jest.spyOn(DogModel, 'deleteDog').mockResolvedValue()

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .delete('/api/dogs/4')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Dog deleted successfully')
  })

  it('should return 403 if userType is not shelter_admin', async () => {
    jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopter)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(fakeDogSameShelter)

    const adopterToken = createTestToken({ id: 1, type: 'adopter' })

    const res = await request(app)
      .delete('/api/dogs/4')
      .set('Authorization', `Bearer ${adopterToken}`)

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Admin access only')
  })

  it('should return 404 if dog doesnt exist', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(null)

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .delete('/api/dogs/1000')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Dog not found')
  })

  it('should return 403 if dog belongs to a different shelter', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(fakeDogWrongShelter)

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .delete('/api/dogs/1')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('You cannot delete dogs from another shelter')
  })

  it('should return 400 if there are existing applications', async () => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(fakeDogSameShelter)

    jest.spyOn(DogModel, 'hasApplications').mockResolvedValue(true)

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .delete('/api/dogs/1')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Cannot delete dog with existing applications')
  })

  it('should return 500 if a database error occurs', async() => {
    jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)

    jest.spyOn(DogModel, 'findDogById').mockResolvedValue(fakeDogSameShelter)

    jest.spyOn(DogModel, 'hasApplications').mockResolvedValue(false)

    jest.spyOn(DogModel, 'deleteDog').mockRejectedValue(new Error('Database error'))

    const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

    const res = await request(app)
      .delete('/api/dogs/1')
      .set('Authorization', `Bearer ${adminToken}`)

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error deleting dog')
  })
})
