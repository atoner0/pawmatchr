import type { Response } from 'express';
import { getAdopterById, fillQuestionnaire, updateQuestionnaire } from '../models/adopter.js';
import type { AdopterAuthRequest } from '../middleware/auth.js';
import { createQuestionnaireSchema } from '../types/questionnaireSchema.js';

export const fillQuestionnaireController = async ( req: AdopterAuthRequest, res: Response): Promise<void> => {
    try {
        const answers = createQuestionnaireSchema.safeParse(req.body)
            if (!answers.success){
                res.status(400).json({ message: 'Invalid request', errors: answers.error.issues})
                return
            }
        const adopter = req.user

        const fullAdopter = await fillQuestionnaire(adopter.adopter_id, answers.data)
        res.status(200).json({ adopter: fullAdopter})
    } catch (error) {
        res.status(500).json({ message: 'Error filling questionnaire', error})
    }
}

export const updateQuestionnaireController = async ( req: AdopterAuthRequest, res: Response): Promise<void> => {
    try {
        const answers = createQuestionnaireSchema.partial().safeParse(req.body)
            if (!answers.success){
                res.status(400).json({ message: 'Invalid request', errors: answers.error.issues})
                return
            }

        const updates = req.body
        const adopter = req.user

        if (!updates || Object.keys(updates).length === 0) {
            res.status(400).json({message: 'No fields provided for update'})
            return
        }

        const updatedAdopter = await updateQuestionnaire(adopter.adopter_id, updates)
        res.status(200).json({updatedAdopter})
    } catch (error) {
        res.status(500).json({ message: 'Error updating questionnaire', error})
    }
}

export const getQuestionnaire = async ( req: AdopterAuthRequest, res: Response): Promise<void> => {
    try {
        const adopter = req.user
        const profile = await getAdopterById(adopter.adopter_id)

        if(!profile){
            res.status(404).json({ message: 'Profile not found' })
            return
        }

        res.status(200).json({profile})
    } catch (error) {
        res.status(500).json({ message: 'Error getting profile', error})
    }
}