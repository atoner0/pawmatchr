import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'
import * as AdopterModel from '../../src/models/adopter.js'
import bcrypt from 'bcrypt'
import { fakeAdopterPartial, fakeAdopterSafe } from '../utils/fakeProfiles.js'

beforeEach(() => {
    jest.restoreAllMocks()
})

describe('POST /api/adopter/signup', () => {
    it('should return 201 and a token when details are valid', async () => {
        jest.spyOn(AdopterModel, 'getAdopterByEmail').mockResolvedValue(null)

        jest.spyOn(AdopterModel, 'createAdopter').mockResolvedValue(fakeAdopterSafe)

        const res = await request(app)
            .post('/api/adopter/signup')
            .send({ first_name: 'Jane', last_name: 'Doe', email: 'jane@test.com', password: 'password123', phone: '07700000000',postcode: 'BT35 9SP' })

        expect(res.status).toBe(201)
        expect(res.body.token).toBeDefined()
        expect(res.body.adopter.password_hash).toBeUndefined()
    })

    it('should return 400 if email is already registed', async () => { 
        jest.spyOn(AdopterModel, 'getAdopterByEmail').mockResolvedValue(fakeAdopterPartial)

        const res = await request(app)
            .post('/api/adopter/signup')
            .send({ first_name: 'Jane', last_name: 'Doe', email: 'jane@test.com', password: 'password123', phone: '07700000000', postcode: 'BT35 9SP' })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Email is already registered')
    })

    it('should return 400 if required fields are missing', async() => {
        const res = await request(app)
            .post('/api/adopter/signup')
            .send({ first_name: 'Jane', last_name: 'Doe', password: 'password123', phone: '07700000000', postcode: 'BT35 9SP' })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid request')

    })

    it('should return 500 if a database error occurs', async() => {
        jest.spyOn(AdopterModel, 'getAdopterByEmail').mockRejectedValue(new Error('Database error'))

        /* preventing the console.error from catch blocks cluttering terminal */ 
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        const res = await request(app)
            .post('/api/adopter/signup')
            .send({ first_name: 'Jane', last_name: 'Doe', email: 'jane@test.com', password: 'password123', phone: '07700000000', postcode: 'BT35 9SP' })

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error during signup')

        consoleErrorSpy.mockRestore()
    })
})

describe('POST /api/adopter/login', () => {
    it('should return 200 and a token when details are valid', async () => {
        const password_hash = await bcrypt.hash('password123', 10)
        const fakeSignIn = {...fakeAdopterPartial, password_hash}

        jest.spyOn(AdopterModel, 'getAdopterByEmail').mockResolvedValue(fakeSignIn)

        const res = await request(app)
            .post('/api/adopter/login')
            .send({ email: 'jane@test.com', password: 'password123' })

        expect(res.status).toBe(200)
        expect(res.body.token).toBeDefined()
        expect(res.body.adopter.password_hash).toBeUndefined()
    })

    it('should return 400 if email is not found', async () => { 
        jest.spyOn(AdopterModel, 'getAdopterByEmail').mockResolvedValue(null)

        const res = await request(app)
            .post('/api/adopter/login')
            .send({ email: 'test@test.com', password: 'password123' })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid details')
    })

    it('should return 400 if password is wrong', async() => {
        const password_hash = await bcrypt.hash('password123', 10)
        const fakeSignIn = {...fakeAdopterPartial, password_hash}

        jest.spyOn(AdopterModel, 'getAdopterByEmail').mockResolvedValue(fakeSignIn)

        const res = await request(app)
            .post('/api/adopter/login')
            .send({ email: 'jane@test.com', password: 'password' })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid details')

    })

    it('should return 500 if a database error occurs', async() => {
        jest.spyOn(AdopterModel, 'getAdopterByEmail').mockRejectedValue(new Error('Database error'))

        /* preventing the console.error from catch blocks cluttering terminal */ 
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        const res = await request(app)
            .post('/api/adopter/login')
            .send({ email: 'jane@test.com', password: 'password123' })

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error during login')

        consoleErrorSpy.mockRestore()
    })
})