import { Server, Socket } from "socket.io";
import http from "http";
import * as crypto from "crypto";
import SocketComands from "../constants/SocketComands";
import { GameRoom } from "./GameRoom";

class GameController {
    private io: Server;
    private gameRooms: Map<string, GameRoom>;

    constructor() {
        this.gameRooms = new Map<string, GameRoom>();
    }

    /**
     * Инициализация серверного сокета
     * @param server - http сервер, который создается при инициализации всего сервера @see app.ts
     */
    public init(server: http.Server) {
        this.io = new Server(server);
        this.io.on(SocketComands.CONNECTION, (socket: Socket) => {
            this.connectNewuser(socket);
        });
    }

    /**
     * Подключение нового пользователя. Сначала проверяется наличие пустых комнат, если их нет - создается новая комната с уникальным hash id
     * взятым как id сокета первого пользователя, если есть - второй игрок подключается в существующую комнату и начинается игра
     * @param socket - сокет игрока
     */
    private connectNewuser(socket: Socket) {
        const roomId = this.findEmptyRoomId();
        if (!roomId) {
            this.crateRoom(socket);
        } else {
            const room = this.gameRooms.get(roomId);
            room.addSecondPlayer(socket);
            room.startGame(roomId);
        }
    }

    /**
     * Поиск id первой свободной комнаты, для подключения игрока
     * @returns hash id комнаты
     */
    private findEmptyRoomId(): string {
        for (const [key, room] of this.gameRooms) {
            if (room.isWaiting) {
                return key;
            }
        }

        return '';
    }

    /**
     * Удаление комнаты
     * @param roomId - hash id комнаты
     */
    private clearRoom(roomId: string) {
        this.gameRooms.delete(roomId);
    }

    /**
     * Создание новой комнаты. Первый игрок является создателем комнаты, потому id комнаты генерируется от id его сокета.
     * В случае дисконекта пользователя, во время ожидания, комната будет удалена
     * @param socket - сокет первого игрока, для которого создается комната
     */
    private crateRoom(socket: Socket) {
        const newRoomId = crypto.createHash('sha256').update(socket.id).digest('hex');
        this.gameRooms.set(newRoomId, new GameRoom(newRoomId, socket, (roomId) => { this.clearRoom(roomId) }));

        socket.on(SocketComands.DISCONNECT, () => {
            if (this.gameRooms.get(newRoomId).isWaiting) {
                this.clearRoom(newRoomId);
                console.log("disconnect");
            }
        })
    }
}

export default new GameController();