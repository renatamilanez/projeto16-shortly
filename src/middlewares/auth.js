import {connection} from "../database/db.js";
import {STATUS_CODE} from "../enums/statusCode.js";

async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if(!token){
        return res.sendStatus(STATUS_CODE.ERRORUNAUTHORIZED);
    }

    try {
        const hasSession = await connection.query(
            'SELECT token FROM sessions WHERE token = $1;',
            [token]
        );

        if(hasSession.rows.length === 0){
            return res.sendStatus(STATUS_CODE.ERRORUNAUTHORIZED);
        }

        const userId = (await connection.query(
            'SELECT "userId" FROM sessions WHERE token = $1 ;',
            [token]
        )).rows[0].userId;

        const hasUser = await connection.query(
            'SELECT id FROM users WHERE id = $1;',
            [userId]
        );

        if(hasUser.rows.length === 0){
            return res.sendStatus(STATUS_CODE.ERRORUNAUTHORIZED);
        }

        res.locals.userId = userId;
        res.locals.token = token;

        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(STATUS_CODE.SERVER_ERROR);
    }
}

export {authMiddleware};