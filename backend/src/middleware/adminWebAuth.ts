import type { Response, NextFunction } from 'express'
import type { AdminAuthRequest } from './auth.js'
import {getAdminById} from '../models/shelterAdmin.js'

export const requireAdminWeb = async (req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const adminId = (req.session as any)?.adminId

    if (!adminId){
        res.redirect('/admin/login')
        return
    }

    const admin = await getAdminById(adminId)
    if (!admin){
        res.redirect('/admin/login')
        return
    }

    req.user = admin
    req.userType = 'shelter_admin'
    next()
}
