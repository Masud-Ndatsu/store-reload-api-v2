import Joi from "joi";

export const CreateProductSchema = Joi.object({
     name: Joi.string().trim().required(),
     description: Joi.string().trim().required(),
     category: Joi.string().trim().required(),
     image: Joi.object().optional(),
     type: Joi.string().trim().required(),
     price: Joi.string().required(),
     tags: Joi.string().trim().required(),
     manufacturer: Joi.string().trim().required(),
     inventory: Joi.string().required(),
});

export const EditProductSchema = Joi.object({
     name: Joi.string().trim(),
     description: Joi.string().trim().optional(),
     category: Joi.string().trim().optional(),
     image: Joi.object().optional(),
     type: Joi.string().trim().optional(),
     price: Joi.string().optional(),
     tags: Joi.string().trim().optional(),
     manufacturer: Joi.string().trim().optional(),
     inventory: Joi.string().optional(),
});

export const SearchQuerySchema = Joi.object({
     q: Joi.string().trim().required(),
});

export const SearchParamSchema = Joi.object({
     id: Joi.string().trim().required(),
});
