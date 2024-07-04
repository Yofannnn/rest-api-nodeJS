import Joi from "joi";
import { usersType } from "../types/users.types";

export const createUserValidation = (payload: usersType) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().allow("", null),
    birthday: Joi.string().allow("", null),
    gender: Joi.string().allow("", null),
    telp: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().allow("", null),
  });
  return schema.validate(payload);
};

export const createSessionValidation = (payload: usersType) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(payload);
};

export const refreshSessionValidation = (payload: usersType) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  });
  return schema.validate(payload);
};
