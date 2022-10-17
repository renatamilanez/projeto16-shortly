import { STATUS_CODE } from '../enums/statusCode.js';
import * as rankingRepository from "../repositories/ranking.repository.js";

async function getRanking(req, res){
    try {
        const ranking = await rankingRepository.getRanking();
        
        return res.status(STATUS_CODE.SUCCESSOK).send(ranking.rows);
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    }
}

export {getRanking};