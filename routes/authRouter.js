import express from 'express';
import { register, login, logout, currentUser } from '../controllers/authController.js';
import validateBody from '../helpers/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import authMiddleware from '../helpers/authMiddleware.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', authMiddleware, logout);
router.get('/current', authMiddleware, currentUser);

export default router;