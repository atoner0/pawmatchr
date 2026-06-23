import { Router } from "express";
import { signup, signin } from "../controllers/adopterAuth.js";
import { adminSignin } from "../controllers/adminAuth.js";

const router = Router()

router.post('/adopter/signup', signup)
router.post('/adopter/signin', signin)
router.post('admin/signin', adminSignin)

export default router