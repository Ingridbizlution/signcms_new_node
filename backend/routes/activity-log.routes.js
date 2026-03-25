import { Router } from "express";
import * as activityLogController from "../controllers/activity-log.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/", requireAuth, activityLogController.create);

export default router;
