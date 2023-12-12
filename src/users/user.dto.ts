import Joi from "joi";

export const UpdateUserSchema = Joi.object({
     first_name: Joi.string().trim().required(),
     last_name: Joi.string().trim().required(),
     phone_number: Joi.string().trim().required(),
     email: Joi.string().trim().email().required(),
     gender: Joi.string().trim().required(),
     NIN: Joi.string().trim().required(),
});

export const VerifyUserSchema = Joi.object({
     auth_code: Joi.string().trim().required(),
});
