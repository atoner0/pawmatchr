import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

import * as DogModel from '../../src/models/dog.js'

import { fakeDogSameShelter, fakeDogWrongShelter, fakeDogUpdated } from '../utils/fakeProfiles.js'



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




