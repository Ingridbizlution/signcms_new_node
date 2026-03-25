import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { env } from "../config/env.js";

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const category = (req.body.type || "misc").toLowerCase();
    const dir = path.resolve(process.cwd(), env.UPLOAD_DIR, category);
    ensureDir(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});
