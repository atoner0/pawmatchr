import { Router } from 'express';
import { renderAvailability, renderCreateAvailability, renderEditAvailability, postCreateAvailability, postEditAvailability, postDeleteAvailability } from '../controllers/availability.js';
const router = Router()

router.get('/', renderAvailability)
router.get('/new', renderCreateAvailability)
router.get('/:id/edit', renderEditAvailability)

router.post('/', postCreateAvailability)
router.post('/:id/edit', postEditAvailability)
router.post('/:id/delete', postDeleteAvailability)

export default router