"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userHelpers = __importStar(require("../../helpers/user"));
const authMiddleware = __importStar(require("../../middleware/auth"));
const joi_1 = __importDefault(require("joi"));
const logger_1 = require("../../util/logger");
const constants_1 = require("../../config/constants");
async function loginHandler(req, res) {
    const { username, password } = req.body;
    const schema = joi_1.default.object().keys({
        username: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    });
    const validation = joi_1.default.validate(req.body, schema);
    if (validation.error) {
        return res.status(400).json({
            success: false,
            error: validation.error.details[0].message,
        });
    }
    try {
        const { success, user, error, code, } = await userHelpers.validateUserPassword({
            username,
            password,
        });
        if (!success) {
            return res.status(code).json({
                success,
                error,
            });
        }
        const token = authMiddleware.generateBearerToken({
            username: user.username,
        });
        return res.json({
            success,
            message: 'Login Successful',
            data: { user, token },
        });
    }
    catch (error) {
        logger_1.logger.error(error.stack);
        return res
            .status(500)
            .json({ success: false, error: constants_1.ERRORS.INTERNAL_SERVER_ERROR });
    }
}
exports.loginHandler = loginHandler;
async function registerationHandler(req, res) {
    const { username, password, confirmPassword } = req.body;
    const schema = joi_1.default.object()
        .keys({
        username: joi_1.default.string().min(5).required(),
        password: joi_1.default.string().required(),
        confirmPassword: joi_1.default.string()
            .valid(joi_1.default.ref('password'))
            .required()
            .options({ language: { any: { allowOnly: 'must match password' } } }),
    })
        .with('password', ['confirmPassword']);
    const validation = joi_1.default.validate(req.body, schema);
    if (validation.error) {
        return res.status(400).json({
            success: false,
            error: validation.error.details[0].message,
        });
    }
    try {
        const { success, user, error, code } = await userHelpers.registerUser({
            username,
            password,
        });
        if (!success) {
            return res.status(code).json({
                success,
                error,
            });
        }
        const token = authMiddleware.generateBearerToken({
            username: user.username,
        });
        return res.json({
            success,
            message: 'Registration Successful',
            data: { user, token },
        });
    }
    catch (error) {
        logger_1.logger.error(error.stack);
        return res
            .status(500)
            .json({ success: false, error: constants_1.ERRORS.INTERNAL_SERVER_ERROR });
    }
}
exports.registerationHandler = registerationHandler;
