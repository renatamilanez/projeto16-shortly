import {connection} from "../database/db.js";
import { STATUS_CODE } from '../enums/statusCode.js';

async function getUserData(req, res){
    const userId = res.locals.userId;

    try {
        if(!userId){
            return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
        }

        const userData = (await connection.query(
            `SELECT users.id AS id, 
            users.name AS name,
            SUM(links."visitCount") AS "visitCount"
            FROM users JOIN links 
            ON users.id = links."userId" 
            WHERE users.id=$1
            GROUP BY users.id;`,
            [userId]
        )).rows[0];

        if(userData === undefined){
            userData = (await connection.query(
                `SELECT id,
                name
                FROM users
                WHERE id = $1;
                `,
                [userId]
            )).rows[0];
            userData = {
                ...userData,
                visitCount: 0
            }
        }

        let userLinks = await connection.query(
            `SELECT 
            links.id AS id,
            links."shortUrl" AS "shortUrl",
            links.url AS url,
            links."visitCount" AS "visitCount"
            FROM links
            WHERE "userId" = $1
            ORDER BY id;`,
            [userId]
        );
        userLinks = userLinks.rows;
        console.log(userLinks)

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