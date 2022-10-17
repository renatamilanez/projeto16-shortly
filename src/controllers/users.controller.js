import { STATUS_CODE } from '../enums/statusCode.js';
import * as usersRepository from "../repositories/users.repository.js";

async function getUserData(req, res){
    const userId = res.locals.userId;

    if(!userId){
        return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
    }

    try {
        let userData = (await usersRepository.getUserDate(userId)).rows[0];

        if(userData === undefined){
            userData = (await usersRepository.setUserData(userId)).rows[0];
            userData = {
                ...userData,
                visitCount: 0
            }
        }

        const userLinks = (await usersRepository.getUserLinks(userId)).rows;

        const data = {
            ...userData,
            shortenedUrls: userLinks
        };
        
        return res.status(STATUS_CODE.SUCCESSOK).send(data);
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    }
}

export {getUserData};