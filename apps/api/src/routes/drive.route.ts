import { Router } from "express";
import { syncDrive, syncedDriveFiles } from "src/controllers/drive.controller";

const driveRouter = Router();

driveRouter.post("/sync", syncDrive);
driveRouter.get("/files", syncedDriveFiles);

export default driveRouter;