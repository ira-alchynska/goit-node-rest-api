import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../db/sequelize.js';
import HttpError from '../helpers/HttpError.js';
import { Contact } from '../db/sequelize.js';
import { signToken } from '../helpers/jwt.js';

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw HttpError(409, 'Email in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, password: hashedPassword });

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

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw HttpError(401, 'Email or password is wrong');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw HttpError(401, 'Email or password is wrong');
        }

        const token = signToken({ id: user.id });
        user.token = token;
        await user.save();

        const contacts = await Contact.findAll({ where: { owner: user.id } });

        res.status(200).json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
                contacts,
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

        const contacts = await Contact.findAll({ where: { owner: user.id } });

        res.status(200).json({
            email: user.email,
            subscription: user.subscription,
            contacts,
        });
    } catch (error) {
        next(error);
    }
};