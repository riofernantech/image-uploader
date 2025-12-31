import express from 'express';
import dotenv from 'dotenv'
import router from './src/route/api.js';
import cors from './src/middleware/corsMiddleware.js';
import errorMiddleware from './src/middleware/errorMiddleware.js';

dotenv.config();

const app = express()
const port = process.env.PORT

app.use(cors);

app.use(express.json());

app.use(router);

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
