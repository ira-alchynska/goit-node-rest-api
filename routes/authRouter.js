import express from 'express';
import { register, login, logout, currentUser, updateAvatar, verifyEmail } from '../controllers/authController.js';
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
router.get('/verify/:verificationToken', verifyEmail);
router.post('/verify', async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'missing required field email' });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        if (user.verify) {
            return res.status(400).json({ message: 'Verification has already been passed' });
        }

        const verificationLink = `${req.protocol}://${req.get('host')}/auth/verify/${user.verificationToken}`;
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking on the following link: ${verificationLink}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
        next(error);
    }
});

export default router;