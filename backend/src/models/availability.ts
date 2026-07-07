import pool from '../config/db.js'
import type { Availability } from '../types/availability.js';

export const getAvailabilityByShelter = async ( shelter_id: number ): Promise<Availability[]> => {
    const result = await pool.query(
        `SELECT * FROM availability
        WHERE shelter_id = $1`,
        [shelter_id]
    )
    return result.rows
}

export const getAvailabilityByIdAndShelter = async ( availability_id: number, shelter_id: number ): Promise<Availability | null> => {
    const result = await pool.query(
        `SELECT * FROM availability
        WHERE availability_id = $1 AND shelter_id = $2`,
        [availability_id, shelter_id]
    )
    return result.rows[0] ?? null
}

export const createAvailability = async (
    shelter_id: number, 
    slot: string, 
): Promise<Availability> => {
    const result = await pool.query(
        `INSERT INTO availability (shelter_id, slot)
        VALUES ($1, $2)
        RETURNING *`,
        [shelter_id, slot]
    )
    return result.rows[0]
}

export const updateAvailability = async (
    slot: string, 
    availability_id: number, 
    shelter_id: number ): Promise<Availability | null > => {
    const result = await pool.query(
        `UPDATE availability
        SET slot = $1
        WHERE availability_id = $2 AND shelter_id = $3 AND is_booked = FALSE
        RETURNING *`,
        [slot, availability_id, shelter_id]
    )
    return result.rows[0] ?? 0
}

export const deleteAvailability = async (availability_id: number, shelter_id: number): Promise<number> => {
    const result = await pool.query(
        `DELETE FROM availability
        WHERE availability_id = $1 AND shelter_id = $2 AND is_booked = FALSE`,
        [availability_id, shelter_id]
    )
    return result.rowCount ?? 0
}