"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomUsername = void 0;
function generateRandomUsername(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Define the character set for the username
    let result = '@';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
exports.generateRandomUsername = generateRandomUsername;
