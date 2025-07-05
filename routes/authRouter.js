import express from 'express';
import { register, login, logout, currentUser, updateAvatar, verifyEmail } from '../controllers/authController.js';
import validateBody from '../helpers/validateBody.js';
import { registerSchema, loginSchema, emailSchema } from '../schemas/authSchemas.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';
import "dotenv/config";
const { BASE_URL, UKR_NET_EMAIL } = process.env;


const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', authMiddleware, logout);
router.get('/current', authMiddleware, currentUser);
router.patch('/avatars', authMiddleware, upload.single('avatar'), updateAvatar);
router.get(
    '/verify/:verificationToken',
    (req, res, next) => {
        console.log('🛎️  VERIFY HIT →', req.params.verificationToken);
        next();
    },
    verifyEmail
);
router.post(
    '/verify',
    validateBody(emailSchema),
    async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await findUserByEmail(email);

            if (!user) {
                throw new HttpError(404, 'User not found');
            }
            if (user.verify) {
                return res
                    .status(400)
                    .json({ message: 'Verification has already been passed' });
            }


            const verificationLink = `${BASE_URL}/api/auth/verify/${user.verificationToken}`;


            await sendEmail({
                from: UKR_NET_EMAIL,
                to: email,
                subject: 'Email Verification',
                html: `<p>Please verify your email by clicking on the following link:</p>
                 <a href="${verificationLink}">${verificationLink}</a>`,
            });

            res.status(200).json({ message: 'Verification email sent' });
        } catch (error) {
            next(error);
        }
    }
);

export default router;