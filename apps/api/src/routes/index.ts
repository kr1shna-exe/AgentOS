import { Router } from "express";
import authRouter from "./auth.route";
import agentRouter from "./agent.route";
import driveRouter from "./drive.route";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/agent", agentRouter);
mainRouter.use("/drive", driveRouter);

export default mainRouter;