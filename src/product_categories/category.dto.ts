import Joi from "joi";

export const CreateCategorySchema = Joi.object({
     name: Joi.string().trim().required(),
     product_type: Joi.string().trim().required(),
});
