import type { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {findAdminByEmail} from '../models/shelterAdmin.js'

const JWT_SECRET = process.env.JWT_SECRET ?? ''

export const adminSignin = async ( req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body

    try {
        const admin = await findAdminByEmail(email)
        if (!admin) {
            res.status(400).json({ message: 'Invalid details' })
            return
        }

        const valid = await bcrypt.compare(password, admin.password_hash)
        if (!valid) {
            res.status(400).json({ message: 'Invalid details' })
            return
        }

        const token = jwt.sign(
            { id: admin.staff_id, shelter_id: admin.shelter_id, type: 'shelter_admin'},
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        const { password_hash: _, ...safeAdmin } = admin
        res.status(200).json({ token, user: safeAdmin })
    } catch (error) {
        res.status(500).json({ message: 'Error during signin', error })
    }
}
