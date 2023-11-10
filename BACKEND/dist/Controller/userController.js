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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnassignedUsers = exports.displayAllUsers = exports.checkAssigned = exports.updateComplete = exports.loginUser = exports.registerUser = void 0;
const mssql_1 = __importStar(require("mssql"));
const config_1 = require("../Config/config");
const userValidator_1 = require("../Helper/userValidator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const projectValidator_1 = require("../Helper/projectValidator");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        const { error, value } = userValidator_1.userValidator.validate(req.body);
        const hashedPwd = yield bcrypt_1.default.hash(password, 8);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        yield pool.request()
            .input('firstName', mssql_1.default.VarChar, firstName)
            .input('lastName', mssql_1.default.VarChar, lastName)
            .input('email', mssql_1.default.VarChar, email)
            .input('password', mssql_1.default.VarChar, hashedPwd)
            .execute('createUser');
        return res.status(200).json({
            message: "Account created successfully"
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "User Already Exists"
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const { error, value } = userValidator_1.userLoginValidator.validate(req.body);
        if (error) {
            return res.status(404).json({
                message: error.details[0].message
            });
        }
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const user = (yield pool.request()
            .input('email', mssql_1.default.VarChar, email)
            .execute('loginUser')).recordset;
        const validPassword = yield bcrypt_1.default.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(400).json({
                message: "invalid password"
            });
        }
        const logins = user.map(item => {
            const { password } = item, rest = __rest(item, ["password"]);
            return rest;
        });
        const token = jsonwebtoken_1.default.sign(logins[0], process.env.KEY, { expiresIn: '300s' });
        return res.status(200).json({
            message: "Logged in successfully", token
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error
        });
    }
});
exports.loginUser = loginUser;
//SETTING PROJECT COMPLETE
/**
 *
 * @param req REQUEST A PROJECT ID AND USER ID FROM USER
 * @param res RESPONSE
 * @returns RETURN A RESPONSE BASED ON USERS INPUT
 */
const updateComplete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.body;
        const { error, value } = projectValidator_1.projectUserSchema2.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        yield pool.request()
            .input('projectId', mssql_1.default.VarChar, projectId)
            .execute('setComplete');
        return res.status(200).json({
            message: "Task completed"
        });
    }
    catch (error) {
        if (error instanceof mssql_1.RequestError) {
            res.status(404).json({
                message: "No Pending project with that ProjectId"
            });
        }
        else {
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }
});
exports.updateComplete = updateComplete;
const checkAssigned = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const assignedProj = yield (yield pool.request()
            .execute('checkAssigned')).recordset;
        res.status(200).json({
            assignedProj
        });
    }
    catch (error) {
        error;
    }
});
exports.checkAssigned = checkAssigned;
const displayAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const allusers = yield (yield pool.request()
            .execute('displayAllUsers')).recordset;
        res.status(200).json({
            allusers
        });
    }
    catch (error) {
        error;
    }
});
exports.displayAllUsers = displayAllUsers;
const UnassignedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const IdleUsers = yield (yield pool.request().execute('IdleUsers')).recordset;
        res.status(200).json(IdleUsers);
    }
    catch (error) {
        error;
    }
});
exports.UnassignedUsers = UnassignedUsers;
