import express from "express";
import {signIn} from "../controllers/signIn.controller.js";

const router = express.Router();

router.post('/signin', signIn);

export default router;