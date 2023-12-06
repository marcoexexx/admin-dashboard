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
exports.getGoogleUser = exports.getGoogleAuthToken = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const getConfig_1 = __importDefault(require("../utils/getConfig"));
const logging_1 = __importDefault(require("../middleware/logging/logging"));
function getGoogleAuthToken(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const rootUrl = "https://oauth2.googleapis.com/token";
        const { clientID, clientSecret, redirect } = (0, getConfig_1.default)("googleOAuth");
        const options = {
            code,
            client_id: clientID,
            client_secret: clientSecret,
            redirect_uri: redirect,
            grant_type: "authorization_code",
        };
        try {
            const { data } = yield axios_1.default.post(rootUrl, qs_1.default.stringify(options), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            return data;
        }
        catch (err) {
            logging_1.default.error(`Failed to fetch Google Oauth Tokens: ${err.message}`);
            throw new Error(err);
        }
    });
}
exports.getGoogleAuthToken = getGoogleAuthToken;
function getGoogleUser(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id_token, access_token } = args;
        try {
            const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
            const { data } = yield axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${id_token}`
                }
            });
            return data;
        }
        catch (err) {
            logging_1.default.error("Failed to fetch Google Oauth Tokens");
            throw new Error(err);
        }
    });
}
exports.getGoogleUser = getGoogleUser;
