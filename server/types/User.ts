import { Socket } from "socket.io";

export default class Player {
    socket: Socket;
    number: number;

    constructor(socket: Socket, number: number) {
        this.socket = socket;
        this.number = number;
    }
}