import { Router } from 'express';
import { createApplicationController, getApplicationById, getAllAdopterApplications, getApplicationsForShelter, updateAppStatus, updateChecklist } from '../controllers/application.js';
import { requireAuth, requireAdopter, requireAdmin } from '../middleware/auth.js';

const router = Router()

router.get('/adopter/applications', requireAdopter, getAllAdopterApplications)
router.get('/admin/applications/shelter', requireAdmin, getApplicationsForShelter)
router.get('/adopter/applications/:id', requireAuth, getApplicationById)

router.post('/adopter/applications', requireAdopter, createApplicationController)
router.patch('/adopter/applications/:id/status', requireAdmin, updateAppStatus)
router.patch('/adopter/applications/:id/checklist', requireAdopter, updateChecklist)


export default router