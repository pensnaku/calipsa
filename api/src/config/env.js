"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_root_path_1 = __importDefault(require("app-root-path"));
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("../helpers");
dotenv_1.default.config({ path: `${app_root_path_1.default.path}/.env` });
exports.NODE_ENV = helpers_1.ensureVariableExists(process.env.NODE_ENV, 'NODE ENVIRONMENT');
exports.APP_PORT = helpers_1.ensureVariableExists(process.env.APP_PORT, 'APP PORT');
exports.MONGO_URL = helpers_1.ensureVariableExists(process.env.MONGO_URL, 'MONGO URL');
exports.TOKEN_SECRET = helpers_1.ensureVariableExists(process.env.TOKEN_SECRET, 'SECRET TOKEN');
exports.DATABASE_URL = helpers_1.ensureVariableExists(process.env.DATABASE_URL, 'DATABASE URL');
