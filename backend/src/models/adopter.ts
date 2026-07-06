import pool from '../config/db.js'
import type { Adopter } from '../types/adopter.js'
import type { QuestionnaireInput } from '../types/questionnaireSchema.js'


export const getAdopterByEmail = async (email: string): Promise<Adopter | null> => {
    const result = await pool.query(
        `SELECT * FROM adopters WHERE email = $1`,
        [email]
    )
    return result.rows[0] || null
}

export const getAdopterById = async (id: number): Promise<Adopter | null> => {
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
    phone: string,
    postcode: string
): Promise<Adopter> => {
    const result = await pool.query(
        `INSERT INTO adopters (first_name, last_name, email, password_hash, phone, postcode) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [first_name, last_name, email, password_hash, phone, postcode]
    )
    return result.rows[0] 
}

export const fillQuestionnaire = async (
        adopter_id: number,
        updates: QuestionnaireInput
): Promise<Adopter> => {   
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ')
    
    const result = await pool.query(
        `UPDATE adopters 
        SET ${setClause} 
        WHERE adopter_id = $${fields.length + 1}
        RETURNING *`,
        [...values, adopter_id]
    )
    return result.rows[0] 
} 

export const updateQuestionnaire = async (
        adopter_id: number,
        updates: Partial<QuestionnaireInput>
): Promise<Adopter> => {   
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    if (fields.length === 0) {
        throw new Error("No fields provided for update")
    }

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ')
    
    const result = await pool.query(
        `UPDATE adopters 
        SET ${setClause} 
        WHERE adopter_id = $${fields.length + 1}
        RETURNING *`,
        [...values, adopter_id]
    )
    return result.rows[0] 
} 
