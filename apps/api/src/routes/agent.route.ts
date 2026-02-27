import { Router } from "express";
import { agentStart, runAgentById, getAllAgentsRun } from "../controllers/agent.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const agentRouter = Router();

agentRouter.use(authMiddleware);

agentRouter.post("/run", agentStart);
agentRouter.get("/runs", getAllAgentsRun);
agentRouter.get("/runs/:id", runAgentById);

export default agentRouter;