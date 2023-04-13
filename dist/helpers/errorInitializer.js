"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorInitializer = (error, statusCode, errorData) => {
    const newError = typeof error === "string" ? new Error(error) : error;
    if (statusCode)
        newError.statusCode = statusCode;
    if (!newError.statusCode)
        newError.statusCode = 500;
    if (errorData)
        newError.data = errorData;
    return newError;
};
exports.default = errorInitializer;
