import type { Response } from 'express'
import type { AdminAuthRequest } from '../../middleware/auth.js'
import { getAvailabilityByShelter, createAvailability, updateAvailability, deleteAvailability, getAvailabilityByIdAndShelter } from '../../models/availability.js'
import { createAvailabilitySchema } from '../../types/availabilitySchema.js'

export const renderAvailability = async (req: AdminAuthRequest, res: Response) => {
    try {
        const shelterId = req.user!.shelter_id
        const slots = await getAvailabilityByShelter(shelterId)

        res.render('availability/slots', { title: 'Availability Slots', slots: slots })
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
}

export const renderCreateAvailability = async (req: AdminAuthRequest, res: Response) => {
    try {
        res.render('availability/new', { 
            title: 'New Availability Slot', 
            user: req.user,
            formData: {},
            errors: []
        })
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
}

export const postCreateAvailability = async (req: AdminAuthRequest, res: Response) => {
    try {
        const shelterId = req.user!.shelter_id

        const result = createAvailabilitySchema.safeParse(req.body)
        if (!result.success){
            res.status(400).render('availability/new', { 
                title: 'Add Availability Slot',
                user: req.user,
                errors: result.error.issues,
                formData: req.body
            })
            return
        }

        await createAvailability(shelterId, result.data.slot)
        res.redirect('/admin/availability')
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong when creating slot' })
    }
}

export const renderEditAvailability = async (req: AdminAuthRequest, res: Response) => {
    const availabilityId = parseInt(req.params['id'] as string)
    if (isNaN(availabilityId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid availability ID' })
        return
    }
    
    try {
        const shelterId = req.user!.shelter_id

        const slot = await getAvailabilityByIdAndShelter(availabilityId, shelterId)
        if (!slot){
            res.status(404).render('error', { title: 'Error', message: 'Slot not found' })
            return
        }

        res.render('availability/edit', { 
            title: 'Edit Availability Slot', 
            user: req.user, 
            slot: slot,
            formData: { slot: new Date(slot.slot).toISOString() },
            errors: [],
            availability_id: availabilityId 
        })
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
}

export const postEditAvailability = async (req: AdminAuthRequest, res: Response) => {
    const availabilityId = parseInt(req.params['id'] as string)
    if (isNaN(availabilityId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid availability ID' })
        return
    }

    try {
        const shelterId = req.user!.shelter_id

        const slot = await getAvailabilityByIdAndShelter(availabilityId, shelterId)
        if (!slot){
            res.status(404).render('error', { title: 'Error', message: 'Slot not found' })
            return
        }

        const result = createAvailabilitySchema.safeParse(req.body)
        if (!result.success){
            res.status(400).render('availability/edit', { 
                title: 'Edit Availability Slot',
                user: req.user,
                errors: result.error.issues,
                formData: req.body
            })
            return
        }

        const updated = await updateAvailability(result.data.slot, availabilityId, shelterId )
        if (!updated) {
            res.status(400).render('error', {
                title: 'Cannot edit',
                message: 'This slot cannot be edited because it is already booked, or it no longer exists'
            })
            return
        }
        res.redirect('/admin/availability')
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong when editing slot' })
    }
}

export const postDeleteAvailability = async (req: AdminAuthRequest, res: Response) => {
    const availabilityId = parseInt(req.params['id'] as string)
    if (isNaN(availabilityId)) {
        res.status(400).render('error', { title: 'Error', message: 'Invalid availability ID' })
        return
    }

    try {
        const shelterId = req.user!.shelter_id

        const slot = await getAvailabilityByIdAndShelter(availabilityId, shelterId)
        if (!slot){
            res.status(404).render('error', { title: 'Error', message: 'Slot not found' })
            return
        }

        const rowCount = await deleteAvailability(availabilityId, shelterId)
        if (rowCount === 0) {
            res.status(400).render('error', {
                title: 'Cannot Delete',
                message: 'This slot cannot be deleted because it is already booked, or it no longer exists'
            })
            return
        }
        res.redirect('/admin/availability')
        
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong when deleting slot' })
    }
}