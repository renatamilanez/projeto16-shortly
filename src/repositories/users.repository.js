import {connection} from "../database/db.js";

async function getUserDate(userId){
    return connection.query(
        `SELECT users.id AS id, 
        users.name AS name,
        SUM(links."visitCount") AS "visitCount"
        FROM users JOIN links 
        ON users.id = links."userId" 
        WHERE users.id=$1
        GROUP BY users.id;`,
        [userId]
    )
}

async function getUserLinks(userId){
    return connection.query(
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
}

async function setUserData(userId){
    return connection.query(
        `SELECT id,
        name
        FROM users
        WHERE id = $1;
        `,
        [userId]
    );
}

export {getUserDate, getUserLinks, setUserData}