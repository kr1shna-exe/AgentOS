import { Router } from "express";
import { googleAuth, googleCallback } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.get("/", googleAuth);
authRouter.get("/google/callback", googleCallback);

export default authRouter;