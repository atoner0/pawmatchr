import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

import * as DogModel from '../../src/models/dog.js'

import { fakeDogforCreate, fakeDogforCreateInvalid, fakeDogSameShelter, fakeAdmin, fakeDogWrongShelter, fakeDogUpdated, fakeDogforUpdate, fakeDogforUpdateInvalid } from '../utils/fakeProfiles.js'
import * as AdminModel from '../../src/models/shelterAdmin.js'

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('POST /admin/dogs/', () => {
    it('creates the dog and returns 302', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'createDog').mockResolvedValue(fakeDogSameShelter)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post('/admin/dogs')
            .send(fakeDogforCreate)

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/admin/dogs/')

        expect(DogModel.createDog).toHaveBeenCalledTimes(1)

        const callArgs = (DogModel.createDog as jest.Mock).mock.calls[0]!
        expect(callArgs[0]).toBe(fakeAdmin.shelter_id)
        expect(callArgs[1]).toBe(fakeDogforCreate.name)
    })

    it('should return 400 if invalid zod schema', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'createDog').mockResolvedValue(fakeDogSameShelter)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post('/admin/dogs')
            .send(fakeDogforCreateInvalid)

        expect(res.status).toBe(400)
        expect(DogModel.createDog).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'createDog').mockRejectedValue(new Error('Database error'))

        /* preventing the console.error from catch blocks cluttering terminal */ 
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post('/admin/dogs')
            .send(fakeDogforCreate)

        expect(res.status).toBe(500)
        expect(DogModel.createDog).toHaveBeenCalledTimes(1)

        consoleErrorSpy.mockRestore()
    })
})

describe('POST /admin/dogs/ - field normalisation', () => {
    let agent: ReturnType<typeof request.agent>

    beforeEach(async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'createDog').mockResolvedValue(fakeDogSameShelter)

        agent = request.agent(app)
        await agent.post('/admin/login').send({ email: fakeAdmin.email, password: 'TestPassword123!' })
    })

    it('normalises neutered "false" string to boolean false', async () => {
        await agent.post('/admin/dogs').send({ ...fakeDogforCreate, neutered: 'false' })

        const callArgs = (DogModel.createDog as jest.Mock).mock.calls[0]!
        expect(callArgs[7]).toBe(false) // confirm index matches neutered 
    })

    it('normalises a single colour string into an array', async () => {
        await agent.post('/admin/dogs').send({ ...fakeDogforCreate, colour: 'brown' })

        const callArgs = (DogModel.createDog as jest.Mock).mock.calls[0]!
        expect(callArgs[6]).toEqual(['brown']) // confirm index matches colour 
    })

    it('keeps an already-array colour field as an array', async () => {
        await agent.post('/admin/dogs').send({ ...fakeDogforCreate, colour: ['brown', 'white'] })

        const callArgs = (DogModel.createDog as jest.Mock).mock.calls[0]!
        expect(callArgs[6]).toEqual(['brown', 'white'])
    })

    it('defaults missing optional array fields to an empty array', async () => {
        const { medical_issues, behavioural_flags, known_triggers, ...rest } = fakeDogforCreate
        await agent.post('/admin/dogs').send(rest)

        const callArgs = (DogModel.createDog as jest.Mock).mock.calls[0]!
        expect(callArgs[20]).toEqual([]) // medical_issues index
        expect(callArgs[22]).toEqual([]) // behavioural_flags index
        expect(callArgs[24]).toEqual([]) // known_triggers index
    })

    it('defaults missing children_age to null', async () => {
        const { children_age, ...rest } = fakeDogforCreate
        await agent.post('/admin/dogs').send(rest)

        const callArgs = (DogModel.createDog as jest.Mock).mock.calls[0]!
        expect(callArgs[13]).toBeNull() // children_age index
    })
})

