import dotenv from "dotenv";
import pg from "pg";

const {Pool} = pg;

dotenv.config({path: "../.env"});

const databaseConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
};

const connection = new Pool(databaseConfig);

export {connection};