import User from "../models/userModel.js";
import { ERRORS } from "../helpers/customErrors.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/;

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
    if (!emailRegex.test(email)) {
        throw ERRORS.INVALID_EMAIL_FORMAT;
    }
    console.log(password);
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

async function checkCurrentPassword(userId, password) {
    const user = await User.findById(userId);
    if (!user) {
        throw ERRORS.USER_NOT_FOUND;
    }
    const isCorrect = await user.comparePassword(password);
    return isCorrect;
}

async function changePassword(userId, password, passwordRepeat) {
    if (password !== passwordRepeat) {
        throw ERRORS.PASSWORDS_MISMATCH;
    }
    if (!passwordRegex.test(password)) {
        throw ERRORS.INVALID_PASSWORD_FORMAT;
    }
    const user = await User.findById(userId);
    user.password = password;
    await user.save();

    if (!user) {
        throw ERRORS.USER_NOT_FOUND;
    }
    return user;
}

export default {
    getAll,
    getById,
    create,
    checkCurrentPassword,
    changePassword,
};
