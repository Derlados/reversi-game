import { Socket } from "socket.io";
import SocketComands from "../constants/SocketComands";
import Player from "../types/Player";

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
    private static BASIC_SIZE_FIELD = 4;

    private EMPTY = 0;
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
        this.currentUserId = '';
        this.player1 = new Player(player1, this.FIRST_PLAYER);

        this.field = new Array<Array<number>>(fieldSize);
        for (var i = 0; i < fieldSize; ++i) {
            this.field[i] = new Array<number>(fieldSize);
            for (var j = 0; j < fieldSize; ++j) {
                this.field[i][j] = this.EMPTY;
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
        this.initPlayerSocket(this.player1, this.player2);
        this.initPlayerSocket(this.player2, this.player1);
        this.player1.socket.emit('start', { description: `game started, id: ${roomId}`, roomId: roomId });
        this.player2.socket.emit('start', { description: `game started, id: ${roomId}`, roomId: roomId });

        this.gameAnalyze();
    }

    //TODO
    public endGame(additionalDesc?: string) {
        if (this.player1.countCheckers > this.player2.countCheckers) {
            // player1 выиграл 
        } else if (this.player1.countCheckers < this.player2.countCheckers) {
            // player2 выиграл 
        } else {
            // ничья
        }

        this.player1.socket.disconnect();
        this.player2.socket.disconnect();
        this.deleteRoom(this.roomId);
    }

    //TODO
    public endGameDisconnect(disconnectedUser: Socket) {
        if (this.player1.socket.id == disconnectedUser.id) {
            this.endGame(`game ended opponent disconnect`);
        } else {
            this.endGame(`game ended opponent disconnect`);
        }
    }

    //TODO
    private initPlayerSocket(player: Player, opponent: Player) {
        player.socket.on(SocketComands.GAME_TURN, (data: GameRoom.Coord) => {
            // Проверка на случай если придет ложный запрос о ходе не того игрока
            if (this.currentUserId == player.socket.id) {
                this.turnProcess(data, player);
            } else {
                console.log("wrong player");
            }

            this.player2.socket.emit('message', { data: this.player1.socket.id })
        });
        player.socket.on(SocketComands.GIVE_UP, () => {

        });
        player.socket.on(SocketComands.DISCONNECT, () => {
            opponent.socket.removeAllListeners(SocketComands.DISCONNECT); // Удаляется дисконект, 
            this.endGameDisconnect(player.socket);
        });
    }

    /**
     * Обпработка хода. Изменение состояния игры в соответствии с действием игрока (изменение доски, подсчет фишек для каждого игрока)
     * @param playerTurn - координаты точки куда походил игрок
     */
    private turnProcess(playerTurn: GameRoom.Coord, player: Player): void {
        const horCoord = new GameRoom.Coord(playerTurn.x, 0);
        const verCoord = new GameRoom.Coord(0, playerTurn.y);

        const minLeftDimen = Math.min(playerTurn.x, playerTurn.y); // Минимальная размерность 
        const leftDiagCoord = new GameRoom.Coord(playerTurn.x - minLeftDimen, playerTurn.y - minLeftDimen); // (От каждой размерности отнимается минимальная, чтобы найти старт левой диагонали)

        const minRightDimen = Math.min(playerTurn.x, (this.field.length - 1) - playerTurn.y); // Минимальная размерность (Для правой диагонали нужна обратная длина по горизонтали, тянемся к правой стенке)
        const rightDiagCoord = new GameRoom.Coord(playerTurn.x - minRightDimen, playerTurn.y + minRightDimen);

        // Изменение доски в соответствии с выбором
        const size = this.field.length;
        for (let i = 0; i < size; ++i) {
            // Прохлжение по горизонтали
            if (horCoord.y != playerTurn.y && this.field[horCoord.x][horCoord.y] == player.number) {
                this.flipCells(horCoord, playerTurn, GameRoom.Direction.HORIZONTAL, player);
            }
            ++horCoord.y;

            // Прохожение по вертикали
            if (verCoord.x != playerTurn.x && this.field[verCoord.x][verCoord.y] == player.number) {
                this.flipCells(verCoord, playerTurn, GameRoom.Direction.VERTICAL, player);
            }
            ++verCoord.x;

            // Прохожение по левой диагонали
            if (leftDiagCoord.x < size && leftDiagCoord.y < size && leftDiagCoord.x != playerTurn.x && this.field[leftDiagCoord.x][leftDiagCoord.y] == player.number) {
                this.flipCells(leftDiagCoord, playerTurn, GameRoom.Direction.DIAGONAL_LEFT, player);
            }
            ++leftDiagCoord.x;
            ++leftDiagCoord.y;

            // Прохожение по правой диагонали
            if (rightDiagCoord.x < size && rightDiagCoord.y >= 0 && rightDiagCoord.x != playerTurn.x && this.field[rightDiagCoord.x][rightDiagCoord.y] == player.number) {
                this.flipCells(rightDiagCoord, playerTurn, GameRoom.Direction.DIAGONAL_RIGHT, player);
            }
            ++rightDiagCoord.x;
            --rightDiagCoord.y;
        }

        this.calculateCheckers();
        this.gameAnalyze();
    }

    /**
     * Подсчет фишек для каждого игрока
     */
    private calculateCheckers() {

    }

    /**
     * Переворот фишек в ряду
     * @param first - первая фишка
     * @param second - вторая фишка
     * @param dir - направление переворота
     */
    private flipCells(first: GameRoom.Coord, second: GameRoom.Coord, dir: GameRoom.Direction, player: Player): void {
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
    /**
     * Анализ текущего состояния игры - поиск доступных ходов для каждого игрока и решение кому передать ход (по правилам), если ходов нет - игра окончена 
     */
    private gameAnalyze() {
        this.player1.field = this.field.map(arr => arr.slice());
        this.player2.field = this.field.map(arr => arr.slice());

        const isAvailableTurnsP1 = this.checkAvailableTurns(this.player1);
        const isAvailableTurnsP2 = this.checkAvailableTurns(this.player2);

        // Если у обоих игроков нет допустимых ходов - игра заканчивается
        if (!isAvailableTurnsP1 && !isAvailableTurnsP2) {
            this.endGame();
            return;
        }

        // Если возможна передача хода - ход передается
        if (this.currentUserId == this.player1.socket.id && isAvailableTurnsP2) {
            this.currentUserId = this.player2.socket.id;
        } else if (this.currentUserId == this.player2.socket.id && isAvailableTurnsP1) {
            this.currentUserId = this.player1.socket.id;
        } else if (!this.currentUserId) {
            this.currentUserId = this.player1.socket.id;
        }

        //TODO Отправка информации о передачи хода
        this.sendGameState();
    }

    //TODO Отправка информации об игре, после хода - информация о передаче хода, 
    private sendGameState() {
        this.player1.socket.emit('field', this.player1.field);
        this.player2.socket.emit('field', this.player2.field);
    }

    /**
     * Проверка есть ли доступный ход у игрока
     * @param cell 
     * @param player 
     * @returns 
     */
    private checkAvailableTurns(player: Player): boolean {
        let hasAvailable = false;

        // Нахождение всех пустых ячеек
        let emptyCheckers: Array<GameRoom.Coord> = new Array();
        for (let i = 0; i < this.field.length; ++i) {
            for (let j = 0; j < this.field.length; ++j) {
                if (this.field[i][j] == this.EMPTY) {
                    emptyCheckers.push(new GameRoom.Coord(i, j));
                }
            }
        }

        // Проверка для всех восьми направлений для пустых ячеек
        for (const cell of emptyCheckers) {
            let directionCells: Array<Array<number>> = new Array<Array<number>>(); // 8 направлений

            // Горизонтальное направление до ячейки
            directionCells.push(new Array<number>());
            for (let i = cell.y - 1; i >= 0; --i) {
                directionCells[directionCells.length - 1].push(this.field[cell.x][i]);
            }

            // Горизонтальное направление после ячейки
            directionCells.push(new Array<number>());
            for (let i = cell.y + 1; i < this.field.length; ++i) {
                directionCells[directionCells.length - 1].push(this.field[cell.x][i]);
            }

            // Вертикальное направление до ячейки
            directionCells.push(new Array<number>());
            for (let i = cell.x - 1; i >= 0; --i) {
                directionCells[directionCells.length - 1].push(this.field[i][cell.y]);
            }

            // Вертикальное направление после ячейки
            directionCells.push(new Array<number>());
            for (let i = cell.x + 1; i < this.field.length; ++i) {
                directionCells[directionCells.length - 1].push(this.field[i][cell.y]);
            }

            // Левая диагональ - направление до ячейки
            directionCells.push(new Array<number>());
            for (let i = cell.y - 1, j = cell.x - 1; i >= 0 && j >= 0; --i, --j) {
                directionCells[directionCells.length - 1].push(this.field[i][j]);
            }

            // Левая диагональ - направление после ячейки
            directionCells.push(new Array<number>());
            for (let i = cell.y + 1, j = cell.x + 1; i < this.field.length && j < this.field.length; ++i, ++j) {
                directionCells[directionCells.length - 1].push(this.field[i][j]);
            }

            // Правая диагональ - направление до ячейки
            directionCells.push(new Array<number>());
            for (let i = cell.y - 1, j = cell.x + 1; i >= 0 && j < this.field.length; --i, ++j) {
                directionCells[directionCells.length - 1].push(this.field[i][j]);
            }

            // Правая диагональ - направление после ячейки
            directionCells.push(new Array<number>());
            for (let i = cell.y + 1, j = cell.x - 1; i < this.field.length && j >= 0; ++i, --j) {
                directionCells[directionCells.length - 1].push(this.field[i][j]);
            }

            if (this.isHasAvailibleDirection(directionCells, player)) {
                hasAvailable = true;
                player.field[cell.x][cell.y] = 3;
            }
        }

        return hasAvailable;
    }


    private isHasAvailibleDirection(directionCells: Array<Array<number>>, player: Player): boolean {
        const opponentCheckerNum = player.number == this.FIRST_PLAYER ? this.SECOND_PLAYER : this.FIRST_PLAYER;
        let isOpponentFound = false;

        for (const cells of directionCells) {
            for (let i = 0; i < cells.length; ++i) {
                if (cells[i] == opponentCheckerNum) {
                    isOpponentFound = true;
                } else if (cells[i] == this.EMPTY || (cells[i] == player.number && !isOpponentFound)) {
                    break;
                } else if (cells[i] == player.number && isOpponentFound) {
                    return true;
                }
            }
        }

        return false;
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