import { Socket } from "socket.io";
import SocketComands from "../constants/SocketComands";
import Player from "../types/User";

/**
 * ПРАВИЛА ИГРЫ. В начале игры в центр доски выставляются 4 фишки: чёрные на d5 и e4, белые на d4 и e5.
    - Первый ход делают чёрные. Далее игроки ходят по очереди.
    - Делая ход, игрок должен поставить свою фишку на одну из клеток доски таким образом, чтобы между этой поставленной фишкой и одной из имеющихся уже на доске фишек его 
      цвета находился непрерывный ряд фишек соперника, горизонтальный, вертикальный или диагональный (другими словами, чтобы непрерывный ряд фишек соперника оказался «закрыт»
      фишками игрока с двух сторон). Все фишки соперника, входящие в «закрытый» на этом ходу ряд, переворачиваются на другую сторону (меняют цвет) и переходят к ходившему игроку.
    - Если в результате одного хода «закрывается» одновременно более одного ряда фишек противника, то переворачиваются все фишки, оказавшиеся на всех «закрытых» рядах.
    - Игрок вправе выбирать любой из возможных для него ходов. Если игрок имеет возможные ходы, он не может отказаться от хода. Если игрок не имеет допустимых ходов, 
      то ход передаётся сопернику.
    - Игра прекращается, когда на доску выставлены все фишки или когда ни один из игроков не может сделать хода. По окончании игры проводится подсчёт фишек каждого цвета, и игрок, 
      чьих фишек на доске выставлено больше, объявляется победителем. В случае равенства количества фишек засчитывается ничья.
 */
export class GameRoom {
    private static BASIC_SIZE_FIELD = 6;

    private EMPTY_CELL = 0;
    private FIRST_PLAYER = 1;
    private SECOND_PLAYER = 2;

    private roomId: string;
    private deleteRoom: (roomId: string) => void;
    public player1: Player;
    public player2: Player;
    private field: Array<Array<number>>;

    public isWaiting = true;
    private currentUserId: string;

    constructor(roomId: string, player1: Socket, deleteRoom: (roomId: string) => void, fieldSize: number = GameRoom.BASIC_SIZE_FIELD) {
        this.roomId = roomId;
        this.deleteRoom = deleteRoom;
        this.player1 = new Player(player1, this.FIRST_PLAYER);

        this.field = new Array<Array<number>>(fieldSize);
        for (var i = 0; i < fieldSize; ++i) {
            this.field[i] = new Array<number>(fieldSize);
            for (var j = 0; j < fieldSize; ++j) {
                this.field[i][j] = this.EMPTY_CELL;
            }
        }


        this.field[fieldSize / 2 - 1][fieldSize / 2] = this.FIRST_PLAYER;
        this.field[fieldSize / 2][fieldSize / 2 - 1] = this.FIRST_PLAYER;
        this.field[fieldSize / 2 - 1][fieldSize / 2 - 1] = this.SECOND_PLAYER;
        this.field[fieldSize / 2][fieldSize / 2] = this.SECOND_PLAYER;
    }

    public addSecondPlayer(player2: Socket) {
        this.player2 = new Player(player2, this.SECOND_PLAYER);
        this.isWaiting = false;
    }

    public startGame(roomId: string) {
        this.setPlayerSocket(this.player1, this.player2);
        this.setPlayerSocket(this.player2, this.player1);
        this.player1.socket.emit('start', { description: `game started, id: ${roomId}`, roomId: roomId });
        this.player2.socket.emit('start', { description: `game started, id: ${roomId}`, roomId: roomId });

        this.currentUserId = this.player1.socket.id;
    }

    //TODO
    public endGame(winner: Player, loser: Player, additionalDesc?: string) {
        this.player1.socket.disconnect();
        this.player2.socket.disconnect();
        this.deleteRoom(this.roomId);
    }

    //TODO
    public endGameDisconnect(disconnectedUser: Socket) {
        if (this.player1.socket.id == disconnectedUser.id) {
            this.endGame(this.player2, this.player1, `game ended opponent disconnect`);
        } else {
            this.endGame(this.player1, this.player2, `game ended opponent disconnect`);
        }
    }

    //TODO
    private setPlayerSocket(player: Player, opponent: Player) {
        player.socket.on(SocketComands.GAME_TURN, (data: GameRoom.Coord) => {
            // Проверка на случай если придет ложный запрос о ходе не того игрока
            if (this.currentUserId == player.socket.id) {
                this.changeField(data, player);
                this.turnAnalyze();
            } else {
                console.log("wrong player");
            }
        });
        player.socket.on(SocketComands.GIVE_UP, () => {

        });
        player.socket.on(SocketComands.DISCONNECT, () => {
            opponent.socket.removeAllListeners(SocketComands.DISCONNECT); // Удаляется дисконект, 
            this.endGameDisconnect(player.socket);
        });
    }

