import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';

import userRoutes from './src/router/user.routes.js';
import connectToMongoDB from './src/db/connectToMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: '*',
    credentials: true, // Enable sending cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running in port ${PORT}`);
})