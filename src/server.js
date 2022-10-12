import express from "express";
import cors from "cors";
//import routers

const server = express();
server.use(cors());
server.use(express.json());

//server.use(routers);


server.listen(4000, () => {
    console.log('Listening on Port 4000');
});