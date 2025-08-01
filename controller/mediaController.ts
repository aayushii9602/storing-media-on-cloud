// controller/uploadController.ts
import { Request, Response } from "express";
import { config } from "dotenv";
import s3 from "../utils/s3Client";
import cloudinary from "../utils/cloudinaryConfig";
config();

export async function uploadImageToS3(req: Request, res: Response) {
  //   console.log("in upload image to s3");

  const file = req.file as Express.MulterS3.File;

  //   console.log("file", file);
  if (!file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  try {
    // console.log("AWS_S3_BUCKET_NAME", process.env.AWS_S3_BUCKET_NAME);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const data = await s3.upload(params).promise();
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
}

export async function uploadImageToCloudinary(req: Request, res: Response) {
  //   console.log("in upload image to cloudinary");

  const file = req.file as Express.MulterS3.File;

  //   console.log("file", file);
  if (!file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error || !result) {
          console.error(error);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }

        res.status(200).json({
          message: "Image uploaded successfully",
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    );

    // Pipe the buffer into Cloudinary upload stream
    uploadStream.end(file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unexpected server error" });
  }
}