describe('GET /admin/dogs', () => {
    it('gets dogs belonging to shelter and return 200', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogsByShelterId').mockResolvedValue([fakeDogSameShelter])

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get('/admin/dogs')

        expect(res.status).toBe(200)
        expect(DogModel.getDogsByShelterId).toHaveBeenCalledTimes(1)
        expect(DogModel.getDogsByShelterId).toHaveBeenCalledWith(fakeAdmin.shelter_id)
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogsByShelterId').mockRejectedValue(new Error('Database error'))

        /* preventing the console.error from catch blocks cluttering terminal */ 
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get('/admin/dogs')

        expect(res.status).toBe(500)
        expect(DogModel.getDogsByShelterId).toHaveBeenCalledTimes(1)

        consoleErrorSpy.mockRestore()
    })
})

describe('GET /admin/dogs/:id', () => {
    it('get dog belonging to shelter and returns 200', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(fakeDogSameShelter)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/dogs/${fakeDogSameShelter.dog_id}`)

        expect(res.status).toBe(200)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledTimes(1)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledWith(fakeDogSameShelter.dog_id, fakeAdmin.shelter_id)
    })

    it('should return 404 if dog is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(null)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/dogs/${fakeDogSameShelter.dog_id}`)

        expect(res.status).toBe(404)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledTimes(1)
    })

    it('should return 404 if dog belongs to a different shelter', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(null)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/dogs/${fakeDogWrongShelter.dog_id}`)

        expect(res.status).toBe(404)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledTimes(1)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledWith(fakeDogWrongShelter.dog_id, fakeAdmin.shelter_id)
    })

    it('should return 400 if dog id is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(fakeDogSameShelter)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/dogs/abcd`)

        expect(res.status).toBe(400)
        expect(DogModel.getDogByIdAndShelterId).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockRejectedValue(new Error('Database error'))

        /* preventing the console.error from catch blocks cluttering terminal */ 
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/dogs/${fakeDogSameShelter.dog_id}`)

        expect(res.status).toBe(500)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledTimes(1)

        consoleErrorSpy.mockRestore()
    })
})

describe('POST /admin/dogs/:id/edit', () => {
    it('updates the dog and redirects to dog profile', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(fakeDogSameShelter)
        
        jest.spyOn(DogModel, 'updateDog').mockResolvedValue(fakeDogUpdated)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent 
            .post(`/admin/dogs/${fakeDogSameShelter.dog_id}/edit`)
            .send(fakeDogforUpdate)

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe( `/admin/dogs/${fakeDogSameShelter.dog_id}`)

        expect(DogModel.updateDog).toHaveBeenCalledTimes(1)
        const callArgs = (DogModel.updateDog as jest.Mock).mock.calls[0]!
        expect(callArgs[0]).toBe(fakeDogSameShelter.dog_id)
        expect(callArgs[2]).toBe(fakeAdmin.shelter_id)
    })

    it('should return 404 if dog is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(null)
        
        jest.spyOn(DogModel, 'updateDog').mockResolvedValue(fakeDogUpdated)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent 
            .post(`/admin/dogs/${fakeDogSameShelter.dog_id}/edit`)
            .send(fakeDogforUpdate)

        expect(res.status).toBe(404)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledTimes(1)
    })

    it('should return 404 if belongs to a different shelter', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(null)
        
        jest.spyOn(DogModel, 'updateDog').mockResolvedValue(fakeDogUpdated)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/dogs/${fakeDogWrongShelter.dog_id}/edit`)

        expect(res.status).toBe(404)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledTimes(1)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledWith(fakeDogWrongShelter.dog_id, fakeAdmin.shelter_id)
 
    })

    it('should return 400 if invalid zod schema', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(fakeDogSameShelter)
        jest.spyOn(DogModel, 'updateDog')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!' })

        const res = await agent
            .post(`/admin/dogs/${fakeDogSameShelter.dog_id}/edit`)
            .send(fakeDogforUpdateInvalid)

        expect(res.status).toBe(400)
        expect(DogModel.updateDog).not.toHaveBeenCalled()
    })  

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(fakeDogSameShelter)
        
        jest.spyOn(DogModel, 'updateDog').mockRejectedValue(new Error('Database error'))

        /* preventing the console.error from catch blocks cluttering terminal */ 
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent 
            .post(`/admin/dogs/${fakeDogSameShelter.dog_id}/edit`)
            .send(fakeDogforUpdate)

        expect(res.status).toBe(500)
        expect(DogModel.updateDog).toHaveBeenCalledTimes(1)

        consoleErrorSpy.mockRestore()

    })
})

