import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'
import jwt, { Secret } from 'jsonwebtoken'
dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET as Secret


const requiresAuthentication = (
    req: Request,
    res: Response,
    next: NextFunction //resolve linter error to not use Function as a type
): void => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, tokenSecret)
        return next()
    }
    catch (err) {
        res.sendStatus(401)
    }
};

export default requiresAuthentication;
