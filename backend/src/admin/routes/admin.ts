import { Router } from 'express';
import { renderAdminLogin, adminSignin, adminSignOut } from '../controllers/login.js';
import { requireAdminWeb } from '../../middleware/adminWebAuth.js';
import { renderDashboard } from '../controllers/dashboard.js';
import dogRoutes from './dogs.js'
import applicationRoutes from './application.js'

const router = Router()

router.get('/login', renderAdminLogin)
router.post('/login', adminSignin)
router.get('/logout', adminSignOut)

router.get('/dashboard', requireAdminWeb, renderDashboard)

router.use('/dogs', requireAdminWeb, dogRoutes)
router.use('/applications', requireAdminWeb, applicationRoutes)

export default router