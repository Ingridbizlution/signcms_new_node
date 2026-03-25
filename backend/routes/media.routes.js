import { Router } from "express";
import * as mediaController from "../controllers/media.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.get("/", requireAuth, mediaController.list);
router.post("/upload", requireAuth, requireAdmin, upload.single("file"), mediaController.upload);
router.delete("/:id", requireAuth, requireAdmin, mediaController.remove);

export default router;
