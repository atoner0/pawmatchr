import pool from '../config/db.js'
import type { Favourite } from '../types/favourite.js'
import type { MatchWithDog } from '../types/match.js'

export const getFavouritesByAdopter = async (adopter_id: number): Promise<MatchWithDog[]> => {
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
            FROM favourites
            JOIN dogs ON favourites.dog_id = dogs.dog_id
            JOIN shelters ON dogs.shelter_id = shelters.shelter_id
            JOIN matches ON matches.adopter_id = favourites.adopter_id AND matches.dog_id = favourites.dog_id
            WHERE favourites.adopter_id = $1
            ORDER BY matches.overall_score DESC`,
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