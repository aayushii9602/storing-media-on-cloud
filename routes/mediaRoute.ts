// routes/upload.ts
import express from "express";
import { upload } from "../middleware/mediaMiddleware"; // multer-s3 middleware
import {
  uploadImageToS3,
  uploadImageToCloudinary,
} from "../controller/mediaController";

const router = express.Router();

router.post("/uploadaws", upload.single("file"), uploadImageToS3);
router.post(
  "/uploadcloudinary",
  upload.single("file"),
  uploadImageToCloudinary
);

export default router;
