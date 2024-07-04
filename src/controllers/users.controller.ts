import { Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  findUserByID,
} from "../services/auth.service";
import {
  createUserValidation,
  createSessionValidation,
  refreshSessionValidation,
} from "../validation/user.validation";
import { hashPassword, comparePassword } from "../utils/hash";
import { signJWT, verifyJWT } from "../utils/jwt";
import { v4 as uuidv4 } from "uuid";
import { hasOnlySpaces } from "../utils/validation-input";

export const registerUser = async (req: Request, res: Response) => {
  req.body.user_id = uuidv4();
  const { error, value } = createUserValidation(req.body);
  const handleValidationError = (res: Response, message: string) => {
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message,
    });
  };
  if (error) {
    return handleValidationError(res, error.details[0].message);
  }
  const { firstname, lastname, telp, email, password } = value;
  if (hasOnlySpaces([firstname, lastname, telp, email, password])) {
    return handleValidationError(res, "Input cannot be only spaces");
  }
  try {
    value.password = `${hashPassword(value.password)}`;
    const existingUser = await findUserByEmail(value.email);
    if (existingUser) {
      throw new Error("Email is already exist");
    }
    const result = await createUser(value);
    if (!result) {
      throw new Error("Failed to create new account");
    }
    const accessToken = signJWT({ userId: result._id }, { expiresIn: "1d" });
    const refreshToken = signJWT({ userId: result._id }, { expiresIn: "1d" });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
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
    const accessToken = signJWT({ userId: user._id }, { expiresIn: "1d" });
    const refreshToken = signJWT({ userId: user._id }, { expiresIn: "1d" });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Login success",
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
    const accessToken = signJWT({ userId: user._id }, { expiresIn: "1d" });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Refresh session successfully updated",
    });
  } catch (err: any) {
    return res.status(404).send({
      status: false,
      statusCode: 404,
      message: err.message,
    });
  }
};

export const getDataUser = async (req: Request, res: Response) => {
  const reqUserID = req.userId;
  if (!reqUserID) throw new Error("Unauthorized");
  try {
    const user = await findUserByID(reqUserID);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send({ message: "User profile", user });
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};
