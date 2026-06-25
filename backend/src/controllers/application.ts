import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { createApplication, getAllAdopterApps, getOneAdopterApp, getAppsByShelter, updateApplicationStatus, updateReadinessCheck } from '../models/application.js';
import { createApplicationSchema, updateChecklistSchema, updateStatusSchema, type ApplicationStatus } from '../types/applicationSchema.js';

export const createApplicationController = async ( req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = createApplicationSchema.safeParse(req.body)
        if (!result.success){
            res.status(400).json({ message: 'Invalid request', errors: result.error.issues})
            return
        }
        
        const dog = result.data
        const adopter = req.user

        const application = await createApplication(dog.dog_id, adopter.adopter_id)
        res.status(201).json({application})
    } catch (error) {
        res.status(500).json({ message: 'Error creating application', error})
    }
}

export const getAllAdopterApplications = async ( req: AuthRequest, res: Response): Promise<void> => {
    try {
        const adopter = req.user

        const applications = await getAllAdopterApps(adopter.adopter_id)

        res.status(200).json({applications})
    } catch (error) {
        res.status(500).json({ message: 'Error fetching adopter applications', error})
    }
}

export const getApplicationsForShelter = async ( req: AuthRequest, res: Response): Promise<void> => {
    if (req.userType !== "shelter_admin"){
            res.status(403).json({message: 'Admin access only'})
            return
        }

    try {
        const shelter = req.user

        const applications = await getAppsByShelter(shelter.shelter_id)

        res.status(200).json({applications})
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error})
    }
}

export const getApplicationById = async ( req: AuthRequest, res: Response): Promise<void> => {
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

        res.status(200).json({application})
    } catch (error) {
        res.status(500).json({ message: 'Error fetching adopter application', error})
    }
}

export const updateAppStatus = async ( req: AuthRequest, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] as string)
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid application ID'})
            return
        }

    if (req.userType !== "shelter_admin"){
            res.status(403).json({message: 'Admin access only'})
            return
        }

    try {
        const result = updateStatusSchema.safeParse(req.body)
        if (!result.success){
            res.status(400).json({ message: 'Invalid request', errors: result.error.issues})
            return
        }
        
        let application = await getOneAdopterApp(id)
        if (!application){
            res.status(404).json({ message: 'Application not found'})
            return
        }

        const currentStatus = application.status

        const newStatus = result.data.status

        const validTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
            submitted: ['under_review', 'withdrawn'],
            under_review: ['approved', 'rejected', 'withdrawn'],
            approved: ['adopted', 'withdrawn'],
            adopted: [],
            rejected: [],
            withdrawn: []
        }

        if (validTransitions[currentStatus].includes(newStatus)){
            if (currentStatus === 'submitted' && newStatus === 'under_review') {
                if (application.readiness_checklist === false){
                    res.status(403).json({ message: 'Readiness checklist not complete'})
                    return
                }
            }
            application = await updateApplicationStatus(id, newStatus)
        } else {
            res.status(400).json({ message: 'Invalid transition'})
            return
        }

        res.status(200).json({application})
    } catch (error) {
        res.status(500).json({ message: 'Error updating application status', error})
    }
}

export const updateChecklist = async ( req: AuthRequest, res: Response): Promise<void> => {
    const id = parseInt(req.params['id'] as string)
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid application ID'})
            return
        }

        if (req.userType !== "adopter"){
            res.status(403).json({message: 'Adopter access only'})
            return
        }

    try {
        const result = updateChecklistSchema.safeParse(req.body)
        if (!result.success){
            res.status(400).json({ message: 'Invalid request', errors: result.error.issues})
            return
        }

        let application = await getOneAdopterApp(id)

        if (!application){
            res.status(404).json({ message: 'Application not found'})
            return
        }

        const checkData = result.data.readiness_checklist

        application = await updateReadinessCheck(id, checkData)

        res.status(200).json({application})
    } catch (error) {
        res.status(500).json({ message: 'Error updating readiness checklist', error})
    }
}