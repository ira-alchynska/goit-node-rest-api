import HttpError from '../helpers/HttpError.js';
import {
    findUserByEmail,
    createUser,
    validatePassword,
    generateToken,
    findUserById,
    updateUserToken,
    updateUserAvatar,
    findUserByVerificationToken,
} from '../services/authServices.js';
import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from 'path';
import sendEmail from '../helpers/sendEmail.js';
import "dotenv/config";
import { v4 as uuidv4 } from 'uuid';
import "dotenv/config";
const { BASE_URL } = process.env;

const avatarsDir = path.join(process.cwd(), 'public', 'avatars');

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            throw new HttpError(409, 'Email in use');
        }

        const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
        const verificationToken = uuidv4();
        const newUser = await createUser(email, password, avatarURL, verificationToken);

        const verificationLink = `${BASE_URL}/api/auth/verify/${verificationToken}`;
        const emailOptions = {
            to: "alchynskairyna@gmail.com",
            subject: 'Email Verification',
            html: `<p>Please verify your email by clicking on the following link:</p>
                  <a href="${verificationLink}">${verificationLink}</a>`,
        };

        try {
            await sendEmail(emailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new HttpError(500, 'Failed to send verification email');
        }

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            },
            avatarURL: newUser.avatarURL,
            message: 'Verification email sent',
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            console.error(`Login failed: User with email ${email} not found.`);
            throw new HttpError(401, 'Email or password is wrong');
        }

        const isPasswordValid = await validatePassword(password, user.password);
        if (!isPasswordValid) {
            console.error(`Login failed: Password mismatch for email ${email}.`);
            throw new HttpError(401, 'Email or password is wrong');
        }

        const token = generateToken(user.id);
        await updateUserToken(user.id, token);

        res.status(200).json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        await updateUserToken(req.user.id, null);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const currentUser = async (req, res, next) => {
    try {
        const user = await findUserById(req.user.id);
        if (!user) {
            throw new HttpError(401, 'Not authorized');
        }

        res.status(200).json({
            email: user.email,
            subscription: user.subscription,
            avatarURL: user.avatarURL,
        });
    } catch (error) {
        next(error);
    }
};

export const updateAvatar = async (req, res, next) => {
    try {
        const { path: tempPath, originalname } = req.file;
        const { id: userId } = req.user;

        const uniqueFilename = `${userId}-${Date.now()}-${originalname}`;
        const finalPath = path.join(avatarsDir, uniqueFilename);

        await fs.rename(tempPath, finalPath);

        const avatarURL = `/avatars/${uniqueFilename}`;
        await updateUserAvatar(userId, avatarURL);

        res.status(200).json({ avatarURL });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await findUserByVerificationToken(verificationToken);

        if (!user) {
            throw new HttpError(404, 'User not found');
        }

        user.verificationToken = null;
        user.verify = true;
        await user.save();

        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        next(error);
    }
};