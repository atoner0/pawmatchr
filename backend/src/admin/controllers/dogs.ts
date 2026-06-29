import type { Response } from 'express'
import type { AuthRequest } from '../../middleware/auth.js'
import { createDog, updateDog, deleteDog, getDogsByShelterId, getDogByIdAndShelterId, hasApplications } from '../../models/dog.js'
import { createDogSchema, updateDogSchema } from '../../types/dogSchemas.js'

export const renderAllDogsByShelter = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const shelterId = req.user.shelter_id

        const dogs = await getDogsByShelterId(shelterId)

        res.render('dogs/all', { title: 'Dogs', user: req.user, dogs: dogs })
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
        console.error(error)
    }
}

export const renderShelterDogById = async (req: AuthRequest, res: Response): Promise<void> => {
    const dogId = parseInt(req.params['id'] as string)
    if (isNaN(dogId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid dog ID' })
        return
    }

    try {
        const shelterId = req.user.shelter_id

        const dog = await getDogByIdAndShelterId(dogId, shelterId)

        if(!dog){
            res.status(404).render('error', { title: 'Error', message: 'Dog not found' })
            return
        }

        res.render('dogs/profile', { title: dog.name, user: req.user, dog: dog })
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
}

export const renderCreateDog = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
         res.render('dogs/new', { title: 'New Dog', user: req.user })
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
} 

export const postCreateDog = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const shelterId = req.user.shelter_id

        const normalised = {
            ...req.body,
            neutered: req.body.neutered === 'true',
            house_trained: req.body.house_trained === 'true',
            vaccinated: req.body.vaccinated === 'true',
            colour: [].concat(req.body.colour ?? []),
            medical_issues: [].concat(req.body.medical_issues ?? []),
            behavioural_flags: [].concat(req.body.behavioural_flags ?? []),
            known_triggers: [].concat(req.body.known_triggers ?? []),
            children_age: req.body.children_age ?? null
        }

        const result = createDogSchema.safeParse(normalised)
        if (!result.success) {
            res.status(400).render('dogs/new', { 
                title: 'Add Dog',
                user: req.user,
                errors: result.error.issues,
                formData: req.body
            })
            return
        }

        const { name, breed, age, gender, size, colour, neutered, house_trained, vaccinated, good_with_dogs, good_with_cats, good_with_children, children_age, alone_tolerance, activity_level, training_level, coat_length, coat_type, shedding_level, medical_issues, medical_notes, behavioural_flags, behavioural_notes, known_triggers, trigger_notes, description } = result.data

        const dog = await createDog(shelterId, name, breed, age, gender, size, colour, neutered, house_trained, vaccinated, good_with_dogs, good_with_cats, good_with_children, children_age ?? null, alone_tolerance, activity_level, training_level, coat_length, coat_type, shedding_level, medical_issues ?? [], medical_notes ?? null, behavioural_flags ?? [], behavioural_notes ?? null, known_triggers ?? [], trigger_notes ?? null, description)

        res.redirect(`/admin/dogs/`)

    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong when creating dog' })
        console.error(error)
    }
}

export const renderEditDog = async (req: AuthRequest, res: Response): Promise<void> => {
    const dogId = parseInt(req.params['id'] as string)
    if (isNaN(dogId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid dog ID' })
        return
    }

    try {
        const shelterId = req.user.shelter_id

        const dog = await getDogByIdAndShelterId(dogId, shelterId)
        if(!dog){
            res.status(404).render('error', { title: 'Error', message: 'Dog not found' })
            return
        }

         res.render('dogs/edit', { title: 'Edit Dog', user: req.user, dog: dog })
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
} 

export const postUpdateDog = async (req: AuthRequest, res: Response): Promise<void> => {
    const dogId = parseInt(req.params['id'] as string)
    if (isNaN(dogId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid dog ID' })
        return
    }

    try {
        const shelterId = req.user.shelter_id

        const dog = await getDogByIdAndShelterId(dogId, shelterId)
        if(!dog){
            res.status(404).render('error', { title: 'Error', message: 'Dog not found' })
            return
        }

        const normalised = {
            ...req.body,
            neutered: req.body.neutered === 'on',
            house_trained: req.body.house_trained === 'on',
            vaccinated: req.body.vaccinated === 'on',
            colour: [].concat(req.body.colour ?? []),
            medical_issues: [].concat(req.body.medical_issues ?? []),
            behavioural_flags: [].concat(req.body.behavioural_flags ?? []),
            known_triggers: [].concat(req.body.known_triggers ?? []),
            children_age: req.body.children_age ?? null
        }

        const result = updateDogSchema.safeParse(normalised)
        if (!result.success) {
            res.status(400).render('dogs/edit', { 
                title: 'Edit Dog',
                user: req.user,
                dog: dog,
                errors: result.error.issues,
                formData: req.body
            })
            return
        }

        await updateDog(dogId, result.data, shelterId)
        res.redirect(`/admin/dogs/${dog.dog_id}`)
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong when editing dog' })
    }
}

export const postDeleteDog = async (req: AuthRequest, res: Response): Promise<void> => {
    const dogId = parseInt(req.params['id'] as string)
    if (isNaN(dogId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid dog ID' })
        return
    }

    try {
        const shelterId = req.user.shelter_id

        const dog = await getDogByIdAndShelterId(dogId, shelterId)
        if(!dog){
            res.status(404).render('error', { title: 'Error', message: 'Dog not found' })
            return
        }

        const hasApps = await hasApplications(dogId)
        if (hasApps) {
            res.status(400).render('error', { title: 'Error', message: 'Cannot delete dog with existing applications' })
            return
        }

        await deleteDog(dogId, shelterId)
        
        res.redirect(`/admin/dogs`)
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong when deleting dog' })
    }
}