import { Router } from 'express';
import { createApplicationController, getApplicationById, getAllAdopterApplications,updateChecklist } from '../controllers/application.js';
import { requireAdopter } from '../middleware/auth.js';

const router = Router()

router.get('/adopter/applications', requireAdopter, getAllAdopterApplications)
router.get('/adopter/applications/:id', requireAdopter, getApplicationById)

router.post('/adopter/applications', requireAdopter, createApplicationController)
router.patch('/adopter/applications/:id/checklist', requireAdopter, updateChecklist)


export default router