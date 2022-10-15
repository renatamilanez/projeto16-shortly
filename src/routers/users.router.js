import express from "express";
import {getUserData} from "../controllers/users.controller.js";

const router = express.Router();

router.get('/users/me', getUserData);

export default router;