import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/auth.service";
import {
  createUserValidation,
  createSessionValidation,
  refreshSessionValidation,
} from "../validation/user.validation";
import { hashPassword, comparePassword } from "../utils/hash";
import { signJWT, verifyJWT } from "../utils/jwt";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async (req: Request, res: Response) => {
  req.body.user_id = uuidv4();
  const { error, value } = createUserValidation(req.body);
  if (error) {
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: error.details[0].message,
    });
  }
  try {
    value.password = `${hashPassword(value.password)}`;
    const result = await createUser(value);
    if (!result) {
      throw new Error("Failed to create new account");
    }
    return res.status(201).send({
      status: true,
      statusCode: 201,
      message: "Success to create new account",
    });
  } catch (err: any) {
    return res
      .status(422)
      .send({ status: false, statusCode: 422, message: err.message });
  }
};

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body);
  if (error) {
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }
  try {
    const user: any = await findUserByEmail(value.email);
    if (!user) {
      throw new Error("Email not found");
    }
    const isValid = comparePassword(value.password, user.password);
    if (!isValid) {
      throw new Error("Password incorrect");
    }
    const accessToken = signJWT({ ...user }, { expiresIn: "1d" });
    const refreshToken = signJWT({ ...user }, { expiresIn: "1y" });
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Login success",
      data: { accessToken, refreshToken },
    });
  } catch (err: any) {
    return res.status(404).send({
      status: false,
      statusCode: 404,
      message: err.message,
    });
  }
};

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidation(req.body);
  if (error) {
    return res.status(422).send({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }
  try {
    const { decoded }: any = verifyJWT(value.refreshToken);
    const user = await findUserByEmail(decoded._doc.email);
    if (!user) throw new Error("User not found");
    const accessToken = signJWT({ ...user }, { expiresIn: "1d" });
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Refresh session success",
      data: { accessToken },
    });
  } catch (err: any) {
    return res.status(404).send({
      status: false,
      statusCode: 404,
      message: err.message,
    });
  }
};
