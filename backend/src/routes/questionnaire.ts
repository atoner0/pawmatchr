import { Router } from 'express';
import { getQuestionnaire, fillQuestionnaireController, updateQuestionnaireController } from '../controllers/adopter.js';

const router = Router()

router.get('/', getQuestionnaire)
router.put('/', fillQuestionnaireController)
router.patch('/', updateQuestionnaireController)

export default router