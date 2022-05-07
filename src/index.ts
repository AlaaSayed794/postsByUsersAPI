import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser'
import postsHandlers from './routes/postsRoutes';
import userHandlers from './routes/usersRoutes';


const app: Application = express();
const port: number = 3000;

//app.use a list of your custom middlewares
app.use(morgan('tiny'))
app.use(express.json())

//app.use routes takes url and routes object. now to access routes root url you need to access /api
postsHandlers(app)
userHandlers(app)


//app.Method takes two parameters, URI and callback function
//callback function takes request and response objects as parameters
app.get('/', async (_req: Request, res: Response): Promise<void> => {
    res.send('posts app root route');
}
);

//use this function to map your app to a port
app.listen(port, () => {
    console.log('server started on port: ' + port);
});

export default app;