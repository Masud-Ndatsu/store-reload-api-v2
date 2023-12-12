import Joi from "joi";

export const CreateUserSchema = Joi.object({
     shop_name: Joi.string().trim().required(),
     password: Joi.string().trim().min(8).required(),
     address: Joi.string().trim().required(),
     LGA: Joi.string().trim().required(),
});

export const LoginSchema = Joi.object({
     shop_name: Joi.string().trim().required(),
     password: Joi.string().trim().required(),
});

export const VerifyPasswordOTPSchema = Joi.object({
     code: Joi.string().required().trim(),
     email: Joi.string().required().trim(),
});

export const ResetPasswordSchema = Joi.object({
     email: Joi.string().required().trim(),
});

export const ChangePasswordSchema = Joi.object({
     email: Joi.string().trim().email().required(),
     password: Joi.string().trim().required(),
     confirm_password: Joi.string().trim().required(),
});
