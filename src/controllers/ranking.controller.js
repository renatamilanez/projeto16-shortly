import {connection} from "../database/db.js";
import { STATUS_CODE } from '../enums/statusCode.js';

async function getRanking(req, res){
    try {
        const ranking = await connection.query(
            `SELECT users.id AS id,
            users.name AS name,
            COUNT(links.id) AS "linksCount",
            SUM(links."visitCount") AS "visitCount"
            FROM users JOIN links
            ON users.id = links."userId" 
            GROUP BY users.id
            ORDER BY "visitCount" DESC
            LIMIT 10;`
        );
        
        return res.status(STATUS_CODE.SUCCESSOK).send(ranking.rows);
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    }
}

export {getRanking}