import { stripHtml } from "string-strip-html";
import {userSchema} from "../middlewares/schemas.js";
import bcrypt from 'bcrypt';
import { STATUS_CODE } from '../enums/statusCode.js';
import * as signUpRepository from "../repositories/signUp.repository.js";

async function signUp(req, res){
    let {name, email, password, confirmPassword} = req.body;
    name = stripHtml(name).result.trim();
    email = stripHtml(email).result.trim();
    password = stripHtml(password).result.trim();

    const hashPassword = bcrypt.hashSync(password, 10);

    try {
        const validation = userSchema.validate({name, email, password, confirmPassword}, {abortEarly: false});

        if(validation.error){
            const errors = validation.error.details.map(detail => detail.message);
            return res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(errors);
        }

        const duplicate = await signUpRepository.hasUser(email);
        
        if(duplicate.rows.length > 0){
            return res.sendStatus(STATUS_CODE.ERRORCONFLICT);
        }

        await signUpRepository.postUser(name, email, hashPassword);

        return res.sendStatus(STATUS_CODE.SUCCESSCREATED);
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    }
}

export {signUp};