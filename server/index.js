
import express from 'express';
import cors from 'cors';
import connectDB from './config/connnectDB.js';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from "./route/user.route.js";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

// test 2

const app = express();
app.use(cors(
    {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(''));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

const PORT = 8080 || process.env.PORT;
app.get('/', (req, res) => {
    res.json({
        message: 'servidor rodando'
    });
});

app.use("/api/user", userRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
});
//.then é oque conecta com o banco de dados e depois roda o servidor

