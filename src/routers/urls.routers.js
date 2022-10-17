import express from "express";
import {postUrls, getUrls, openShortUrl, deleteUrl} from "../controllers/urls.controllers.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/urls/shorten", authMiddleware, postUrls);
router.get("/urls/:id", getUrls);
router.get("/urls/open/:shortUrl", openShortUrl);
router.delete("/urls/:id", authMiddleware, deleteUrl);

export default router;