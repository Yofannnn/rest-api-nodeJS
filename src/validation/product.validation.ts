import Joi from "joi";
import { productsType } from "../types/products.types";

export const createProductsValidation = (payload: productsType) => {
  const schema = Joi.object({
    product_id: Joi.string().required(),
    category: Joi.string().required(),
    title: Joi.string().required(),
    type: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    sizes: Joi.array()
      .items(
        Joi.object({
          size: Joi.number().required(),
          quantity: Joi.number().required(),
        })
      )
      .required(),
    recommendation: Joi.boolean().allow("", null),
  });
  return schema.validate(payload);
};

export const updateProductValidation = (payload: productsType) => {
  const schema = Joi.object({
    category: Joi.string().allow("", null),
    type: Joi.string().allow("", null),
    price: Joi.number().allow("", null),
    description: Joi.string().allow("", null),
    image: Joi.string().allow("", null),
    recommendation: Joi.boolean().allow("", null),
  });
  return schema.validate(payload);
};
