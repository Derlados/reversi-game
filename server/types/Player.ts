import { Socket } from "socket.io";

export default class Player {
    socket: Socket;
    number: number;
    field: Array<Array<number>>;
    countCheckers: number;

    constructor(socket: Socket, number: number) {
        this.socket = socket;
        this.number = number;
        this.countCheckers = 2; // По умолчанию старт с двумя фишками
    }
}