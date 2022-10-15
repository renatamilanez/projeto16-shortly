import {connection} from "../database/db.js";

async function getUserData(req, res){
    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
         const userValid = await connection.query(
            'SELECT token FROM sessions WHERE token = $1;',
            [token]
        );

        if(!token || userValid.rows.length === 0){
            return res.sendStatus(401);
        };

        let userId = await connection.query(
            'SELECT "userId" FROM sessions WHERE token = $1;',
            [token]
        );

        userId = userId.rows[0].userId;

        if(!userId){
            return res.sendStatus(404);
        }

        let userData = await connection.query(
            `SELECT users.id AS id, 
            users.name AS name,
            SUM(links."visitCount") AS "visitCount"
            FROM users JOIN links 
            ON users.id = links."userId" 
            WHERE users.id=$1
            GROUP BY users.id;`,
            [userId]
        );
        userData = userData.rows[0];

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
        
        return res.status(200).send(data);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {getUserData};