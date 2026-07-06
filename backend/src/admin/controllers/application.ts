import type { Response } from 'express'
import type { AuthRequest } from '../../middleware/auth.js'
import { getAppsByShelter, getAppByIdAndShelter, getBookingsByApp, updateApplicationStatus } from '../../models/application.js'
import { getAdopterById } from '../../models/adopter.js'

export const renderApplicationsDash = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const shelterId = req.user.shelter_id

        const applications = await getAppsByShelter(shelterId)

        res.render('applications/all', { title: 'Applications', user: req.user, applications: applications })
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
}

export const renderApplicationProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const applicationId = parseInt(req.params['id'] as string)
    if (isNaN(applicationId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid application ID' })
        return
    }

    try {
        const shelterId = req.user.shelter_id

        const application = await getAppByIdAndShelter(applicationId, shelterId)
        if (!application) {
            res.status(404).render('error', { title: 'Error', message: 'Application not found' })
            return
        }

        const adopter = await getAdopterById(application.adopter_id)
        const bookings = await getBookingsByApp(applicationId)

        // TODO: replace with real match record once matches feature is built
        const match = {
            overall_score: 0.87,
            explanation: 'Strong match on activity level and alone tolerance. Adopter\'s multi-pet experience offsets Buddy\'s reactivity to other dogs',
            warnings: ['Unknown: good with cats']
        }

        res.render('applications/profile', {
            title: 'Applications',
            user: req.user,
            application: application,
            adopter: adopter,
            bookings: bookings,
            match: match
        })
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
}

export const applicationToUnderReview = async (req: AuthRequest, res: Response): Promise<void> => {
    const applicationId = parseInt(req.params['id'] as string)
    if (isNaN(applicationId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid application ID' })
        return
    }

    try {
        const shelterId = req.user.shelter_id

        const application = await getAppByIdAndShelter(applicationId, shelterId)
        if (!application) {
            res.status(404).render('error', { title: 'Error', message: 'Application not found' })
            return
        }

        if (application.status !== "submitted"){
            res.status(400).render('error', { title: 'Error', message: 'Application cannot be moved to review from its current status' })
            return
        }
        
        await updateApplicationStatus(applicationId, 'under_review')

        res.redirect(`/admin/applications/${applicationId}`)

    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong when updating application status' })
    }
}

export const approveApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    const applicationId = parseInt(req.params['id'] as string)
    if (isNaN(applicationId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid application ID' })
        return
    }

    try {
        const shelterId = req.user.shelter_id

        const application = await getAppByIdAndShelter(applicationId, shelterId)
        if (!application) {
            res.status(404).render('error', { title: 'Error', message: 'Application not found' })
            return
        }

        if (application.status !== "under_review"){
            res.status(400).render('error', { title: 'Error', message: 'Application cannot be approved from its current status' })
            return
        }

        const adopter = await getAdopterById(application.adopter_id)
        if (!adopter) {
            res.status(404).render('error', { title: 'Error', message: 'Adopter not found' })
            return
        }    
        
        const bookings = await getBookingsByApp(applicationId)
        const completedTypes = bookings
            .filter(b => b.status === 'completed')
            .map(b => b.booking_type)

        const requiredTypes = ['initial_meet', 'home_check']
        if (adopter.current_pets === true){
            requiredTypes.push('pet_introduction')
        }

        const missing = requiredTypes.filter(type => !completedTypes.includes(type))

        if (missing.length > 0) {
            res.status(409).render('applications/profile', {
                title: 'Applications',
                user: req.user,
                application: application,
                adopter: adopter,
                bookings: bookings,
                match: { // PLACEHOLDER
                    overall_score: 0.87,
                    explanation: 'Strong match on activity level and alone tolerance. Adopter\'s multi-pet experience offsets Buddy\'s reactivity to other dogs',
                    warnings: ['Unknown: good with cats']
                },
                missing: missing
            })
            return
        }

        await updateApplicationStatus(applicationId, 'approved')

        res.redirect(`/admin/applications/${applicationId}`)
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong when approving application'})
    }
}

export const rejectApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    const applicationId = parseInt(req.params['id'] as string)
    if (isNaN(applicationId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid application ID' })
        return
    }

    try {
        const shelterId = req.user.shelter_id

        const application = await getAppByIdAndShelter(applicationId, shelterId)
        if (!application) {
            res.status(404).render('error', { title: 'Error', message: 'Application not found' })
            return
        }

        if (application.status !== "under_review"){
            res.status(400).render('error', { title: 'Error', message: 'Application cannot be rejected from its current status' })
            return
        }

        await updateApplicationStatus(applicationId, 'rejected')

        res.redirect(`/admin/applications/${applicationId}`)
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong when updating application status' })
    }
}