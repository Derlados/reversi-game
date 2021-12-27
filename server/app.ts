import express from "express";
import http from "http";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from 'dotenv';
import GameController from './controllers/GameController';
dotenv.config();

export const imageRoot = __dirname + '/images';

// Инициализация сервера и сокета
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
GameController.getGameController().init(server);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname));
app.use(fileUpload());

app.use(express.static('/images'));


server.listen(PORT, () => {
    console.log("START");
});
