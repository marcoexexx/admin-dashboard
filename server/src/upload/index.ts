import { Request } from 'express'
import multer from "multer";
import { generateRandomUsername } from '../utils/generateRandomUsername';


export const imageUploadPath = `${__dirname}/../../public/upload`

const multerStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, imageUploadPath)
  },
  filename(req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `${generateRandomUsername(8)}-${Date.now()}.${ext}`

    req.body.image = fileName
    req.body.images = []

    cb(null, fileName)
  }
})

function multerFilter(_: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"))
  }

  cb(null, true)
}

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
    // files: 1
  }
})

