import { User } from '../db/sequelize.js';
import HttpError from '../helpers/HttpError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

export async function findUserByEmail(email) {
    return await User.findOne({ where: { email } });
}

export async function createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed password for email ${email}: ${hashedPassword}`);

    const avatarFilename = `${uuidv4()}.jpg`;
    const avatarURL = path.join('/avatars', avatarFilename);

    try {

        const defaultAvatarPath = path.join(process.cwd(), 'public', 'avatars', 'default.jpg');
        const newAvatarPath = path.join(process.cwd(), 'public', 'avatars', avatarFilename);
        await fs.copyFile(defaultAvatarPath, newAvatarPath);
        console.log(`Default avatar copied to: ${newAvatarPath}`);
    } catch (error) {
        console.error('Error copying default avatar:', error);
        throw new HttpError(500, 'Failed to create default avatar');
    }

    return await User.create({ email, password: hashedPassword, avatarURL });
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

export async function updateUserAvatar(userId, avatarURL) {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new HttpError(401, 'Not authorized');
    }
    user.avatarURL = avatarURL;
    await user.save();
    return user;
}