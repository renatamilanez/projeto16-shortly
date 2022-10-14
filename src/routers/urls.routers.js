import express from "express";
import {postUrls, getUrls, openShortUrl, deleteUrl} from "../controllers/urls.controllers.js";

const router = express.Router();

router.post("/urls/shorten", postUrls);
router.get("/urls/:id", getUrls);
router.get("/urls/open/:shortUrl", openShortUrl);
router.delete("/urls/:id", deleteUrl);

export default router;