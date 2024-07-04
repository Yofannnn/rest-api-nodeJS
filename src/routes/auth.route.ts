import { Router } from "express";
import { registerUser, createSession, refreshSession, getDataUser } from "../controllers/users.controller";
import { authenticateUser } from "../middleware/auth";

export const AuthRouter: Router = Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", createSession);
AuthRouter.post("/refresh", refreshSession)

AuthRouter.get("/getDataUser", authenticateUser, getDataUser)
