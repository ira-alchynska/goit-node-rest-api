import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../db/sequelize.js';
import HttpError from '../helpers/HttpError.js';

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if email is already in use
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw HttpError(409, 'Email in use');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({ email, password: hashedPassword });

        // Respond with the created user
        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw HttpError(401, 'Email or password is wrong');
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw HttpError(401, 'Email or password is wrong');
        }

        // Generate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.token = token;
        await user.save();

        // Respond with token and user info
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
        const user = await User.findByPk(req.user.id);
        if (!user) {
            throw HttpError(401, 'Not authorized');
        }

        user.token = null;
        await user.save();

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const currentUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            throw HttpError(401, 'Not authorized');
        }

        res.status(200).json({
            email: user.email,
            subscription: user.subscription,
        });
    } catch (error) {
        next(error);
    }
};