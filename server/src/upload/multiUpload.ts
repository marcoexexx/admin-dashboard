import { NextFunction, Request, Response } from 'express'
import logging from '../middleware/logging/logging';
import AppError from '../utils/appError';
import sharp from 'sharp';
import { generateRandomUsername } from '../utils/generateRandomUsername';
import { imageUploadPath, upload } from '.';
import path from 'path';
import getConfig from '../utils/getConfig';


// export const uploadProductImage = upload.fields([
//   { name: "image", maxCount: 1 },
//   { name: "images", maxCount: 3 },
// ])

export const uploadProductImage = upload.array("images", 3)

export async function resizeProductImages(
  req: Request,
  _: Response,
  next: NextFunction
) {
  try {
    const files = req.files;

    logging.info("Process file resize")
    if (!files) return next()

    if (files) {
      req.body.images = []
      await Promise.all(
        (files as Express.Multer.File[]).map((file, idx) => {
          const filename = `product-${generateRandomUsername(8)}-${Date.now()}-${idx+1}.jpeg`
          const output = path.join(imageUploadPath, filename);

          if (getConfig("nodeEnv") === "development") req.body.images.push(`${req.protocol}://${req.hostname}:${getConfig('port')}/img/upload/${filename}`)
          if (getConfig("nodeEnv") === "production" || getConfig("nodeEnv") === "test") req.body.images.push(`${req.protocol}://${req.hostname}/img/upload/${filename}`)

          return sharp(file.path)
            .resize({
              width: 300,
              height: 400,
              fit: "cover"
            })
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(output)
        })
      )
    }

    next()
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
