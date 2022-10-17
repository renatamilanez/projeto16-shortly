import express from "express";
import {getUserData} from "../controllers/users.controller.js";
import {authMiddleware} from "../middlewares/auth.js";

const router = express.Router();

router.get('/users/me', authMiddleware, getUserData);

export default router;