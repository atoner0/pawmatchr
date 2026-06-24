import jwt from 'jsonwebtoken'

export const createTestToken = (payload: object) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'test_secret')
}