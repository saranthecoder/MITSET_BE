import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import router from './src/router/admin.routes.js';
import userRoutes from './src/router/user.routes.js';
import connectToMongoDB from './src/db/connectToMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(cookieParser());

app.use('/api/admin',router);
app.use('/api/users',userRoutes);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running in port ${PORT}`);
})