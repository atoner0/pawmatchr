import { Router } from 'express';
import { getQuestionnaire, fillQuestionnaireController, updateQuestionnaireController } from '../controllers/adopter.js';
import { requireAdopter } from '../middleware/auth.js';

const router = Router()

router.get('/adopter/questionnaire', requireAdopter, getQuestionnaire)
router.put('/adopter/questionnaire', requireAdopter, fillQuestionnaireController)
router.patch('/adopter/questionnaire', requireAdopter, updateQuestionnaireController)

export default router