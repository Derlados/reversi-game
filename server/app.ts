import express from "express";
import http from "http";
import cors from "cors";
import dotenv from 'dotenv';
import GameController from './controllers/GameController';
import mongoose from "mongoose";
import userRouter from "./routers/UserRouter";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', userRouter);

async function start() {
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const server = http.createServer(app);
    GameController.init(server);

    server.listen(PORT, () => {
        console.log("START");
    });
}
start();


