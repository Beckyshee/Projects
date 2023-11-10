"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeProjects = exports.pendingProjects = exports.checkUserRole = exports.homePage = exports.projectAssign = exports.projectDelete = exports.createProject = void 0;
const mssql_1 = __importStar(require("mssql"));
const config_1 = require("../Config/config");
const projectValidator_1 = require("../Helper/projectValidator");
/**
 *
 * @param req - Request as customProject
 * @param res - Request as Response
 * @returns
 */
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectName, description, endDate, userId } = req.body;
        const { error, value } = projectValidator_1.taskValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        if (pool.connected) {
            console.info("db connected");
        }
        yield pool.request()
            .input('projectName', mssql_1.default.VarChar, projectName)
            .input('description', mssql_1.default.VarChar, description)
            .input('deadline', mssql_1.default.VarChar, endDate)
            .input('userId', mssql_1.default.VarChar, userId)
            .execute('createTask');
        return res.json({ message: "Project created successfully..." });
    }
    catch (error) {
        if (error instanceof mssql_1.RequestError)
            return res.status(404).json({
                message: 'Project Exists.'
            });
        return res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
});
exports.createProject = createProject;
//=========DELETING PROJECTS ===============//
/**
 *
 * @param req as customproject
 * @param res as response
 * @returns deletes projects.
 */
const projectDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.body;
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        yield pool.request()
            .input('projectId', mssql_1.default.VarChar, projectId)
            .execute('deleteProject');
        return res.json({ message: `PROJECT ${projectId} deleted` });
    }
    catch (error) {
        console.log(error);
        if (error instanceof mssql_1.RequestError) {
            return res.status(404).json({
                message: "No Task With That ID."
            });
        }
    }
});
exports.projectDelete = projectDelete;
const projectAssign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, userId } = req.body;
        const { error, value } = projectValidator_1.projectUserSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                message: error.details[0].message
            });
        }
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        yield pool.request()
            .input('projectId', mssql_1.default.VarChar, projectId)
            .input('userId', mssql_1.default.VarChar, userId)
            .execute('assignProject');
        res.json({ message: `User ${userId} assigned to project ${projectId}` });
    }
    catch (error) {
        if (error instanceof mssql_1.RequestError) {
            res.status(400).json({
                message: error.message
            });
        }
    }
});
exports.projectAssign = projectAssign;
const homePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.info) {
            return res.json({ message: "welcome to the homepage" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.homePage = homePage;
const checkUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.info) {
        res.json({ email: req.info.email, role: req.info.role, userId: req.info.userId });
    }
});
exports.checkUserRole = checkUserRole;
const pendingProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const project = yield (yield pool.request()
            .execute('pendingProjects')).recordset;
        res.status(200).json({
            project
        });
    }
    catch (error) {
        error;
    }
});
exports.pendingProjects = pendingProjects;
const completeProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const projectcomplete = yield (yield pool.request()
            .execute('completeProjects')).recordset;
        res.status(200).json({
            projectcomplete
        });
    }
    catch (error) {
        error;
    }
});
exports.completeProjects = completeProjects;
