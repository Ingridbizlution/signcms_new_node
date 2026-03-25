import { Router } from "express";
import * as organizationController from "../controllers/organization.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, organizationController.list);
router.post("/", requireAuth, requireAdmin, organizationController.create);
router.put("/:id", requireAuth, requireAdmin, organizationController.update);
router.delete("/:id", requireAuth, requireAdmin, organizationController.remove);

export default router;
