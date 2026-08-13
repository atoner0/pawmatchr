import type { Response } from 'express'
import type { AdminAuthRequest } from '../../middleware/auth.js'
import { getDashboardStats, getDogsWithNoApplications } from '../../models/dog.js'
import { getRecentAppsByShelter } from '../../models/application.js'
import { getUpcomingBookingsByShelter } from '../../models/booking.js'

export const renderDashboard = async (req: AdminAuthRequest, res: Response) => {
    try {
        const shelterId = req.user!.shelter_id

        const stats = await getDashboardStats(shelterId)
        const recentApplications = await getRecentAppsByShelter(shelterId)
        const upcomingVisits = await getUpcomingBookingsByShelter(shelterId)
        const noApplicationDogs = await getDogsWithNoApplications(shelterId)

        res.render('dashboard', {
            title: 'Dashboard',
            user: req.user,
            stats,
            recentApplications,
            upcomingVisits,
            noApplicationDogs
        })
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
}