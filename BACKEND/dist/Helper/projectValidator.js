"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectUserSchema2 = exports.projectUserSchema = exports.taskValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.taskValidator = joi_1.default.object({
    projectName: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    endDate: joi_1.default.date(),
    userId: joi_1.default.number()
});
exports.projectUserSchema = joi_1.default.object({
    projectId: joi_1.default.number().required(),
    userId: joi_1.default.number().required()
});
exports.projectUserSchema2 = joi_1.default.object({
    projectId: joi_1.default.number().required()
});
