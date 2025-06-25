import { User } from '../db/sequelize.js';
import HttpError from '../helpers/HttpError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function findUserByEmail(email) {
    return await User.findOne({ where: { email } });
}

export async function createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({ email, password: hashedPassword });
}

export async function validatePassword(inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
}

export function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export async function findUserById(userId) {
    return await User.findByPk(userId);
}

export async function updateUserToken(userId, token) {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new HttpError(401, 'Not authorized');
    }
    user.token = token;
    await user.save();
    return user;
}