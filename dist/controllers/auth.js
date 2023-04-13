"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = void 0;
const user_1 = __importDefault(require("../models/user"));
const check_1 = require("express-validator/check");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorInitializer_1 = __importDefault(require("../helpers/errorInitializer"));
const tokenController_1 = __importDefault(require("../helpers/tokenController"));
const { parsed: ENV_VARIABLES } = dotenv_1.default.config();
const login = async (req, res, next) => {
    const errors = (0, check_1.validationResult)(req);
    try {
        if (!errors.isEmpty())
            throw (0, errorInitializer_1.default)("Validation failed!", 422, errors.array());
        const userDoc = await user_1.default.findOne({ email: req.body.email });
        if (!userDoc) {
            throw (0, errorInitializer_1.default)("User do not exist or error while connecting to the DB!", 500);
        }
        else {
            const passwordIsCorrect = await bcryptjs_1.default.compare(req.body.password, userDoc.password);
            if (!passwordIsCorrect) {
                throw (0, errorInitializer_1.default)("Password is incorrect!", 422);
            }
            else {
                const user = { userId: userDoc._id.toString() };
                const token = tokenController_1.default.generateToken(user);
                res.status(201).json({ token });
            }
        }
    }
    catch (error) {
        next((0, errorInitializer_1.default)(error));
    }
};
exports.login = login;
const signup = async (req, res, next) => {
    const { email, name, password } = req.body;
    const errors = (0, check_1.validationResult)(req);
    try {
        if (!errors.isEmpty())
            throw (0, errorInitializer_1.default)("Validation failed. " + errors.array()[0].msg, 422, errors.array());
        const hashedPw = await bcryptjs_1.default.hash(password, 12);
        const userDoc = new user_1.default({
            email,
            password: hashedPw,
            name,
        });
        const result = await userDoc.save();
        if (!result) {
            const error = new Error("Error while creating a user!");
            error.statusCode = 500;
            throw error;
        }
        res.status(201).json({ message: "User created!", userId: result._id });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.signup = signup;
