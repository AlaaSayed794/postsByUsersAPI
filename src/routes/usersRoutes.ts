import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import requiresAuthentication from '../middlewares/requiresAuthentication';
import requiresAdmin from '../middlewares/requiresAdmin';
dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET

//mimic database, this will reset when we reset the server
let userStore: UserStore = new UserStore()



//get all posts
const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const posts = await userStore.index()
        res.json(posts);
    }
    catch (err) {
        res.sendStatus(500)
    }

}

const authenticate = async (req: Request, res: Response): Promise<void> => {
    const name = req.body.name
    const password = req.body.password

    if (name && typeof name === 'string' && password && typeof password === 'string') {
        try {
            const user = await userStore.authenticate(name, password)
            if (user) {
                const token = jwt.sign({
                    user: {
                        name: user.name,
                        id: user.id,
                        role: user.role
                    }
                }, tokenSecret as string)
                res.json(token)
            }
            else {
                res.sendStatus(401)
            }
        }
        catch (err) {
            res.sendStatus(500)
        }

    }
    else {
        res.status(400).send("bad request")
    }
}

const createUser = async (req: Request, res: Response): Promise<void> => {
    const name = req.body.name
    const password = req.body.password

    if (name && typeof name === 'string' && password && typeof password === 'string') {
        try {
            const user: User = {
                name,
                password,
                role: 'user'
            }

            const newUser = await userStore.create(user)
            const token = jwt.sign({
                user: {
                    name: newUser.name,
                    id: newUser.id,
                    role: newUser.role
                }
            }, tokenSecret as string)
            res.json(token)

        }
        catch (err) {
            res.sendStatus(500)
        }

    }
    else {
        res.status(400).send("bad request")
    }
}
const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string)
    if (id) {
        try {
            const deleted: number | undefined = await userStore.delete(id)
            if (deleted) {
                res.sendStatus(204)
            }
            else {
                res.sendStatus(404)
            }
        }
        catch (err) {
            res.sendStatus(500)
        }
    }
    else {
        res.sendStatus(404)
    }
}
//delete a resouce

const userHandlers = (app: express.Application): void => {
    app.get('/users', requiresAuthentication, requiresAdmin, getAllUsers)
    app.post('/authentication', authenticate)
    app.post('/users', createUser)
    app.delete('/users/:id', requiresAuthentication, requiresAdmin, deleteUser)
}
export default userHandlers;
