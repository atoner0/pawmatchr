import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import {getAdopterById} from '../models/adopter.js'
import {getAdminById, type SafeShelterAdmin} from '../models/shelterAdmin.js'
import type { SafeAdopter } from '../types/adopter.js'

const JWT_SECRET = process.env.JWT_SECRET ?? ''

export interface AdopterAuthRequest extends Request {
    user?: SafeAdopter
    userType?: 'adopter'
}

export interface AdminAuthRequest extends Request {
    user?: SafeShelterAdmin
    userType?: 'shelter_admin'
}

const extractToken = (req: Request): string | null => {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) return null
    return header.split(' ')[1] ?? null
}


export const requireAdopter = async (
    req: AdopterAuthRequest, res: Response, next: NextFunction
): Promise<void> => {
    const token = extractToken(req)
    if (!token) {
        res.status(401).json({ message: 'Authentication required' })
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; type: string }
        if (decoded.type !== 'adopter') {
            res.status(403).json({ message: 'Adopter access only' })
            return
        }

        const adopter = await getAdopterById(decoded.id)
        if (!adopter) {
            res.status(401).json({ message: 'User not found' })
            return
        }

        req.user = adopter
        req.userType = 'adopter'
        next()
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}

export const requireAdmin = async (
    req: AdminAuthRequest, res: Response, next: NextFunction
): Promise<void> => {
    const token = extractToken(req)
    if (!token) {
        res.status(401).json({ message: 'Authentication required' })
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; type: string }
        if (decoded.type !== 'shelter_admin') {
            res.status(403).json({ message: 'Admin access only' })
            return
        }

        const admin = await getAdminById(decoded.id)
        if (!admin) {
            res.status(401).json({ message: 'Admin not found' })
            return
        }

        req.user = admin
        req.userType = 'shelter_admin'
        next()
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}