import { Router } from 'express';
import { renderApplicationsDash, renderApplicationProfile, applicationToUnderReview, approveApplication, rejectApplication } from '../controllers/application.js';
const router = Router()

router.get('/', renderApplicationsDash)
router.get('/:id', renderApplicationProfile)

router.post('/:id/review', applicationToUnderReview)
router.post('/:id/approve', approveApplication)
router.post('/:id/reject', rejectApplication)

export default router