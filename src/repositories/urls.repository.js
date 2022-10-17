import {connection} from "../database/db.js";
import moment from "moment";

async function postUrl(userId, url, shortUrl){
    const now = moment();
    const createdAt = now.format();

    return connection.query(
        'INSERT INTO links ("userId", url, "shortUrl", "createdAt") VALUES ($1, $2, $3, $4);',
        [userId, url, shortUrl, createdAt]
    );
}

async function hasUrl(id){
    return connection.query(
        'SELECT url FROM links WHERE id = $1;',
        [id]
    );
}

async function getUrl(id){
    return connection.query(
        'SELECT "shortUrl", url FROM links WHERE id = $1;',
        [id]
    );
}

async function hasShortUrl(shortUrl){
    return connection.query(
        'SELECT url FROM links WHERE "shortUrl" = $1;',
        [shortUrl]
    );
}

async function countVisits(shortUrl){
    return connection.query(
        'SELECT "visitCount" FROM links WHERE "shortUrl" = $1;',
        [shortUrl]
    );
}

async function updateVisits(increaseVisits, shortUrl){
    return connection.query(
        `UPDATE links SET "visitCount" = ${increaseVisits} WHERE "shortUrl" = $1;`,
        [shortUrl]
    )
}

async function getShortUrl(id){
    return connection.query(
        'SELECT "shortUrl" FROM links WHERE id = $1;',
        [id]
    );
}

async function getUserFromUrl(id){
    return connection.query(
        'SELECT "userId" FROM links WHERE id = $1;',
        [id]
    )
}

async function deleteUrl(id){
    return connection.query(
        'DELETE FROM links WHERE id = $1;',
        [id]
    );
}

export {postUrl, hasUrl, getUrl, hasShortUrl, countVisits, updateVisits, getShortUrl, getUserFromUrl, deleteUrl};