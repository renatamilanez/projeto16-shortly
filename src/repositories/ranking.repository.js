import {connection} from "../database/db.js";

async function getRanking(){
    return connection.query(
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
}

export {getRanking};