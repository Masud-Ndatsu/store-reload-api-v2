import Joi from "joi";

export const CreateCategorySchema = Joi.object({
     name: Joi.string().trim().required(),
     product_type: Joi.string().trim().required(),
});

export const EditCategorySchema = Joi.object({
     name: Joi.string().trim().optional(),
     product_type: Joi.string().trim().optional(),
});

export const SearchParamSchema = Joi.object({
     id: Joi.string().trim().required(),
});
