import dotenv from 'dotenv'
import { Pool } from "pg";
dotenv.config()

let {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_TESTDB,
    NODE_ENV,
} = process.env

let client: Pool

if (NODE_ENV == 'dev') {
    client = new Pool({
        "host": POSTGRES_HOST,
        "database": POSTGRES_DB,
        "user": POSTGRES_USER,
        "password": POSTGRES_PASSWORD
    })
}
else {
    client = new Pool({
        "host": POSTGRES_HOST,
        "database": POSTGRES_TESTDB,
        "user": POSTGRES_USER,
        "password": POSTGRES_PASSWORD
    })
}


export default client