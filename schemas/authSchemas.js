import Joi from "joi";
import emailRegex from "../constants/emailRegex.js";

export const registerSchema = Joi.object({
    email: Joi.string()
        .pattern(emailRegex)
        .email()
        .required()
        .messages({
            "string.pattern.base": "Email must be a valid email address",
            "string.email": "Invalid email format",
            "any.required": "Email is required",
        }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .pattern(emailRegex)
        .email()
        .required()
        .messages({
            "string.pattern.base": "Email must be a valid email address",
            "string.email": "Invalid email format",
            "any.required": "Email is required",
        }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});