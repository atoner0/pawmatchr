import { describe, it, expect, beforeEach, afterEach, afterAll } from '@jest/globals'
import { updateQuestionnaire, fillQuestionnaire } from '../../src/models/adopter.js'
import { clearMatchTestData, seedMatchTestData } from './seedHelpers.js'
import { fakeQuestionnaireInput } from '../utils/fakeProfiles.js'
import testPool from './testPool.js'

afterAll(async () => {
    await testPool.end()
})

describe('updateQuestionnaire invalidates matches (integration, real DB)', () => {
    let ids: Awaited<ReturnType<typeof seedMatchTestData>>

    beforeEach(async () => {
        ids = await seedMatchTestData()
    })

    afterEach(async () => {
        await clearMatchTestData()
    })

    it('updates the adopter and deletes their existing matches, both commited together', async () => {
        const updated = await updateQuestionnaire(ids.adopterId, { activity_level: 'high' })

        expect(updated.activity_level).toBe('high')

        const matchCheck = await testPool.query(
            `SELECT * FROM matches WHERE adopter_id = $1`,
            [ids.adopterId]
        )
        expect(matchCheck.rows).toHaveLength(0)
    })
})

describe('fillQuestionnaire invalidates matches (integration, real DB)', () => {
    let ids: Awaited<ReturnType<typeof seedMatchTestData>>

    beforeEach(async () => {
        ids = await seedMatchTestData()
    })

    afterEach(async () => {
        await clearMatchTestData()
    })

    it('fills the adopter questionnaire fields and deletes their existing matches, both commited together', async () => {
        const filled = await fillQuestionnaire(ids.adopterId, fakeQuestionnaireInput)

        expect(filled.home_type).toBe(fakeQuestionnaireInput.home_type)
        expect(filled.activity_level).toBe(fakeQuestionnaireInput.activity_level)

        const matchCheck = await testPool.query(
            `SELECT * FROM matches WHERE adopter_id = $1`,
            [ids.adopterId]
        )
        expect(matchCheck.rows).toHaveLength(0)
    })
})