    /**
     * Нахождение всех рядов которые закрывает игрок и их закрытие
     * @param playerTurn - координаты точки куда походил игрок
     */
    private changeField(playerTurn: GameRoom.Coord, player: Player): void {
        const horCoord = new GameRoom.Coord(playerTurn.x, 0);
        const verCoord = new GameRoom.Coord(0, playerTurn.y);

        const minLeftDimen = Math.min(playerTurn.x, playerTurn.y); // Минимальная размерность 
        const leftDiagCoord = new GameRoom.Coord(playerTurn.x - minLeftDimen, playerTurn.y - minLeftDimen); // (От каждой размерности отнимается минимальная, чтобы найти старт левой диагонали)

        const minRightDimen = Math.min(playerTurn.x, (this.field.length - 1) - playerTurn.y); // Минимальная размерность (Для правой диагонали нужна обратная длина по горизонтали, тянемся к правой стенке)
        const rightDiagCoord = new GameRoom.Coord(playerTurn.x - minRightDimen, playerTurn.y + minRightDimen);

        const size = this.field.length;
        for (let i = 0; i < size; ++i) {
            // Прохлжение по горизонтали
            if (horCoord.y != playerTurn.y && this.field[horCoord.x][horCoord.y] == player.number) {
                this.swapRange(horCoord, playerTurn, GameRoom.Direction.HORIZONTAL, player);
            }
            ++horCoord.y;

            // Прохожение по вертикали
            if (verCoord.x != playerTurn.x && this.field[verCoord.x][verCoord.y] == player.number) {
                this.swapRange(verCoord, playerTurn, GameRoom.Direction.VERTICAL, player);
            }
            ++verCoord.x;

            // Прохожение по левой диагонали
            if (leftDiagCoord.x < size && leftDiagCoord.y < size && leftDiagCoord.x != playerTurn.x && this.field[leftDiagCoord.x][leftDiagCoord.y] == player.number) {
                this.swapRange(leftDiagCoord, playerTurn, GameRoom.Direction.DIAGONAL_LEFT, player);
            }
            ++leftDiagCoord.x;
            ++leftDiagCoord.y;

            // Прохожение по правой диагонали
            if (rightDiagCoord.x < size && rightDiagCoord.y >= 0 && rightDiagCoord.x != playerTurn.x && this.field[rightDiagCoord.x][rightDiagCoord.y] == player.number) {
                this.swapRange(rightDiagCoord, playerTurn, GameRoom.Direction.DIAGONAL_RIGHT, player);
            }
            ++rightDiagCoord.x;
            --rightDiagCoord.y;
        }

        for (let i = 0; i < size; ++i) {
            console.log(this.field[i]);
        }
        console.log('//////////////////////////////////////');

    }

    /**
     * Переворот фишек в ряду
     * @param first - первая фишка
     * @param second - вторая фишка
     * @param dir - направление переворота
     */
    private swapRange(first: GameRoom.Coord, second: GameRoom.Coord, dir: GameRoom.Direction, player: Player): void {
        // Для обхода слев на право
        if ((dir == GameRoom.Direction.HORIZONTAL || GameRoom.Direction.DIAGONAL_LEFT) && (first.y > second.y)) {
            [first, second] = [second, first];
        }

        //  Для обхода сверху вниз
        if ((dir == GameRoom.Direction.VERTICAL || GameRoom.Direction.DIAGONAL_RIGHT) && (first.x > second.x)) {
            [first, second] = [second, first];
        }

        switch (dir) {
            case GameRoom.Direction.HORIZONTAL: {
                for (let i = first.y; i <= second.y; ++i) {
                    this.field[first.x][i] = player.number;
                }
                break;
            }
            case GameRoom.Direction.VERTICAL: {
                for (let i = first.x; i <= second.x; ++i) {
                    this.field[i][first.y] = player.number;
                }
                break;
            }
            case GameRoom.Direction.DIAGONAL_LEFT: {
                for (let x = first.x, y = first.y; y <= second.y; ++x, ++y) {
                    this.field[x][y] = player.number;
                }
                break;
            }
            case GameRoom.Direction.DIAGONAL_RIGHT: {
                for (let x = first.x, y = first.y; y >= second.y; ++x, --y) {
                    this.field[x][y] = player.number;
                }
                break;
            }
        }
    }

    //TODO
    private turnAnalyze() {
        if (this.currentUserId == this.player1.socket.id) {
            this.currentUserId = this.player2.socket.id;
        } else {
            this.currentUserId = this.player1.socket.id;
        }
    }

    private calculateCheckers() {

    }

    private checkEndGame() {

    }
}

export namespace GameRoom {
    export enum Direction {
        HORIZONTAL,
        VERTICAL,
        DIAGONAL_LEFT,
        DIAGONAL_RIGHT,
    }

    export class Coord {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }
}