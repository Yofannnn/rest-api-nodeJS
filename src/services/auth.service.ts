import usersModel from "../models/users.model";
import { usersType } from "../types/users.types";

export const createUser = async (payload: usersType) => {
  return await usersModel.create(payload);
};

export const findUserByEmail = async (email: string) => {
  return await usersModel.findOne({ email });
};
