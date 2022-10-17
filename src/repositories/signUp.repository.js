import {connection} from "../database/db.js";
import moment from "moment";

async function hasUser(email){
    return connection.query(
        'SELECT email FROM users WHERE email = $1;',
        [email]
    );
}

async function postUser(name, email, hashPassword){
    const now = moment();
    const createdAt = now.format();

    return connection.query(
        'INSERT INTO users (name, email, password, "createdAt") VALUES ($1, $2, $3, $4);',
        [name, email, hashPassword, createdAt]
    );
}

export {hasUser, postUser};