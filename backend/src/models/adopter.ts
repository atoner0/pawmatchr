import pool from '../config/db.js'

export interface Adopter {
    adopter_id: number
    first_name: string
    last_name: string
    email: string
    password_hash: string
    phone: string
}

export const findAdopterByEmail = async (email: string): Promise<Adopter | null> => {
    const result = await pool.query(
        `SELECT * FROM adopters WHERE email = $1`,
        [email]
    )
    return result.rows[0] || null
}

export const findAdopterById = async (id: number): Promise<Adopter | null> => {
    const result = await pool.query(
        `SELECT * FROM adopters WHERE adopter_id = $1`,
        [id]
    )
    return result.rows[0] || null
}

export const createAdopter = async (
    first_name: string,
    last_name: string,
    email: string,
    password_hash: string,
    phone: string
): Promise<Adopter> => {
    const result = await pool.query(
        `INSERT INTO adopters (first_name, last_name, email, password_hash, phone) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [first_name, last_name, email, password_hash, phone]
    )
    return result.rows[0] 
}
