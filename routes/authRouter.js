import express from 'express';
import { register, login, logout, currentUser, updateAvatar } from '../controllers/authController.js';
import validateBody from '../helpers/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', authMiddleware, logout);
router.get('/current', authMiddleware, currentUser);
router.patch('/avatars', authMiddleware, upload.single('avatar'), updateAvatar);

export default router;