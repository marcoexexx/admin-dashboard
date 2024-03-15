import { Request } from "express";
import multer from "multer";
import { generateRandomUsername } from "../utils/generateRandomUsername";

export const imageUploadPath = `${__dirname}/../../public/upload`;
export const excelUploadPath = `${__dirname}/../../public/upload/excels`;

const imageStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, imageUploadPath);
  },
  filename(req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `${generateRandomUsername(8)}-${Date.now()}.${ext}`;

    req.body.image = fileName;
    req.body.images = [];

    cb(null, fileName);
  },
});

export const excelStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, excelUploadPath);
  },

  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

function imageFilter(_: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
  }

  cb(null, true);
}

function excelFilter(_: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
  }

  cb(null, true);
}

export const imageUploader = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
    // files: 1
  },
});

export const excelUploder = multer({
  storage: excelStorage,
  fileFilter: excelFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
