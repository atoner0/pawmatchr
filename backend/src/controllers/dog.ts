import type { Request, Response } from 'express';
import { findDogById, findDogByShelterId, createDog, updateDog, deleteDog, hasApplications, getAllDogs } from '../models/dog.js';
import { createDogSchema } from '../types/dogSchemas.js';
import type { AuthRequest } from '../middleware/auth.js';

export const getDogbyId = async ( req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] as string)
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid dog ID'})
        return
    }

    try {
        const dog = await findDogById(id)
        if(!dog){
            res.status(404).json({ message: 'Dog not found' })
        }

        res.status(200).json(dog)
    } catch (error) {
        res.status(500).json({ message: 'Error during dog search', error})
    }
}

export const getDogsForShelter = async ( req: AuthRequest, res: Response): Promise<void> => {
    const shelter_id = req.user.shelter_id

    try {
        const dogs = await findDogByShelterId(shelter_id)
        if(!dogs){
            res.status(404).json({ message: 'Dogs not found' })
            return
        }

        res.status(200).json(dogs)
    } catch (error) {
        res.status(500).json({ message: 'Error during dog search', error})
    }
}

export const getAvailableDogs = async ( req: Request, res: Response): Promise<void> => {
    try {
        const dogs = await getAllDogs()
        if(!dogs){
            res.status(404).json({ message: 'Dogs not found' })
            return
        }

        res.status(200).json(dogs)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available dogs', error})
    }
}

export const postDog = async ( req: AuthRequest, res: Response): Promise<void> => {
    const result = createDogSchema.safeParse(req.body)
    if (!result.success){
        res.status(400).json({ message: 'Invalid request', errors: result.error.issues})
        return
    }
    const shelter_id = req.user.shelter_id

    if (req.userType !== "shelter_admin"){
        res.status(403).json({message: 'Only shelter admins can create dogs'})
        return
    }

    const {name, breed, age, gender, size, colour, neutered, house_trained, vaccinated, good_with_dogs, good_with_cats, good_with_children, children_age, alone_tolerance, activity_level, training_level, coat_length, coat_type, shedding_level, medical_issues, medical_notes, behavioural_flags, behavioural_notes, known_triggers, trigger_notes, description } = result.data

    try {
        const dog = await createDog(shelter_id, name, breed, age, gender, size, colour, neutered, house_trained, vaccinated, good_with_dogs, good_with_cats, good_with_children, children_age ?? null, alone_tolerance, activity_level, training_level, coat_length, coat_type, shedding_level, medical_issues ?? [], medical_notes ?? null, behavioural_flags ?? [], behavioural_notes ?? null, known_triggers ?? [], trigger_notes ?? null, description)

        res.status(201).json(dog)
    } catch (error) {
        res.status(500).json({ message: 'Error creating dog', error})
    }
}

export const patchDog = async ( req: AuthRequest, res: Response): Promise<void> => {
    try {
        const dog_id = Number(req.params.id)
        const updates = req.body

        if (req.userType !== "shelter_admin"){
            res.status(403).json({message: 'Admin access only'})
            return
        }

        const admin = req.user

        const dog = await findDogById(dog_id)
        if(!dog){
            res.status(404).json({ message: 'Dog not found' })
            return
        }

        if (dog.shelter_id !== admin.shelter_id) {
            res.status(403).json({message: 'You cannot edit dogs from another shelter'})
            return
        }

        if (!updates || Object.keys(updates).length === 0) {
            res.status(400).json({message: 'No fields provided for update'})
            return
        }

        const updatedDog = await updateDog(dog_id, updates)

        res.status(200).json({updatedDog})
    } catch (error) {
        res.status(500).json({ message: 'Error updating dog', error})
    }
}

export const deleteDogController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const dog_id = Number(req.params.id)

        if (req.userType !== "shelter_admin"){
            res.status(403).json({message: 'Admin access only'})
            return
        }

        const admin = req.user

        const dog = await findDogById(dog_id)
        if(!dog){
            res.status(404).json({ message: 'Dog not found' })
            return
        }

        if (dog.shelter_id !== admin.shelter_id) {
            res.status(403).json({message: 'You cannot delete dogs from another shelter'})
            return
        }

        const hasApps = await hasApplications(dog_id)
        if (hasApps) {
            res.status(400).json({message: 'Cannot delete dog with existing applications'})
            return
        }

        await deleteDog(dog_id)

        res.status(200).json({ message: 'Dog deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Error deleting dog', error})
    }
}