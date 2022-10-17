import { stripHtml } from "string-strip-html";
import {loginSchema} from "../middlewares/schemas.js";
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from "uuid";
import { STATUS_CODE } from '../enums/statusCode.js';
import * as signInRepository from "../repositories/signIn.repository.js";

async function signIn(req, res){
    let {email, password} = req.body;
    email = stripHtml(email).result.trim();
    password = stripHtml(password).result.trim();

    try {
        const validation = loginSchema.validate({email, password}, {abortEarly: false});

        if(validation.error){
            const errors = validation.error.details.map(detail => detail.message);
            return res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(errors);
        }

       const userExist = await signInRepository.hasUser(email);

        if(userExist.rows.length === 0){
            return res.sendStatus(STATUS_CODE.ERRORUNAUTHORIZED);
        }

        const userPassword = await signInRepository.hasPassword(email);

        const isValid = bcrypt.compareSync(password, userPassword);

        if(!isValid){
            return res.sendStatus(STATUS_CODE.ERRORUNAUTHORIZED);
        }

        const token = uuidv4();

        await signInRepository.postUser(email, token);
        
        return res.status(STATUS_CODE.SUCCESSOK).send({token});
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    }
}

export {signIn};