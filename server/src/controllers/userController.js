import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { ERRORS } from "../helpers/customErrors.js";
async function getAll() {
    return await User.find();
}

async function getById(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw ERRORS.USER_NOT_FOUND;
    }
    return user;
}

async function create(username, email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw ERRORS.INVALID_EMAIL_FORMAT;
    }
    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/;
    if (!passwordRegex.test(password)) {
        throw ERRORS.INVALID_PASSWORD_FORMAT;
    }
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw ERRORS.USERNAME_ALREADY_EXISTS;
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw ERRORS.EMAIL_ALREADY_EXISTS;
    }

    return await User.create({ username, email, password });
}

export default {
    getAll,
    getById,
    create,
};
