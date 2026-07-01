import { Router } from 'express';
import { createApplicationController, getApplicationById, getAllAdopterApplications,updateChecklist, withdrawApplication } from '../controllers/application.js';

const router = Router()

router.get('/', getAllAdopterApplications)
router.get('/:id', getApplicationById)

router.post('/', createApplicationController)
router.patch('/:id/checklist', updateChecklist)
router.patch('/:id/withdraw', withdrawApplication)


export default router