describe('POST /admin/dogs/:id/delete', () => {
    it('deletes the dog and returns 302', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(fakeDogSameShelter)
        jest.spyOn(DogModel, 'hasApplications').mockResolvedValue(false)

        jest.spyOn(DogModel, 'deleteDog').mockResolvedValue()

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/dogs/${fakeDogSameShelter.dog_id}/delete`)

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/admin/dogs')

        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledWith(fakeDogSameShelter.dog_id, fakeAdmin.shelter_id)
        expect(DogModel.hasApplications).toHaveBeenCalledWith(fakeDogSameShelter.dog_id)
        expect(DogModel.deleteDog).toHaveBeenCalledWith(fakeDogSameShelter.dog_id, fakeAdmin.shelter_id)
    })

    it('should return 404 if dog is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(null)
        jest.spyOn(DogModel, 'hasApplications').mockResolvedValue(false)

        jest.spyOn(DogModel, 'deleteDog').mockResolvedValue()

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/dogs/${fakeDogSameShelter.dog_id}/delete`)

        expect(res.status).toBe(404)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledTimes(1)
    })

    it('should return 404 if belongs to a different shelter', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(null)
        jest.spyOn(DogModel, 'hasApplications').mockResolvedValue(false)

        jest.spyOn(DogModel, 'deleteDog').mockResolvedValue()

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/dogs/${fakeDogWrongShelter.dog_id}/delete`)

        expect(res.status).toBe(404)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledTimes(1)
        expect(DogModel.getDogByIdAndShelterId).toHaveBeenCalledWith(fakeDogWrongShelter.dog_id, fakeAdmin.shelter_id)
    })

    it('should return 400 if dog has existing applications', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(fakeDogSameShelter)
        jest.spyOn(DogModel, 'hasApplications').mockResolvedValue(true)

        jest.spyOn(DogModel, 'deleteDog').mockResolvedValue()

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/dogs/${fakeDogSameShelter.dog_id}/delete`)

        expect(res.status).toBe(400)
        expect(DogModel.deleteDog).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)

        jest.spyOn(DogModel, 'getDogByIdAndShelterId').mockResolvedValue(fakeDogSameShelter)
        jest.spyOn(DogModel, 'hasApplications').mockResolvedValue(false)

        jest.spyOn(DogModel, 'deleteDog').mockRejectedValue(new Error('Database error'))

        /* preventing the console.error from catch blocks cluttering terminal */ 
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/dogs/${fakeDogSameShelter.dog_id}/delete`)

        expect(res.status).toBe(500)
        expect(DogModel.deleteDog).toHaveBeenCalledTimes(1)

        consoleErrorSpy.mockRestore()
        
    })
})

describe('requireAdminWeb middleware', () => {
    it('allows the request through with a valid session', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin) 
        jest.spyOn(DogModel, 'getDogsByShelterId').mockResolvedValue([])

        const agent = request.agent(app)
        await agent.post('/admin/login').send({ email: fakeAdmin.email, password: 'TestPassword123!' })

        const res = await agent.get('/admin/dogs')

        expect(res.status).toBe(200)
    })

    it('redirects to /admin/login if no session exists', async () => {
        const res = await request(app).get('/admin/dogs')

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/admin/login')
    })

    it('redirects to /admin/login if session exists but no admin is found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(null) //case when admin gets deleted

        const agent = request.agent(app)
        await agent.post('/admin/login').send({ email: fakeAdmin.email, password: 'TestPassword123!' })

        const res = await agent.get('/admin/dogs')

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/admin/login')
    })
})