import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

import * as FavouriteModel from '../../src/models/favourite.js'
import * as AdopterModel from '../../src/models/adopter.js'
import * as DogModel from '../../src/models/dog.js'
import * as AdminModel from '../../src/models/shelterAdmin.js'
import { createTestToken } from '../utils/createTestToken.js'

import { fakeAdopterPartial, fakeAdmin, fakeFavourites, fakeFavourite, fakeDogSameShelter } from '../utils/fakeProfiles.js'

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('GET /api/adopter/favourites', () => {
    it('gets the adopters favourites and returns 200', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(FavouriteModel, 'getFavouritesByAdopter').mockResolvedValue(fakeFavourites)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/favourites')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(200)
    })

    it('adopter has no favourites(empty array) and returns 200', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(FavouriteModel, 'getFavouritesByAdopter').mockResolvedValue([])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/favourites')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(200)
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(FavouriteModel, 'getFavouritesByAdopter').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/favourites')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error fetching adopter favourites')
    })
})

describe('POST /api/adopter/favourites', () => {
    it('creates favourite and returns 201', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(DogModel, 'getDogById').mockResolvedValue(fakeDogSameShelter)

        jest.spyOn(FavouriteModel, 'addFavourite').mockResolvedValue(fakeFavourite)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/favourites')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ dog_id: 4 })

      expect(res.status).toBe(201)
      expect(res.body.favourite.adopter_id).toBe(1)
    })

    it('should return 400 if zod schema is invalid', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(DogModel, 'getDogById').mockResolvedValue(fakeDogSameShelter)

        jest.spyOn(FavouriteModel, 'addFavourite').mockResolvedValue(fakeFavourite)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/favourites')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ dog_id: 'four' })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid request')
    })

    it('should return 401 if missing token', async () => {
        jest.spyOn(DogModel, 'getDogById').mockResolvedValue(fakeDogSameShelter)

        jest.spyOn(FavouriteModel, 'addFavourite').mockResolvedValue(fakeFavourite)

        const res = await request(app)
        .post('/api/adopter/favourites')
        .send({ dog_id: 'four' })

      expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 403 if userType isnt adopter', async () => {
        jest.spyOn(AdminModel, 'findAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogById').mockResolvedValue(fakeDogSameShelter)

        jest.spyOn(FavouriteModel, 'addFavourite').mockResolvedValue(fakeFavourite)

        const adminToken = createTestToken({ id: 1, type: 'shelter_admin' })

        const res = await request(app)
        .post('/api/adopter/favourites')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ dog_id: 'four' })

      expect(res.status).toBe(403)
        expect(res.body.message).toBe('Adopter access only')
    })

    it('should return 404 if dog not found', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(DogModel, 'getDogById').mockResolvedValue(null)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/favourites')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ dog_id: 4 })

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Dog not found')
    })

    it('should return 409 if dog is already favourited', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(DogModel, 'getDogById').mockResolvedValue(fakeDogSameShelter)

        const duplicateError: any = new Error('duplicate key value violates unique constraint')
        duplicateError.code = '23505'

        jest.spyOn(FavouriteModel, 'addFavourite').mockRejectedValue(duplicateError)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/favourites')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ dog_id: 4 })

      expect(res.status).toBe(409)
        expect(res.body.message).toBe('Dog already favourited')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)
        jest.spyOn(DogModel, 'getDogById').mockResolvedValue(fakeDogSameShelter)

        jest.spyOn(FavouriteModel, 'addFavourite').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .post('/api/adopter/favourites')
        .set('Authorization', `Bearer ${adopterToken}`)
        .send({ dog_id: 4 })

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('Error favouriting dog')
    })
})

describe('DELETE /api/adopter/favourites/:dogId', () => {
    it('deletes favourite and return 204', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(FavouriteModel, 'deleteFavourite').mockResolvedValue(1)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .delete('/api/adopter/favourites/4')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(204)
    })

    it('should return 400 if dogId is invalid', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(FavouriteModel, 'deleteFavourite').mockResolvedValue(1)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .delete('/api/adopter/favourites/abc')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid dog ID')
    })

    it('should return 404 if favourite not found', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(FavouriteModel, 'deleteFavourite').mockResolvedValue(0)

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .delete('/api/adopter/favourites/4')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Favourite not found')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'findAdopterById').mockResolvedValue(fakeAdopterPartial)

        jest.spyOn(FavouriteModel, 'deleteFavourite').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .delete('/api/adopter/favourites/4')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error deleting favourite')
    })
})