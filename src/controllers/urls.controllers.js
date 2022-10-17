import {stripHtml} from "string-strip-html";
import {urlSchema} from "../middlewares/schemas.js";
import {nanoid} from "nanoid";
import { STATUS_CODE } from '../enums/statusCode.js';
import * as urlsRepository from "../repositories/urls.repository.js";

async function postUrls(req, res){
    const userId = res.locals.userId;
    let {url} = req.body;
    url = stripHtml(url).result.trim();

    try {
        const validation = urlSchema.validate({url}, {abortEarly: false});

        if(validation.error){
            const errors = validation.error.details.map(detail => detail.message);
            return res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send(errors);
        };

        const shortUrl = nanoid(10);

        await urlsRepository.postUrl(userId, url, shortUrl);

        return res.status(STATUS_CODE.SUCCESSCREATED).send({shortUrl});
    } catch (error) {
       console.error(error);
       return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL); 
    }
};

async function getUrls(req, res){
    const {id} = req.params;

    try {
        const hasUrl = await urlsRepository.hasUrl(id);

        if(hasUrl.rows.length === 0){
            return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
        }

        const urlData = (await urlsRepository.getUrl(id)).rows[0];

        return res.status(STATUS_CODE.SUCCESSOK).send({
            id,
            shortUrl: urlData.shortUrl,
            url: urlData.url
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    }
};

async function openShortUrl(req, res){
    const {shortUrl} = req.params;

    try {
        const hasUrl = await urlsRepository.hasShortUrl(shortUrl);

        if(hasUrl.rows.length === 0){
            return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
        };

        const url = hasUrl.rows[0].url;

        const visits = (await urlsRepository.countVisits(shortUrl)).rows[0].visitCount;

        const increaseVisits = Number(visits) + 1;

        await urlsRepository.updateVisits(increaseVisits, shortUrl);
        
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
        const hasUrl = (await urlsRepository.getShortUrl(id)).rows;

        if(hasUrl.length === 0){
            return res.sendStatus(STATUS_CODE.ERRORNOTFOUND);
        }

        const userFromUrl = (await urlsRepository.getUserFromUrl(id)).rows[0].userId;

        if(userId !== userFromUrl){
            return res.sendStatus(STATUS_CODE.ERRORUNAUTHORIZED);
        };

        await urlsRepository.deleteUrl(id);

        return res.sendStatus(STATUS_CODE.SUCCESSNOCONTENT);
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    }
};

export {postUrls, getUrls, openShortUrl, deleteUrl};