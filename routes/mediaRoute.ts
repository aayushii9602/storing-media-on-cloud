// routes/upload.ts
import express from "express";
import { upload } from "../middleware/mediaMiddleware"; // multer-s3 middleware
import { uploadImageToS3 } from "../controller/mediaController";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadImageToS3);

export default router;
