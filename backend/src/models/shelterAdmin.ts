import pool from '../config/db.js'

export interface ShelterAdmin {
    staff_id: number
    shelter_id: number
    email: string
    password_hash: string
    name: string
}

export type SafeShelterAdmin = Omit<ShelterAdmin, 'password_hash'>

export const getAdminByEmail = async (email: string): Promise<ShelterAdmin | null> => {
    const result = await pool.query(
        `SELECT * FROM shelter_admins WHERE email = $1`,
        [email]
    )
    return result.rows[0] || null
}

export const getAdminById = async (id: number): Promise<SafeShelterAdmin | null> => {
    const result = await pool.query(
        `SELECT * FROM shelter_admins WHERE staff_id = $1`,
        [id]
    )
    return result.rows[0] || null
}
