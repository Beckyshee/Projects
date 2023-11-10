"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../Controller/userController");
const userRouter = (0, express_1.Router)();
userRouter.post('/create', userController_1.registerUser);
userRouter.post('/login', userController_1.loginUser);
userRouter.post('/setDone', userController_1.updateComplete);
userRouter.post('/assigned', userController_1.checkAssigned);
userRouter.post('/allusers', userController_1.displayAllUsers);
userRouter.post('/idleusers', userController_1.UnassignedUsers);
exports.default = userRouter;