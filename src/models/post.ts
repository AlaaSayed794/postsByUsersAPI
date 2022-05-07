import client from "../database";

export type Post = {
    id?: number,
    description: string,
    user_id: number
}

export class PostStore {

    async index(): Promise<Post[]> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * from posts'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }
        catch (err) {
            throw new Error()
        }
    }

    async indexByUser(id: number): Promise<Post[]> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * from posts where user_id=$1'
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows
        }
        catch (err) {
            throw new Error()
        }
    }


    async show(id: number): Promise<Post> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * from posts WHERE id=$1;'
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        }
        catch (err) {
            console.log(err)
            throw new Error()
        }
    }
    async showByUser(id: number, userId: number): Promise<Post> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * from posts WHERE id=$1 and user_id=$2;'
            const result = await conn.query(sql, [id, userId])
            conn.release()
            return result.rows[0]
        }
        catch (err) {
            console.log(err)
            throw new Error()
        }
    }

    async delete(id: number): Promise<number> {
        try {
            const conn = await client.connect()
            const sql = 'delete from posts WHERE id=$1 returning *;'
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rowCount
        }
        catch (err) {
            console.log(err)
            throw new Error()
        }
    }

    async create(p: Post): Promise<Post> {
        try {
            const conn = await client.connect()
            const sql = 'Insert into posts(description,user_id) values($1,$2) returning *;'
            const result = await conn.query(sql, [p.description, p.user_id])
            conn.release()
            return result.rows[0]
        }
        catch (err) {
            console.log(err)
            throw new Error()
        }
    }

}