"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.imageUploadPath = void 0;
const multer_1 = __importDefault(require("multer"));
const generateRandomUsername_1 = require("../utils/generateRandomUsername");
exports.imageUploadPath = `${__dirname}/../../public/upload`;
const multerStorage = multer_1.default.diskStorage({
    destination(_req, _file, cb) {
        cb(null, exports.imageUploadPath);
    },
    filename(req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const fileName = `${(0, generateRandomUsername_1.generateRandomUsername)(8)}-${Date.now()}.${ext}`;
        req.body.image = fileName;
        req.body.images = [];
        cb(null, fileName);
    }
});
function multerFilter(_, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new multer_1.default.MulterError("LIMIT_UNEXPECTED_FILE"));
    }
    cb(null, true);
}
exports.upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
        // files: 1
    }
});
