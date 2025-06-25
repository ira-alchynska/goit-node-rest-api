import HttpError from '../helpers/HttpError.js';
import {
    findUserByEmail,
    createUser,
    validatePassword,
    generateToken,
    findUserById,
    updateUserToken,
} from '../services/authServices.js';

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            throw new HttpError(409, 'Email in use');
        }

        const newUser = await createUser(email, password);

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

        const user = await findUserByEmail(email);
        if (!user) {
            throw new HttpError(401, 'Email or password is wrong');
        }

        const isPasswordValid = await validatePassword(password, user.password);
        if (!isPasswordValid) {
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
        });
    } catch (error) {
        next(error);
    }
};