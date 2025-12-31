import cors from 'cors';

const allowedOrigins = process.env.ALLOWED_ORIGIN;

const corsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST'],
}

export default cors(corsOptions); 