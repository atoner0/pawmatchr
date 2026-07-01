import { Router } from 'express';
import { createApplicationController, getApplicationById, getAllAdopterApplications,updateChecklist } from '../controllers/application.js';

const router = Router()

router.get('/', getAllAdopterApplications)
router.get('/:id', getApplicationById)

router.post('/', createApplicationController)
router.patch('/:id/checklist', updateChecklist)


export default router