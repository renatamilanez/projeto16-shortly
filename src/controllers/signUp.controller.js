import {connection} from "../database/db.js";
import { stripHtml } from "string-strip-html";
import {userSchema} from "../middlewares/schemas.js";
import bcrypt from 'bcrypt';
import moment from "moment";
import { STATUS_CODE } from '../enums/statusCode.js';

//PRONTO, TUDO OK
async function signUp(req, res){
    let {name, email, password, confirmPassword} = req.body;
    name = stripHtml(name).result.trim();
    email = stripHtml(email).result.trim();
    password = stripHtml(password).result.trim();

    const hashPassword = bcrypt.hashSync(password, 10);

    const now = moment();
    const createdAt = now.format();

    try {
        const validation = userSchema.validate({name, email, password, confirmPassword}, {abortEarly: false});

        if(validation.error){
            const errors = validation.error.details.map(detail => detail.message);
            return res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(errors);
        }

        const duplicate = await connection.query(
            'SELECT email FROM users WHERE email LIKE $1;',
            [email]
        );
        
        if(duplicate.rows.length > 0){
            return res.sendStatus(STATUS_CODE.ERRORCONFLICT);
        }

        await connection.query(
            'INSERT INTO users (name, email, password, "createdAt") VALUES ($1, $2, $3, $4);',
            [name, email, hashPassword, createdAt]
        );

        return res.sendStatus(STATUS_CODE.SUCCESSCREATED);
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    }
}

export {signUp};