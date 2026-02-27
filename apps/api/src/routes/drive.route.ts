import { Router } from "express";
import { syncDrive, syncedDriveFiles } from "../controllers/drive.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const driveRouter = Router();

driveRouter.use(authMiddleware);

driveRouter.post("/sync", syncDrive);
driveRouter.get("/files", syncedDriveFiles);

export default driveRouter;