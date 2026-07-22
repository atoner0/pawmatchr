import { describe, it, expect, beforeEach, afterEach, afterAll } from '@jest/globals'
import { createMatches, getMatchesByAdopterId } from '../../src/models/match.js'
import { clearMatchTestData, seedMatchTestData } from './seedHelpers.js'
import testPool from './testPool.js'
import type { MatchResultFromPython } from '../../src/types/matchSchema.js'

afterAll(async () => {
    await testPool.end()
})

describe('createMatches (integration, real DB)', () => {
    let ids: Awaited<ReturnType<typeof seedMatchTestData>>

    beforeEach(async () => {
        ids = await seedMatchTestData()
    })
    
    afterEach(async () => {
        await clearMatchTestData()
    })

    it('inserts new match row correctly when no existing row for that adopter/dog pair', async () => {
        const results: MatchResultFromPython[] = [
            {
                dog_id: ids.dog2Id,
                overall_score: 0.82,
                fuzzy_score: 0.85,
                semantic_score: 0.75,
                warnings: [],
                explanation: 'A fresh match with no prior row'
            }
        ]

        const matches = await createMatches(ids.adopterId, results)

        expect(matches).toHaveLength(1)
        expect(matches[0]).toMatchObject({
            dog_id: ids.dog2Id,
            overall_score: 0.8200,
            fuzzy_score: 0.8500,
            semantic_score: 0.7500,
            warnings: [],
            explanation: 'A fresh match with no prior row'
        })

        const check = await testPool.query(
            `SELECT * FROM matches WHERE dog_id = $1 AND adopter_id = $2`,
            [ids.dog2Id, ids.adopterId]
        )

        expect(check.rows).toHaveLength(1)
    })

    it('upserts correctly on conflict', async () => {
        const updatedResults: MatchResultFromPython[] = [
            {
                dog_id: ids.dog1Id,
                overall_score: 0.91,
                fuzzy_score: 0.95,
                semantic_score: 0.8,
                warnings: ['Unknown whether this dog is good with cats'],
                explanation: 'An updated match, should overwrite the seeded one'
            }
        ]

        const matches = await createMatches(ids.adopterId, updatedResults)

        expect(matches).toHaveLength(1)
        expect(matches[0]).toMatchObject({
            match_id: ids.existingMatchId,
            dog_id: ids.dog1Id,
            overall_score: 0.9100,
            fuzzy_score: 0.9500,
            semantic_score: 0.8000,
            warnings: ['Unknown whether this dog is good with cats'],
            explanation: 'An updated match, should overwrite the seeded one'
        })

        const check = await testPool.query(
            `SELECT * FROM matches WHERE dog_id = $1 AND adopter_id = $2`,
            [ids.dog1Id, ids.adopterId]
        )

        expect(check.rows).toHaveLength(1)
        expect(check.rows[0].match_id).toBe(ids.existingMatchId)
    })

    it('rolls back entire batch if one insert fails', async () => {
        const invalidResults: MatchResultFromPython[] = [
            {
                dog_id: ids.dog2Id,
                overall_score: 0.7,
                fuzzy_score: 0.75,
                semantic_score: 0.6,
                warnings: [],
                explanation: 'Valid dog, should not end up persisted'
            },
            {
                dog_id: 9999999,
                overall_score: 0.5,
                fuzzy_score: 0.5,
                semantic_score: 0.5,
                warnings: [],
                explanation: 'Invalid dog_id, should trigger FK violation'
            }
        ]

        await expect(createMatches(ids.adopterId, invalidResults)).rejects.toThrow()

        const check = await testPool.query(
            `SELECT * FROM matches WHERE dog_id = $1`,
            [ids.dog2Id]
        )

        expect(check.rows).toHaveLength(0)
    })

    it('only allows one of two concurrent new matches to succeed', async () => {
        const result1: MatchResultFromPython[] = [
            {
                dog_id: ids.dog1Id,
                overall_score: 0.91,
                fuzzy_score: 0.95,
                semantic_score: 0.8,
                warnings: ['Unknown whether this dog is good with cats'],
                explanation: 'From the first concurrent call'
            }
        ]

        const result2: MatchResultFromPython[] = [
            {
                dog_id: ids.dog1Id,
                overall_score: 0.82,
                fuzzy_score: 0.85,
                semantic_score: 0.75,
                warnings: [],
                explanation: 'From the second concurrent call'
            }
        ]

        await Promise.all([
            createMatches(ids.adopterId, result1),
            createMatches(ids.adopterId, result2)
        ])

        const check = await testPool.query(
            `SELECT * FROM matches WHERE dog_id = $1 AND adopter_id = $2`,
            [ids.dog1Id, ids.adopterId]
        )

        expect(check.rows).toHaveLength(1)
        expect(['From the first concurrent call', 'From the second concurrent call']).toContain(check.rows[0].explanation)
    })
})

describe('getMatchesByAdopterId (integration, real DB', () => {
    let ids: Awaited<ReturnType<typeof seedMatchTestData>>

    beforeEach(async () => {
        ids = await seedMatchTestData()
    })
    
    afterEach(async () => {
        await clearMatchTestData()
    })

    it('returns the seeded match with correctly nested dog and shelter objects', async () => {
        const matches = await getMatchesByAdopterId(ids.adopterId)

        expect(matches).toHaveLength(1)

        const match = matches[0]

        expect(match?.match_id).toBe(ids.existingMatchId)
        expect(match?.dog_id).toBe(ids.dog1Id)
        expect(match?.adopter_id).toBe(ids.adopterId)

        expect(match?.dog).toMatchObject({
            dog_id: ids.dog1Id,
            shelter_id: ids.shelterId,
            name: 'Buddy',
            breed: 'Labrador'
        })

        expect(match?.shelter).toMatchObject({
            shelter_id: ids.shelterId,
            name: 'Test Shelter',
            city: 'Belfast',
            postcode: 'BT1 1AA'
        })
    })

    it('returns an empty array when adopter has no matches', async () => {
        const matches = await getMatchesByAdopterId(6)

        expect(matches).toHaveLength(0)

        
    })
})