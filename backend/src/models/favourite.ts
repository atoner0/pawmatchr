import pool from '../config/db.js'
import type { Favourite } from '../types/favourite.js'

export const getFavouritesByAdopter = async (adopter_id: number): Promise<Favourite[]> => {
    const result = await pool.query(
        `SELECT * FROM favourites WHERE adopter_id = $1`,
        [adopter_id]
    )
    return result.rows
}

export const addFavourite = async (adopter_id: number, dog_id: number): Promise<Favourite> => {
    const result = await pool.query(
        `INSERT INTO favourites (adopter_id, dog_id)
        VALUES ($1, $2)
        RETURNING *`,
        [adopter_id, dog_id]
    )
    return result.rows[0] 
}

export const deleteFavourite = async (adopter_id: number, dog_id: number): Promise<number> => {
    const result = await pool.query(
        `DELETE FROM favourites 
        WHERE favourite_id = $1 AND dog_id = $2`,
        [adopter_id, dog_id]
    )
    return result.rowCount ?? 0
}