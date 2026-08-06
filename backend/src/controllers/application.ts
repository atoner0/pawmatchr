import type { Response } from 'express';
import type { AdopterAuthRequest } from '../middleware/auth.js';
import { createApplication, getActiveApplicationsByDogAndAdopter, getAllAdopterApps, getOneAdopterApp, updateApplicationStatus, updateReadinessCheck } from '../models/application.js';
import { createApplicationSchema, updateChecklistSchema, type ApplicationStatus } from '../types/applicationSchema.js';

export const createApplicationController = async ( req: AdopterAuthRequest, res: Response): Promise<void> => {
    try {
        const result = createApplicationSchema.safeParse(req.body)
        if (!result.success){
            res.status(400).json({ message: 'Invalid request', errors: result.error.issues})
            return
        }
        
        const dog = result.data
        const adopter = req.user!

        const existing = await getActiveApplicationsByDogAndAdopter(dog.dog_id, adopter.adopter_id)
        if (existing) {
            res.status(409).json({ message: 'An active application already exists for this dog', application: existing })
            return
        }

        const application = await createApplication(dog.dog_id, adopter.adopter_id)
        res.status(201).json({application})
    } catch (error) {
        res.status(500).json({ message: 'Error creating application', error})
    }
}

export const getAllAdopterApplications = async ( req: AdopterAuthRequest, res: Response): Promise<void> => {
    try {
        const adopter = req.user!

        const applications = await getAllAdopterApps(adopter.adopter_id)

        res.status(200).json({applications})
    } catch (error) {
        res.status(500).json({ message: 'Error fetching adopter applications', error})
    }
}

export const getApplicationById = async ( req: AdopterAuthRequest, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] as string)
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid application ID'})
        return
    }
    try {
        const application = await getOneAdopterApp(id)
        if(!application){
            res.status(404).json({ message: 'Application not found' })
            return
        }

        if (application.adopter_id !== req.user!.adopter_id) {
            res.status(403).json({ message: 'Not your application' })
            return
        }

        res.status(200).json({application})
    } catch (error) {
        res.status(500).json({ message: 'Error fetching adopter application', error})
    }
}

export const updateChecklist = async ( req: AdopterAuthRequest, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] as string)
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid application ID'})
            return
        }

    try {
        const result = updateChecklistSchema.safeParse(req.body)
        if (!result.success){
            res.status(400).json({ message: 'Invalid request', errors: result.error.issues})
            return
        }

        const application = await getOneAdopterApp(id)

        if (!application){
            res.status(404).json({ message: 'Application not found'})
            return
        }

        if (application.adopter_id !== req.user!.adopter_id) {
            res.status(403).json({ message: 'Not your application' })
            return
        }

        const checkData = result.data.readiness_checklist

        const updated = await updateReadinessCheck(id, checkData)

        res.status(200).json({application: {...application, ...updated}})
    } catch (error) {
        res.status(500).json({ message: 'Error updating readiness checklist', error})
    }
}

export const withdrawApplication = async (req: AdopterAuthRequest, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] as string)
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid application ID' })
        return
    }

    try {
        const application = await getOneAdopterApp(id)
        if (!application) {
            res.status(404).json({ message: 'Application not found' })
            return
        }

        if (application.adopter_id !== req.user!.adopter_id) {
            res.status(403).json({ message: 'Not your application' })
            return
        }

        const withdrawableStates: ApplicationStatus[] = ['submitted', 'under_review', 'approved']
        if (!withdrawableStates.includes(application.status)) {
            res.status(400).json({ message: 'Application cannot be withdrawn from its current status' })
            return
        }

        const updated = await updateApplicationStatus(id, 'withdrawn')
        res.status(200).json({ application: {...application, ...updated} })
    } catch (error) {
        res.status(500).json({ message: 'Error withdrawing application', error })
    }
}