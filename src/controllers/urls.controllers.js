import {connection} from "../database/db.js";
import {stripHtml} from "string-strip-html";
import {urlSchema} from "../middlewares/schemas.js";
import {nanoid} from "nanoid";
import moment from "moment";

async function postUrls(req, res){
    const token = req.headers.authorization?.replace("Bearer ", "");
    let {url} = req.body;
    url = stripHtml(url).result.trim();

    const now = moment();
    const createdAt = now.format();

    try {
        const userValid = await connection.query(
            'SELECT token FROM sessions WHERE token = $1;',
            [token]
        );

        if(!token || userValid.rows.length === 0){
            return res.sendStatus(401);
        };

        const validation = urlSchema.validate({url}, {abortEarly: false});

        if(validation.error){
            const errors = validation.error.details.map(detail => detail.message);
            return res.status(422).send(errors);
        };

        let userId = await connection.query(
            'SELECT "userId" FROM sessions WHERE token = $1;',
            [token]
        );

        userId = userId.rows[0].userId;

        const shortUrl = nanoid(10);

        await connection.query(
            'INSERT INTO links ("userId", url, "shortUrl", "createdAt") VALUES ($1, $2, $3, $4);',
            [userId, url, shortUrl, createdAt]
        );

        return res.status(201).send({shortUrl});
    } catch (error) {
       console.error(error);
       return res.sendStatus(500); 
    }
};

async function getUrls(req, res){
    const {id} = req.params;

    try {
        const hasUrl = await connection.query(
            'SELECT url FROM links WHERE id = $1;',
            [id]
        );

        if(hasUrl.rows.length === 0){
            return res.sendStatus(404);
        }

        const data = await connection.query(
            'SELECT "shortUrl", url FROM links WHERE id = $1;',
            [id]
        );

        return res.status(200).send({
            id,
            shortUrl: data.rows[0].shortUrl,
            url: data.rows[0].url
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

async function openShortUrl(req, res){
    const {shortUrl} = req.params;

    try {
        const hasUrl = await connection.query(
            'SELECT url FROM links WHERE "shortUrl" = $1;',
            [shortUrl]
        );

        if(hasUrl.rows.length === 0){
            return res.sendStatus(404);
        };

        const url = hasUrl.rows[0].url;

        let visits = await connection.query(
            'SELECT "visitCount" FROM links WHERE "shortUrl" = $1;',
            [shortUrl]
        );

        visits = visits.rows[0].visitCount;

        const increaseVisits = Number(visits) + 1;

        await connection.query(
            `UPDATE links SET "visitCount" = ${increaseVisits} WHERE "shortUrl" = $1;`,
            [shortUrl]
        );
        
        return res.redirect(url);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

async function deleteUrl(req, res){
    const {id} = req.params;
    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
        const userValid = await connection.query(
            'SELECT token FROM sessions WHERE token = $1;',
            [token]
        );

        if(!token || userValid.rows.length === 0){
            return res.sendStatus(401);
        };

        const hasUrl = await connection.query(
            'SELECT "shortUrl" FROM links WHERE id = $1;',
            [id]
        );

        if(hasUrl.rows.length === 0){
            return res.sendStatus(404);
        }

        const userFromToken = await connection.query(
            'SELECT "userId" FROM sessions WHERE token = $1 ;',
            [token]
        );

        const userFromUrl = await connection.query(
            'SELECT "userId" FROM links WHERE id = $1;',
            [id]
        );

        if(userFromToken.rows[0].userId !== userFromUrl.rows[0].userId){
            return res.sendStatus(401);
        };

        await connection.query(
            'DELETE FROM links WHERE id = $1;',
            [id]
        );

        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

export {postUrls, getUrls, openShortUrl, deleteUrl};