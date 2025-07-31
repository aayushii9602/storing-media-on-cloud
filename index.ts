import express, { NextFunction, Request, Response } from "express";
import mediaRoutes from "./routes/mediaRoute";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("", mediaRoutes);

app.use(
  (
    error: Error | multer.MulterError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (error instanceof multer.MulterError) {
      res.status(400).send("Multer error: " + error.message);
    } else if (error) {
      res.status(400).send("Error: " + error.message);
    } else {
      next();
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
