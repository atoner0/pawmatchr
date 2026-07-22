import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

import * as MatchModel from '../../src/models/match.js'
import * as AdopterModel from '../../src/models/adopter.js'
import * as DogModel from '../../src/models/dog.js'
import { createTestToken } from '../utils/createTestToken.js'
import { fakeAdopterFull, fakeAdopterPartial, fakeDogSameShelter, fakeDogUpdated, fakeDogWrongShelter, fakeMatch, fakeMatchResultFromPython, withDog } from '../utils/fakeProfiles.js'
import * as MatchingService from '../../src/services/matchingService.js'


beforeEach(() => {
  jest.restoreAllMocks()
})

describe('callMatchingService', () => {
    it('returns results on a valid 200 response', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ results: [fakeMatchResultFromPython] }), { status: 200 })
        )

        const result = await MatchingService.callMatchingService(fakeAdopterFull, [fakeDogSameShelter])

        expect(fetchSpy).toHaveBeenCalledTimes(1)

        const [url, options] = fetchSpy.mock.calls[0]!

        expect(url).toBe(`${process.env.MATCHING_SERVICE_URL}/match`)
        expect(options?.method).toBe('POST')
        expect(JSON.parse(options?.body as string)).toEqual({
            adopter: fakeAdopterFull,
            dogs: [fakeDogSameShelter]
        })

        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.results).toEqual([fakeMatchResultFromPython])
        }
    })

    it('returns unavailable when fetch throws', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))

        const result = await MatchingService.callMatchingService(fakeAdopterFull, [fakeDogSameShelter])

        expect(result).toEqual({ success: false, error: 'unavailable'})
    })

    it('returns unavailable when timeout abort triggers', async () => {
        jest.useFakeTimers()
        
        jest.spyOn(global, 'fetch').mockImplementation(
            (_url, options) => new Promise((_resolve, reject) => {
                const signal = (options as RequestInit)?.signal
                signal?.addEventListener('abort', () => {
                    reject(new DOMException('The operation was aborted', 'AbortError'))
                })
            })
        )

        const resultPromise = MatchingService.callMatchingService(fakeAdopterFull, [fakeDogSameShelter])

        await jest.advanceTimersByTimeAsync(MatchingService.TIMEOUT_MS)

        const result = await resultPromise

        expect(result).toEqual({ success: false, error: 'unavailable'})

        jest.useRealTimers()
    })

    it('returns service error on non-200 response', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ results: [fakeMatchResultFromPython] }), { status: 500 })
        )

        const result = await MatchingService.callMatchingService(fakeAdopterFull, [fakeDogSameShelter])

        expect(result).toEqual({ success: false, error: 'service_error', status: 500 })
    })

    it('returns contract mismatch if schema validation fails', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ results: 'abc' }), { status: 200 })
        )

        const result = await MatchingService.callMatchingService(fakeAdopterFull, [fakeDogSameShelter])

        expect(result).toMatchObject({ success: false, error: 'contract_mismatch'})

        if(!result.success && result.error === 'contract_mismatch') {
            expect(result.issues).toBeDefined()
        }
    })
})

describe('GET /api/adopter/matches', () => {
    it('gets cached match results when matches exist, returns 200', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        jest.spyOn(MatchModel, 'getMatchesByAdopterId').mockResolvedValue([withDog(fakeMatch)])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/matches')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(200)
    })

    it('creates and returns new matches if no cached results, returns 200', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        jest.spyOn(MatchModel, 'getMatchesByAdopterId').mockResolvedValue([])

        jest.spyOn(DogModel, 'getAllAvailableDogs').mockResolvedValue([fakeDogSameShelter, fakeDogUpdated, fakeDogWrongShelter])

        jest.spyOn(MatchingService, 'callMatchingService').mockResolvedValue({
            success: true,
            results: [fakeMatchResultFromPython]
        })

        jest.spyOn(MatchModel, 'createMatches').mockResolvedValue([fakeMatch])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/matches')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(200)
      expect(MatchModel.createMatches).toHaveBeenCalledTimes(1)
    })

    it('should return 503 if matching service is unavailable', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        jest.spyOn(MatchModel, 'getMatchesByAdopterId').mockResolvedValue([])

        jest.spyOn(DogModel, 'getAllAvailableDogs').mockResolvedValue([fakeDogSameShelter, fakeDogUpdated, fakeDogWrongShelter])

        jest.spyOn(MatchingService, 'callMatchingService').mockResolvedValue({
            success: false,
            error: 'unavailable'
        })

        jest.spyOn(MatchModel, 'createMatches').mockResolvedValue([fakeMatch])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/matches')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(503)
      expect(MatchModel.createMatches).not.toHaveBeenCalled()
    })

    it('should return 502 if matching service throws service error', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        jest.spyOn(MatchModel, 'getMatchesByAdopterId').mockResolvedValue([])

        jest.spyOn(DogModel, 'getAllAvailableDogs').mockResolvedValue([fakeDogSameShelter, fakeDogUpdated, fakeDogWrongShelter])

        jest.spyOn(MatchingService, 'callMatchingService').mockResolvedValue({
            success: false,
            error: 'service_error',
            status: 502
        })

        jest.spyOn(MatchModel, 'createMatches').mockResolvedValue([fakeMatch])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/matches')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(502)
      expect(MatchModel.createMatches).not.toHaveBeenCalled()
    })

    it('should return 500 if matching service schema validation fails', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        jest.spyOn(MatchModel, 'getMatchesByAdopterId').mockResolvedValue([])

        jest.spyOn(DogModel, 'getAllAvailableDogs').mockResolvedValue([fakeDogSameShelter, fakeDogUpdated, fakeDogWrongShelter])

        jest.spyOn(MatchingService, 'callMatchingService').mockResolvedValue({
            success: false,
            error: 'contract_mismatch',
            issues: []
        })

        jest.spyOn(MatchModel, 'createMatches').mockResolvedValue([fakeMatch])

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/matches')
        .set('Authorization', `Bearer ${adopterToken}`)

      expect(res.status).toBe(500)
      expect(MatchModel.createMatches).not.toHaveBeenCalled()
    })

    it('should return 401 if missing token', async () => {
        jest.spyOn(MatchModel, 'getMatchesByAdopterId').mockResolvedValue([withDog(fakeMatch)])

        const res = await request(app)
        .get('/api/adopter/matches')
        
        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Authentication required')
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterFull)

        jest.spyOn(MatchModel, 'getMatchesByAdopterId').mockResolvedValue([])

        jest.spyOn(DogModel, 'getAllAvailableDogs').mockResolvedValue([fakeDogSameShelter, fakeDogUpdated, fakeDogWrongShelter])

        jest.spyOn(MatchingService, 'callMatchingService').mockResolvedValue({
            success: true,
            results: [fakeMatchResultFromPython]
        })

        jest.spyOn(MatchModel, 'createMatches').mockRejectedValue(new Error('Database error'))

        const adopterToken = createTestToken({ id: 1, type: 'adopter' })

        const res = await request(app)
        .get('/api/adopter/matches')
        .set('Authorization', `Bearer ${adopterToken}`)

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Something went wrong generating matches')
    })

})