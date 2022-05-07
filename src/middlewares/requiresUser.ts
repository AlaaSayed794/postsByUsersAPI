import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { User } from '../models/user'
dotenv.config()



const requiresUser = (
    req: Request,
    res: Response,
    next: NextFunction //resolve linter error to not use Function as a type
): void => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        const user: User | null = (jwt.decode(token) as JwtPayload).user as User
        console.log(user.id)
        console.log(parseInt(req.params.userId))
        if (user.id === parseInt(req.params.userId)) {
            return next()
        }
        throw new Error()

    }
    catch (err) {
        res.sendStatus(403)
    }
};

export default requiresUser;
