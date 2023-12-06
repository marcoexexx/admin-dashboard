"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeProductImages = exports.uploadProductImage = void 0;
const logging_1 = __importDefault(require("../middleware/logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
const sharp_1 = __importDefault(require("sharp"));
const generateRandomUsername_1 = require("../utils/generateRandomUsername");
const _1 = require(".");
const path_1 = __importDefault(require("path"));
const getConfig_1 = __importDefault(require("../utils/getConfig"));
// export const uploadProductImage = upload.fields([
//   { name: "image", maxCount: 1 },
//   { name: "images", maxCount: 3 },
// ])
exports.uploadProductImage = _1.upload.array("images", 3);
function resizeProductImages(req, _, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = req.files;
            logging_1.default.info("Process file resize");
            if (!files)
                return next();
            if (files) {
                req.body.images = [];
                yield Promise.all(files.map((file, idx) => {
                    const filename = `product-${(0, generateRandomUsername_1.generateRandomUsername)(8)}-${Date.now()}-${idx + 1}.jpeg`;
                    const output = path_1.default.join(_1.imageUploadPath, filename);
                    if ((0, getConfig_1.default)("nodeEnv") === "development")
                        req.body.images.push(`${req.protocol}://${req.hostname}:${(0, getConfig_1.default)('port')}/img/upload/${filename}`);
                    if ((0, getConfig_1.default)("nodeEnv") === "production" || (0, getConfig_1.default)("nodeEnv") === "test")
                        req.body.images.push(`${req.protocol}://${req.hostname}/img/upload/${filename}`);
                    return (0, sharp_1.default)(file.path)
                        .resize({
                        width: 300,
                        height: 400,
                        fit: "cover"
                    })
                        .toFormat("jpeg")
                        .jpeg({ quality: 90 })
                        .toFile(output);
                }));
            }
            next();
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.resizeProductImages = resizeProductImages;
