import { Router } from 'express';
import { renderAllDogsByShelter, renderShelterDogById, renderCreateDog, renderEditDog, postCreateDog, postDeleteDog, postUpdateDog } from '../controllers/dogs.js';

const router = Router()

router.get('/dogs', renderAllDogsByShelter)
router.get('/dogs/new', renderCreateDog)
router.get('/dogs/:id', renderShelterDogById)
router.get('/dogs/:id/edit', renderEditDog)

router.post('/dogs', postCreateDog)
router.post('/dogs/:id/edit', postUpdateDog)
router.post('/dogs/:id/delete', postDeleteDog)


export default router