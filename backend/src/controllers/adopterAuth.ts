import type { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {findAdopterByEmail, createAdopter} from '../models/adopter.js'
import { signupSchema, signinSchema } from '../types/authSchemas.js';

const JWT_SECRET = process.env.JWT_SECRET ?? ''

export const signup = async ( req: Request, res: Response): Promise<void> => {
    const result = signupSchema.safeParse(req.body)
    if (!result.success){
        res.status(400).json({ message: 'Invalid request', errors: result.error.issues})
        return
    }
    const { first_name, last_name, email, password, phone } = result.data
    
    try {
        const existing = await findAdopterByEmail(email)
        if (existing) {
            res.status(400).json({ message: 'Email is already registered'})
            return
        }

        const password_hash = await bcrypt.hash(password, 10)
        const adopter = await createAdopter(first_name, last_name, email, password_hash, phone)

        const token = jwt.sign(
            { id: adopter.adopter_id, type: 'adopter '},
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        const { password_hash: _, ...safeAdopter } = adopter
        res.status(201).json({ token, user: safeAdopter })
    } catch (error) {
        res.status(500).json({ message: 'Error during signup', error})
    }
}

export const signin = async ( req: Request, res: Response): Promise<void> => {
    const result = signinSchema.safeParse(req.body)
    if (!result.success){
        res.status(400).json({ message: 'Invalid request', errors: result.error.issues})
        return
    }
    
    const {email, password} = result.data

    try {
        const adopter = await findAdopterByEmail(email)
        if (!adopter) {
            res.status(400).json({ message: 'Invalid details' })
            return
        }

        const valid = await bcrypt.compare(password, adopter.password_hash)
        if (!valid) {
            res.status(400).json({ message: 'Invalid details' })
            return
        }

        const token = jwt.sign(
            { id: adopter.adopter_id, type: 'adopter '},
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        const { password_hash: _, ...safeAdopter } = adopter
        res.status(200).json({ token, user: safeAdopter })
    } catch (error) {
        res.status(500).json({ message: 'Error during signin', error })
    }
}
