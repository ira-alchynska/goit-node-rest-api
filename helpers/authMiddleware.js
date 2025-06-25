import jwt from 'jsonwebtoken';
import { User } from '../db/sequelize.js';
import HttpError from './HttpError.js';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw HttpError(401, 'Not authorized');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw HttpError(401, 'Not authorized');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user || user.token !== token) {
            throw HttpError(401, 'Not authorized');
        }

        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401, 'Not authorized'));
    }
};

export default authMiddleware;