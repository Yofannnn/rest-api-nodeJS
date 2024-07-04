import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  if (!user) {
    return res.sendStatus(403);
  }
  return next();
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  if (!user || user._doc.role !== "admin") {
    return res.sendStatus(403);
  }
  return next();
};

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyJWT(token).decode as DecodedToken;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
