import pool from '../config/db.js'
import type { Application } from '../types/application.js'
import type { ApplicationStatus } from '../types/applicationSchema.js'

export const createApplication = async (
    dog_id: number,
    adopter_id: number
): Promise<Application> => {
    const result = await pool.query(
        `INSERT INTO applications (dog_id, adopter_id) 
        VALUES ($1, $2) RETURNING *`,
        [dog_id, adopter_id]
    )
    return result.rows[0] 
}

export const getAllAdopterApps = async(adopter_id: number): Promise<Application[]> => {
    const result = await pool.query(
        `SELECT * FROM applications WHERE adopter_id = $1`,
        [adopter_id]
    )
    return result.rows
}

export const getOneAdopterApp = async(application_id: number): Promise<Application> => {
    const result = await pool.query(
        `SELECT * FROM applications WHERE application_id = $1`,
        [application_id]
    )
    return result.rows[0]
}

export const updateApplicationStatus = async(application_id: number, status: ApplicationStatus): Promise<Application> => {
    const result = await pool.query(
        `UPDATE applications 
         SET status = $1
         WHERE application_id = $2
         RETURNING *`,
        [status, application_id]
    )
    return result.rows[0]
}

export const updateReadinessCheck = async(application_id: number, readiness_checklist: boolean): Promise<Application> => {
    const result = await pool.query(
        `UPDATE applications 
         SET readiness_checklist = $1
         WHERE application_id = $2
         RETURNING *`,
        [readiness_checklist, application_id]
    )
    return result.rows[0]
}