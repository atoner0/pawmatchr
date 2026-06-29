import pool from '../config/db.js'
import type { Dog } from '../types/dog.js'
import type { DogAge, DogGender, DogSize, GoodWith, ChildrenAge, AloneTolerance, 
              ActivityLevel, TrainingLevel, CoatLength, CoatType, SheddingLevel, DogStatus } from '../types/dogSchemas.js'

export const getDogById = async(id: number): Promise<Dog | null> => {
    const result = await pool.query(
        `SELECT * FROM dogs WHERE dog_id = $1`,
        [id] 
    )
    return result.rows[0] || null
}

export const getDogsByShelterId = async(id: number): Promise<Dog[]> => {
    const result = await pool.query(
        `SELECT * FROM dogs WHERE shelter_id = $1`,
        [id] 
    )
    return result.rows
}

export const getDogByIdAndShelterId = async(dog_id: number, shelter_id: number): Promise<Dog | null> => {
    const result = await pool.query(
        `SELECT * FROM dogs 
        WHERE dog_id = $1 AND shelter_id = $2`,
        [dog_id, shelter_id] 
    )
    return result.rows[0] || null
}

export const getAllAvailableDogs = async(): Promise<Dog[]> => {
    const result = await pool.query(
        `SELECT * FROM dogs WHERE status = 'available'`
    )
    return result.rows
}

export const createDog = async (
        shelter_id: number,
        name: string,
        breed: string,
        age: DogAge,
        gender: DogGender,
        size: DogSize,
        colour: string[],
        neutered: boolean,
        house_trained: boolean,
        vaccinated: boolean,
        good_with_dogs: GoodWith,
        good_with_cats: GoodWith,
        good_with_children: GoodWith,
        children_age: ChildrenAge | null,
        alone_tolerance: AloneTolerance,
        activity_level: ActivityLevel,
        training_level: TrainingLevel,
        coat_length: CoatLength,
        coat_type: CoatType,
        shedding_level: SheddingLevel,
        medical_issues: string[],
        medical_notes: string | null,
        behavioural_flags: string[],
        behavioural_notes: string | null,
        known_triggers: string[],
        trigger_notes: string | null,
        description: string
): Promise<Dog> => {
    const result = await pool.query(
        `INSERT INTO dogs (shelter_id, name, breed, age, gender, size, colour, neutered, house_trained, vaccinated, good_with_dogs, good_with_cats, good_with_children, children_age, alone_tolerance, activity_level, training_level, coat_length, coat_type, shedding_level, medical_issues, medical_notes, behavioural_flags, behavioural_notes, known_triggers, trigger_notes, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
        RETURNING *`,
        [shelter_id, name, breed, age, gender, size, JSON.stringify(colour), neutered, house_trained, vaccinated, good_with_dogs, good_with_cats, good_with_children, children_age, alone_tolerance, activity_level, training_level, coat_length, coat_type, shedding_level, JSON.stringify(medical_issues), medical_notes, JSON.stringify(behavioural_flags), behavioural_notes, JSON.stringify(known_triggers), trigger_notes, description]
    )
    return result.rows[0] 
}

export const updateDog = async (
        dog_id: number,
        updates: Partial<Dog>,
        shelter_id: number
): Promise<Dog> => {   
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    if (fields.length === 0) {
        throw new Error("No fields provided for update")
    }

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ')
    
    const result = await pool.query(
        `UPDATE dogs 
        SET ${setClause} 
        WHERE dog_id = $${fields.length + 1} AND shelter_id = $${fields.length + 2}
        RETURNING *`,
        [...values, dog_id, shelter_id]
    )
    return result.rows[0] 
} 

export const hasApplications = async(dog_id: number): Promise<boolean> => {
    const result = await pool.query(
        `SELECT 1 FROM applications WHERE dog_id = $1 LIMIT 1`,
        [dog_id]
    )
    return (result.rowCount ?? 0) > 0
}

export const deleteDog = async(dog_id: number, shelter_id: number): Promise<void> => {
    await pool.query(
        `DELETE FROM dogs
        WHERE dog_id = $1 AND shelter_id = $2`,
        [dog_id, shelter_id]
    )
}
