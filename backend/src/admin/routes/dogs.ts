import { Router } from 'express';
import { renderAllDogsByShelter, renderShelterDogById, renderCreateDog, renderEditDog, postCreateDog, postDeleteDog, postUpdateDog } from '../controllers/dogs.js';

const router = Router()

router.get('/', renderAllDogsByShelter)
router.get('/new', renderCreateDog)
router.get('/:id', renderShelterDogById)
router.get('/:id/edit', renderEditDog)

router.post('/', postCreateDog)
router.post('/:id/edit', postUpdateDog)
router.post('/:id/delete', postDeleteDog)


export default router