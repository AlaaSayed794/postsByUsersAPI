import bodyParser from 'body-parser'
import express, { Request, Response } from 'express';
import requiresAdmin from '../middlewares/requiresAdmin';
import requiresAuthentication from '../middlewares/requiresAuthentication';
import requiresUser from '../middlewares/requiresUser';
import { Post, PostStore } from '../models/post'

//mimic database, this will reset when we reset the server
let postStore: PostStore = new PostStore()



//get all posts
const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const posts = await postStore.index()
        res.json(posts);
    }
    catch (err) {
        res.sendStatus(500)
    }

}


const getUserPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.userId)
        const posts = await postStore.indexByUser(userId)
        res.json(posts);
    }
    catch (err) {
        res.sendStatus(500)
    }
}

const getPost = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string)
    if (id) {
        try {
            const post: Post | undefined = await postStore.show(id)
            if (post) {
                res.json(post)
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

const getUserPost = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string)
    const userId: number = parseInt(req.params.userId as string)

    if (id) {
        try {
            const post: Post | undefined = await postStore.showByUser(id, userId)
            if (post) {
                res.json(post)
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



const createPost = async (req: Request, res: Response): Promise<void> => {
    const description: string | undefined = req.body.description
    const user_id = parseInt(req.body.user_id)

    //ensure title validity
    if (description && typeof description == 'string' && user_id) {
        try {
            const newPost = await postStore.create({ description, user_id })
            res.json(newPost)
        }
        catch (err) {
            res.sendStatus(500)
        }
    }
    else {
        res.status(400).send("bad request")
    }
}


const deletePost = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string)
    if (id) {
        try {
            const deleted: number | undefined = await postStore.delete(id)
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


const postsHandlers = (app: express.Application): void => {
    app.get('/posts', requiresAuthentication, requiresAdmin, getAllPosts)
    app.get('/users/:userId/posts', requiresAuthentication, requiresUser, getUserPosts)
    app.get('/:id', requiresAuthentication, requiresAdmin, getPost)
    app.get('/users/:userId/posts/:id', requiresAuthentication, requiresUser, getUserPost)
    app.post('/posts', createPost)
    app.delete('/:id', deletePost)
}

export default postsHandlers;
