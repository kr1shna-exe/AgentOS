import { Router } from "express";
import { agentStart, runAgentById, getAllAgentsRun } from "src/controllers/agent.controller";

const agentRouter = Router();

agentRouter.post("/run", agentStart);
agentRouter.get("/runs", runAgentById);
agentRouter.get("/runs/:id", getAllAgentsRun);

export default agentRouter;