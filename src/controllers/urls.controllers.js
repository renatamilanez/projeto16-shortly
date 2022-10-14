import {connection} from "../database/db.js";
import { stripHtml } from "string-strip-html";
import {urlSchema} from "../middlewares/schemas.js";
import {nanoid} from "nanoid";
import moment from "moment";

//PRONTA, FALTA TESTAR
async function postUrls(req, res){
    const token = req.headers;
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

        const userId = await connection.query(
            'SELECT userId FROM sessions WHERE token = $1;',
            [token]
        );

        const id = userId.rows[0];

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

//PRONTO, FALTA TESTAR
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
            shortUrl: data.shortUrl,
            url: data.url
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

//PRONTO, FALTA TESTAR
async function openShortUrl(req, res){
    const {shortUrl} = req.params;

    try {
        const hasUrl = await connection.query(
            'SELECT url FROM links WHERE "shortUrl" = $1;',
            [shortUrl]
        );

        if(hasUrl.rows.length === 0){
            return res.status(404);
        };

        const url = hasUrl.rows[0].url;

        const visits = await connection.query(
            'SELECT "visitCount" FROM links WHERE "shortUrl" = $1;',
            [shortUrl]
        );

        const increaseVisits = Number(visits) + 1;

        const updateVisit = await connection.query(
            `UPDATE links SET "visitCount" = ${increaseVisits} WHERE shortUrl = $1;`,
            [shortUrl]
        );
        
        return res.redirect(`/${url}`);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

async function deleteUrl(req, res){
    const {id} = req.params;
    const {token} = req.headers;

    try {
        const userValid = await connection.query(
            'SELECT token FROM sessions WHERE token = $1;',
            [token]
        );

        if(!token || userValid.rows.length === 0){
            return res.sendStatus(401);
        };


        return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

export {postUrls, getUrls, openShortUrl, deleteUrl};