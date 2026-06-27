import session from 'express-session';

export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET ?? 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8
    }
})