import type { Response, NextFunction } from 'express'
import type { AuthRequest } from './auth.js'
import {findAdminById} from '../models/shelterAdmin.js'

export const requireAdminWeb = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const adminId = (req.session as any)?.adminId

    if (!adminId){
        res.redirect('/admin/login')
        return
    }

    const admin = await findAdminById(adminId)
    if (!admin){
        res.redirect('/admin/login')
        return
    }

    req.user = admin
    req.userType = 'shelter_admin'
    next()
}
