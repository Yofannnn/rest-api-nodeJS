import jwt from "jsonwebtoken";
import CONFIG from "../config/environment";

export const signJWT = (
  payload: Object,
  option?: jwt.SignOptions | undefined
) => {
  return jwt.sign(payload, CONFIG.jwt_private, {
    ...(option && option),
    algorithm: "RS256",
  });
};

export const verifyJWT = (token: string) => {
  try {
    const decode = jwt.verify(token, CONFIG.jwt_public);
    return {
      valid: true,
      expired: false,
      decode,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message === "jwt is expired or not eligible to use",
      decode: null,
    };
  }
};
