import { Router } from 'express';
import { getAdminLogin, adminSignin, adminSignOut } from '../controllers/login.js';
import { requireAdminWeb } from '../../middleware/adminWebAuth.js';
import { renderDashboard } from '../controllers/dashboard.js';

const router = Router()

router.get('/login', getAdminLogin)
router.post('/login', adminSignin)
router.get('/logout', adminSignOut)

router.get('/dashboard', requireAdminWeb, renderDashboard)

export default router