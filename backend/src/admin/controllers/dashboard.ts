import type { Response } from 'express'
import type { AuthRequest } from '../../middleware/auth.js'

export const renderDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        res.render('dashboard', { title: 'Dashboard', user: req.user })
    } catch {
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong' })
    }
}