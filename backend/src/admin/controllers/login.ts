import type { Request, Response } from 'express'
import { findAdminByEmail } from '../../models/shelterAdmin.js'
import { signinSchema } from '../../types/authSchemas.js';
import bcrypt from 'bcrypt'

export const getAdminLogin = async ( req: Request, res: Response): Promise<void> => {
    res.render('login', { 
        title: 'Shelter Login',
        error: null,
        layout: false
    })
}

export const adminSignin = async ( req: Request, res: Response): Promise<void> => {
    try {
        const result = signinSchema.safeParse(req.body)
            if (!result.success){
                res.render('login', { error: 'Invalid request' })
                return
            }
            
            const {email, password} = result.data
        
            const admin = await findAdminByEmail(email)
            if (!admin) {
                res.render('login', { error: 'Invalid details' })
                return
            }
    
            const valid = await bcrypt.compare(password, admin.password_hash)
            if (!valid) {
                res.render('login', { error: 'Invalid details' })
                return
            }

            (req.session as any).adminId = admin.staff_id
            res.redirect('/admin/dashboard')
    
    } catch {
        res.render('login', { error: 'Something went wrong, please try again' })
    }
}

export const adminSignOut = ( req: Request, res: Response): void => {
    req.session.destroy(() => {
        res.redirect('/admin/login')
    })
}