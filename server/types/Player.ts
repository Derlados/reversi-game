import { Socket } from "socket.io";

export default class Player {
    username: string;
    socket: Socket;
    number: number;
    field: Array<Array<number>>;
    countCheckers: number;
    timer: NodeJS.Timeout;

    constructor(username: string, socket: Socket, number: number) {
        this.username = username;
        this.socket = socket;
        this.number = number;
        this.countCheckers = 2; // По умолчанию старт с двумя фишками
    }
}