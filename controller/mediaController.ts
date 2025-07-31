// controller/uploadController.ts
import { Request, Response } from "express";
import { config } from "dotenv";
import s3 from "../utils/s3Client";
config();

export const uploadImageToS3 = async (req: Request, res: Response) => {
  console.log("in upload image");

  const file = req.file as Express.MulterS3.File;

  console.log("file", file);
  if (!file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  try {
    console.log("AWS_S3_BUCKET_NAME", process.env.AWS_S3_BUCKET_NAME);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const data = await s3.upload(params).promise();
    await s3.upload(params).promise();
    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: data.Key,
      Expires: 60 * 5,
    });
    const imageData = {
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: data.Location,
      bucket: data.Bucket,
      key: data.Key,
      etag: data.ETag,
      signedUrl: signedUrl,
    };
    res.status(200).json({
      message: "Image uploaded successfully",
      image: imageData,
    });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).send("Error uploading file to S3");
  }
};
