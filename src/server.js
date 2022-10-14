import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import routers

const server = express();
server.use(cors());
server.use(express.json());

dotenv.config({path: "../.env"});

//server.use(routers);

server.listen(process.env.PORT, () => {
    console.log('Listening on Port 4000');
});