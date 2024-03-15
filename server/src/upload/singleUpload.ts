import { NextFunction, Request, Response } from "express";
import path from "path";
import sharp from "sharp";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { generateRandomUsername } from "../utils/generateRandomUsername";
import getConfig from "../utils/getConfig";
import { imageUploader, imageUploadPath } from ".";

export const uploadProfileImage = imageUploader.single("profile");

export async function resizeProfileImage(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  try {
    const file = req.file;
    if (!file) return next();

    const filename = `profile-${generateRandomUsername(8)}-${Date.now()}.jpeg`;
    const output = path.join(imageUploadPath, filename);

    await sharp(file.path)
      .resize(800, 800)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(output);

    if (getConfig("nodeEnv") === "development") {
      req.body.image = `${req.protocol}://${req.hostname}:${getConfig("port")}/img/upload/${filename}`;
    }
    if (getConfig("nodeEnv") === "production" || getConfig("nodeEnv") === "test") {
      req.body.image = `${req.protocol}://${req.hostname}/img/upload/${filename}`;
    }

    next();
  } catch (err: any) {
    const msg = err?.message || "internal server error";
    logging.error(msg);
    next(new AppError(500, msg));
  }
}
