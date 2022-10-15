import {connection} from "../database/db.js";

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
        
        return res.status(200).send(ranking.rows);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {getRanking}