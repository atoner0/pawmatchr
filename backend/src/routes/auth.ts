import { Router } from "express";
import { signup, signin } from "../controllers/adopterAuth.js";

const router = Router()

router.post('/adopter/signup', signup)
router.post('/adopter/signin', signin)

export default router