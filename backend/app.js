import express from "express";
import cors from "cors";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import activityLogRoutes from "./routes/activity-log.routes.js";
import { swaggerDocument } from "./swagger.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: false }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "signcms-node-backend" });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/backend/uploads", express.static(path.resolve(process.cwd(), "backend/uploads")));

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/organizations", organizationRoutes);
  app.use("/api/v1/media-items", mediaRoutes);
  app.use("/api/v1/activity-logs", activityLogRoutes);

  app.use(errorHandler);

  return app;
}
