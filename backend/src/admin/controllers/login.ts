import type { Request, Response } from 'express'
import { getAdminByEmail } from '../../models/shelterAdmin.js'
import { loginSchema } from '../../types/authSchemas.js';
import bcrypt from 'bcrypt'

export const renderAdminLogin = async ( req: Request, res: Response): Promise<void> => {
    res.render('login', { 
        title: 'Shelter Login',
        error: null,
        layout: false
    })
}

export const adminSignin = async ( req: Request, res: Response): Promise<void> => {
    try {
        const result = loginSchema.safeParse(req.body)
            if (!result.success){
                res.render('login', { title: 'Shelter Login', error: 'Invalid request', layout: false })
                return
            }
            
            const {email, password} = result.data
        
            const admin = await getAdminByEmail(email)
            if (!admin) {
                res.render('login', { title: 'Shelter Login', error: 'Invalid details', layout: false })
                return
            }
    
            const valid = await bcrypt.compare(password, admin.password_hash)
            if (!valid) {
                res.render('login', { title: 'Shelter Login', error: 'Invalid details', layout: false })
                return
            }

            (req.session as any).adminId = admin.staff_id
            res.redirect('/admin/dashboard')
    
    } catch (error) {
        console.error(error)
        res.render('login', { title: 'Shelter Login', error: 'Something went wrong, please try again', layout: false })
    }
}

export const adminSignOut = ( req: Request, res: Response): void => {
    req.session.destroy(() => {
        res.redirect('/admin/login')
    })
}