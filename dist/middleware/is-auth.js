"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const errorInitializer_1 = __importDefault(require("../helpers/errorInitializer"));
const tokenController_1 = __importDefault(require("../helpers/tokenController"));
const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader)
            throw (0, errorInitializer_1.default)("Not authenticated!", 401);
        const token = authHeader.split(" ")[1];
        const decodedToken = tokenController_1.default.verifyToken(token);
        if (!decodedToken)
            throw (0, errorInitializer_1.default)("Not authenticated!", 401);
        req.userId = decodedToken.userId;
        next();
    }
    catch (error) {
        next((0, errorInitializer_1.default)(error));
    }
};
exports.isAuth = isAuth;
