import {connection} from "../database/db.js";
import {stripHtml} from "string-strip-html";
import {urlSchema} from "../middlewares/schemas.js";
import {nanoid} from "nanoid";
import moment from "moment";
import { STATUS_CODE } from '../enums/statusCode.js';

async function postUrls(req, res){
    const token = res.locals.token;
    const userId = res.locals.userId;
    let {url} = req.body;
    url = stripHtml(url).result.trim();

    const now = moment();
    const createdAt = now.format();

    try {
        const validation = urlSchema.validate({url}, {abortEarly: false});

        if(validation.error){
            const errors = validation.error.details.map(detail => detail.message);
            return res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(errors);
        };

        const shortUrl = nanoid(10);

        await connection.query(
            'INSERT INTO links ("userId", url, "shortUrl", "createdAt") VALUES ($1, $2, $3, $4);',
            [userId, url, shortUrl, createdAt]
        );

        return res.status(STATUS_CODE.SUCCESSCREATED).send({shortUrl});
    } catch (error) {
       console.error(error);
       return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL); 
    }
};

async function getUrls(req, res){
    const {id} = req.params;

    try {
        const hasUrl = (await connection.query(
            'SELECT url FROM links WHERE id = $1;',
            [id]
        )).rows;

        if(hasUrl.length === 0){
            return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
        }

        const data = (await connection.query(
            'SELECT "shortUrl", url FROM links WHERE id = $1;',
            [id]
        )).rows[0];

        return res.status(STATUS_CODE.SUCCESSOK).send({
            id,
            shortUrl: data.shortUrl,
            url: data.url
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
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
            return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
        };

        const url = hasUrl.rows[0].url;

        const visits = (await connection.query(
            'SELECT "visitCount" FROM links WHERE "shortUrl" = $1;',
            [shortUrl]
        )).rows[0].visitCount;

        const increaseVisits = Number(visits) + 1;

        await connection.query(
            `UPDATE links SET "visitCount" = ${increaseVisits} WHERE "shortUrl" = $1;`,
            [shortUrl]
        );
        
        return res.redirect(url);
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    }
};

async function deleteUrl(req, res){
    const {id} = req.params;
    const userId = res.locals.userId;

    try {
        const hasUrl = (await connection.query(
            'SELECT "shortUrl" FROM links WHERE id = $1;',
            [id]
        )).rows;

        if(hasUrl.length === 0){
            return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
        }

        const userFromUrl = (await connection.query(
            'SELECT "userId" FROM links WHERE id = $1;',
            [id]
        )).rows[0].userId;

        if(userId !== userFromUrl){
            return res.sendStatus(STATUS_CODE.ERRORUNAUTHORIZED);
        };

        await connection.query(
            'DELETE FROM links WHERE id = $1;',
            [id]
        );

        return res.sendStatus(STATUS_CODE.SUCCESSNOCONTENT);
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    }
};

export {postUrls, getUrls, openShortUrl, deleteUrl};