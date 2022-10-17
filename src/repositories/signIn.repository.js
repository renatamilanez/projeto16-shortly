import {connection} from "../database/db.js";
import moment from "moment";

async function hasUser(email){
    return connection.query(
        'SELECT email FROM users WHERE email = $1',
        [email]
    );
}

async function hasPassword(email){
    const userPassword = (await connection.query(
        'SELECT password FROM users WHERE email = $1',
        [email]
    )).rows[0].password;

    return userPassword;
}

async function postUser(email, token){
    const now = moment();
    const createdAt = now.format();

    const userId = (await connection.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
    )).rows[0].id;

    return await connection.query(
        'INSERT INTO sessions ("userId", token, "createdAt") VALUES ($1, $2, $3)',
        [userId, token, createdAt]
    );
}

export {hasUser, hasPassword, postUser};