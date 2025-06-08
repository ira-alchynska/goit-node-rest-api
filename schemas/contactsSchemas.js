import Joi from "joi";

import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(1).required().messages({
        "string.empty": "Name is required",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email",
        "any.required": "Email is required",
    }),
    phone: Joi.string().pattern(/^\+?[0-9\s\-()]+$/).required().messages({
        "string.pattern.base": "Phone must be a valid phone number",
        "any.required": "Phone is required",
    }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(1).messages({
        "string.empty": "Name cannot be empty",
    }),
    email: Joi.string().email().messages({
        "string.email": "Email must be a valid email",
    }),
    phone: Joi.string().pattern(/^\+?[0-9\s\-()]+$/).messages({
        "string.pattern.base": "Phone must be a valid phone number",
    }),
}).min(1).messages({
    "object.min": "Body must have at least one field",
});