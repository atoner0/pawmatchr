import pool from '../config/db.js'
import type { Application, ApplicationWithDetails } from '../types/application.js'
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

export const getAllAdopterApps = async(adopter_id: number): Promise<ApplicationWithDetails[]> => {
    const result = await pool.query(
        `SELECT applications.*,
            dogs.name AS dog_name, dogs.photo_url, dogs.shelter_id, dogs.breed, dogs.gender,
            shelters.name AS shelter_name, shelters.city AS shelter_city, 
            adopters.first_name, adopters.last_name 
         FROM applications 
         JOIN dogs ON applications.dog_id = dogs.dog_id
         JOIN shelters ON dogs.shelter_id = shelters.shelter_id
         JOIN adopters ON applications.adopter_id = adopters.adopter_id
         WHERE applications.adopter_id = $1`,
        [adopter_id]
    )
    return result.rows
}

export const getAppsByShelter = async(shelter_id: number): Promise<ApplicationWithDetails[]> => {
    const result = await pool.query(
        `SELECT applications.*,
            dogs.name AS dog_name, dogs.photo_url, dogs.shelter_id, dogs.breed, dogs.gender,
            shelters.name AS shelter_name, shelters.city AS shelter_city, 
            adopters.first_name, adopters.last_name 
         FROM applications 
         JOIN dogs ON applications.dog_id = dogs.dog_id
         JOIN shelters ON dogs.shelter_id = shelters.shelter_id
         JOIN adopters ON applications.adopter_id = adopters.adopter_id
         WHERE dogs.shelter_id = $1`,
        [shelter_id]
    )
    return result.rows
}

export const getAppByIdAndShelter = async(application_id: number, shelter_id: number): Promise<ApplicationWithDetails | null > => {
    const result = await pool.query(
        `SELECT applications.*,
            dogs.name AS dog_name, dogs.photo_url, dogs.shelter_id, dogs.breed, dogs.gender,
            shelters.name AS shelter_name, shelters.city AS shelter_city, 
            adopters.first_name, adopters.last_name 
         FROM applications 
         JOIN dogs ON applications.dog_id = dogs.dog_id
         JOIN shelters ON dogs.shelter_id = shelters.shelter_id
         JOIN adopters ON applications.adopter_id = adopters.adopter_id
         WHERE application_id = $1 AND dogs.shelter_id = $2`,
        [application_id, shelter_id]
    )
    return result.rows[0] ?? null
}

export const getOneAdopterApp = async(application_id: number): Promise<ApplicationWithDetails | null> => {
    const result = await pool.query(
        `SELECT applications.*,
            dogs.name AS dog_name, dogs.photo_url, dogs.shelter_id, dogs.breed, dogs.gender,
            shelters.name AS shelter_name, shelters.city AS shelter_city, 
            adopters.first_name, adopters.last_name 
         FROM applications 
         JOIN dogs ON applications.dog_id = dogs.dog_id
         JOIN shelters ON dogs.shelter_id = shelters.shelter_id
         JOIN adopters ON applications.adopter_id = adopters.adopter_id
         WHERE application_id = $1`,
        [application_id]
    )
    return result.rows[0] ?? null
}

export const getActiveApplicationsByDogAndAdopter = async (
    dog_id: number,
    adopter_id: number
): Promise<Application | null> => {
    const result = await pool.query(
        `SELECT * FROM applications
        WHERE dog_id = $1 AND adopter_id = $2
        AND status != 'withdrawn'`,
        [dog_id, adopter_id]
    )
    return result.rows[0] ?? null
}

export const getRecentAppsByShelter = async (shelter_id: number, limit: number = 2): Promise<ApplicationWithDetails[]> => {
    const result = await pool.query(
        `SELECT applications.*,
            dogs.name AS dog_name, dogs.photo_url, dogs.shelter_id, dogs.breed, dogs.gender,
            shelters.name AS shelter_name, shelters.city AS shelter_city, 
            adopters.first_name, adopters.last_name 
         FROM applications 
         JOIN dogs ON applications.dog_id = dogs.dog_id
         JOIN shelters ON dogs.shelter_id = shelters.shelter_id
         JOIN adopters ON applications.adopter_id = adopters.adopter_id
        WHERE dogs.shelter_id = $1
        ORDER BY applications.submitted_at DESC
        LIMIT $2`,
        [shelter_id, limit]
    )
    return result.rows
}

export interface BookingProgress {
    booking_type: string
    status: string
    slot: Date
}

export const getBookingsByApp = async(application_id: number): Promise<BookingProgress[]> => {
    const result = await pool.query(
        `SELECT bookings.booking_type, bookings.status, availability.slot
         FROM bookings
         JOIN availability ON bookings.availability_id = availability.availability_id
         WHERE bookings.application_id = $1`,
        [application_id]
    )
    return result.rows
}

export const updateApplicationStatus = async(
    application_id: number, 
    status: ApplicationStatus
): Promise<Application> => {
    const result = await pool.query(
        `UPDATE applications 
         SET status = $1,
            decision_at = CASE WHEN $1 IN ('approved', 'rejected') THEN now() ELSE decision_at END,
            adopted_at = CASE WHEN $1 = 'adopted' THEN now() ELSE adopted_at END
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

