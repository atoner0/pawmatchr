import pool from '../config/db.js'
import type { Match, MatchWithDog } from '../types/match.js'
import type { MatchResultFromPython } from '../types/matchSchema.js'

export const getMatchesByAdopterId = async (adopter_id: number):
Promise<MatchWithDog[]> => {
    const result = await pool.query(
        `SELECT 
            matches.*, 
            to_jsonb(dogs.*) AS dog, 
            json_build_object(
                'shelter_id', shelters.shelter_id,
                'name', shelters.name,
                'city', shelters.city,
                'postcode', shelters.postcode
            ) AS shelter
        FROM matches
        JOIN dogs ON matches.dog_id = dogs.dog_id
        JOIN shelters ON dogs.shelter_id = shelters.shelter_id
        WHERE matches.adopter_id = $1
        ORDER BY matches.overall_score DESC`,
        [adopter_id]
    )
    return result.rows
}

export const getMatchByAdopterAndDog = async (
    adopter_id: number,
    dog_id: number
): Promise<Match | null> => {
    const result = await pool.query(
        `SELECT * FROM matches
        WHERE adopter_id = $1 AND dog_id = $2`,
        [adopter_id, dog_id]
    )
    return result.rows[0] ?? null
}

export const createMatches = async (
    adopter_id: number,
    results: MatchResultFromPython[]
): Promise<void> => {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        for (const result of results) {
            const matchResult = await client.query(
                `INSERT INTO matches (dog_id, adopter_id, overall_score, fuzzy_score, semantic_score, warnings, explanation)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (adopter_id, dog_id)
                DO UPDATE SET
                    overall_score = EXCLUDED.overall_score,
                    fuzzy_score = EXCLUDED.fuzzy_score,
                    semantic_score = EXCLUDED.semantic_score,
                    warnings = EXCLUDED.warnings,
                    explanation = EXCLUDED.explanation,
                    generated_at = now()
                RETURNING *`,
                [
                    result.dog_id,
                    adopter_id,
                    result.overall_score,
                    result.fuzzy_score,
                    result.semantic_score,
                    JSON.stringify(result.warnings),
                    result.explanation
                ]
            )

            if (!matchResult.rows[0]) {
                throw new Error ('Match upsert did not return a row')
            }
        }

        await client.query('COMMIT')
        
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

