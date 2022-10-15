import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import urlsRouters from "./routers/urls.routers.js";
import signInRouter from "./routers/signIn.router.js";
import signUpRouter from "./routers/signUp.router.js";
import rankingRouter from "./routers/ranking.router.js";
import getUserData from "./routers/users.router.js";
import getRanking from "./routers/ranking.router.js";

const server = express();
server.use(cors());
server.use(express.json());

dotenv.config({path: "../.env"});

server.use(signInRouter, signUpRouter, urlsRouters, rankingRouter, getUserData, getRanking);

server.listen(process.env.PORT, () => {
    console.log('Listening on Port 4000');
});