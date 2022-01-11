import { Socket } from "socket.io";
import GameResult from "../constants/GameResult";
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
    private static BASIC_SIZE_FIELD = 8;

    private EMPTY = 0;
    private FIRST_PLAYER = 1;
    private SECOND_PLAYER = 2;
    private AVAILABLE_TURN = 3;
    private TURN_TIME_SEC = 60;

    private timer: NodeJS.Timer;
    private currentTime = this.TURN_TIME_SEC;

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


        this.field[fieldSize / 2 - 1][fieldSize / 2] = this.SECOND_PLAYER;
        this.field[fieldSize / 2][fieldSize / 2 - 1] = this.SECOND_PLAYER;
        this.field[fieldSize / 2 - 1][fieldSize / 2 - 1] = this.FIRST_PLAYER;
        this.field[fieldSize / 2][fieldSize / 2] = this.FIRST_PLAYER;
    }

    public addSecondPlayer(player2: Socket) {
        this.player2 = new Player(player2, this.SECOND_PLAYER);
        this.isWaiting = false;
    }

    public startGame(roomId: string) {
        this.initPlayerSocket(this.player1);
        this.initPlayerSocket(this.player2);
        this.player1.socket.emit('start', { roomId: roomId });
        this.player2.socket.emit('start', { roomId: roomId });
        this.gameAnalyze();
    }

    /**
     * Обработка окончания игры
     * @param additionalDesc - опциональный параметр, в котором коротко описана причина окончания игры
     */
    public endGame(leftPlayer?: Player) {
        this.calculateCheckers();

        let countCheckersP1 = 0;
        let countCheckersP2 = 0;
        countCheckersP1 = countCheckersP1 = this.player1.countCheckers;
        countCheckersP2 = countCheckersP2 = this.player2.countCheckers;

        const lastGameState = {
            field: this.field,
            countCheckersP1: countCheckersP1,
            countCheckersP2: countCheckersP2
        }

        if (!leftPlayer) {
            if (this.player1.countCheckers > this.player2.countCheckers) {
                this.player1.socket.emit(SocketComands.END_GAME, { result: GameResult.VICTORY, lastGameState: lastGameState });
                this.player2.socket.emit(SocketComands.END_GAME, { result: GameResult.LOSE, lastGameState: lastGameState });
            } else if (this.player1.countCheckers < this.player2.countCheckers) {
                this.player1.socket.emit(SocketComands.END_GAME, { result: GameResult.LOSE, lastGameState: lastGameState });
                this.player2.socket.emit(SocketComands.END_GAME, { result: GameResult.VICTORY, lastGameState: lastGameState });
            } else {
                this.player1.socket.emit(SocketComands.END_GAME, { result: GameResult.DRAW, lastGameState: lastGameState });
                this.player2.socket.emit(SocketComands.END_GAME, { result: GameResult.DRAW, lastGameState: lastGameState });
            }
        } else {
            const connectedPlayer = this.player1.socket.id == leftPlayer.socket.id ? this.player2 : this.player1;
            connectedPlayer.socket.emit(SocketComands.END_GAME, { result: GameResult.VICTORY_OPONENT_LEFT, lastGameState: lastGameState });
            leftPlayer.socket.emit(SocketComands.END_GAME, { result: GameResult.LOSE, lastGameState: lastGameState });
        }

        this.player1.socket.removeAllListeners(SocketComands.DISCONNECT);
        this.player2.socket.removeAllListeners(SocketComands.DISCONNECT);
        this.player1.socket.disconnect();
        this.player2.socket.disconnect();
        this.deleteRoom(this.roomId);
    }

    /**
     * Инициализация слушателей сокета игрока
     * @param player - игрок для которого настраивается сокет
     */
    private initPlayerSocket(player: Player) {
        player.socket.on(SocketComands.GAME_TURN, ({ x, y }) => {
            // Проверка на случай если придет ложный запрос о ходе не того игрока
            if (this.currentUserId == player.socket.id) {
                clearTimeout(player.timer);
                this.turnProcess(new GameRoom.Cell(x, y, player.number), player);
            } else {
                console.log("wrong player");
            }
        });
        player.socket.on(SocketComands.GIVE_UP, () => {
            this.endGame(player);
        });
        //TODO по хорошему нужно доделать повторное подключение к существующей игре (в течении минуты)
        player.socket.on(SocketComands.DISCONNECT, () => {
            this.endGame(player);
        });
    }

    private getRandomAvailableTurn(player: Player): GameRoom.Cell {
        const turns = new Array<GameRoom.Cell>();

        for (let i = 0; i < player.field.length; ++i) {
            for (let j = 0; j < player.field[i].length; ++j) {
                if (player.field[i][j] == this.AVAILABLE_TURN) {
                    turns.push(new GameRoom.Cell(i, j, player.number));
                }
            }
        }

        return turns[Math.floor(Math.random() * turns.length)];
    }

    private startPlayerTimer(player: Player) {
        player.timer = setTimeout(() => {
            const cell = this.getRandomAvailableTurn(player);
            this.turnProcess(cell, player);
        }, this.TURN_TIME_SEC * 1000);


        this.currentTime = this.TURN_TIME_SEC;
        clearTimeout(this.timer);
        this.startTimerTimeout();
    }

    private startTimerTimeout() {
        this.timer = setTimeout(() => {
            --this.currentTime;

            if (this.currentTime >= 0) {
                this.player1.socket.emit(SocketComands.TIME_TURN, this.currentTime);
                this.player2.socket.emit(SocketComands.TIME_TURN, this.currentTime);
                this.startTimerTimeout();
            }
        }, 1000);
    }

    /**
     * Обпработка хода. Изменение состояния игры в соответствии с действием игрока (изменение доски, подсчет фишек для каждого игрока)
     * @param playerTurn - координаты точки куда походил игрок
     */
    private turnProcess(playerTurn: GameRoom.Cell, player: Player): void {
        // Изменение доски в соответствии с выбором
        const directionCells = this.getCellsFromEveryDirection(playerTurn);
        const cellsToFlip = this.findRightDirectionCells(directionCells, player);

        for (const cells of cellsToFlip) {
            for (let i = 0; i < cells.length; ++i) {
                this.field[cells[i].x][cells[i].y] = player.number;
            }
        }
        this.field[playerTurn.x][playerTurn.y] = player.number;

        this.gameAnalyze();
    }

    /**
     * Подсчет фишек для каждого игрока
     */
    private calculateCheckers() {
        this.player1.countCheckers = 0;
        this.player2.countCheckers = 0;

        for (let i = 0; i < this.field.length; ++i) {
            for (let j = 0; j < this.field.length; ++j) {
                if (this.field[i][j] == this.FIRST_PLAYER) {
                    ++this.player1.countCheckers;
                } else if (this.field[i][j] == this.SECOND_PLAYER) {
                    ++this.player2.countCheckers;
                }
            }
        }
    }

    //TODO ОПТИМИЗАЦИЯ. Лучше изначально проверить может ли ходить опонент - если нет, то потом проверить сможет ли текущий игрок походить еще раз
    /**
     * Анализ текущего состояния игры - поиск доступных ходов для каждого игрока и решение кому передать ход (по правилам), если ходов нет - игра окончена 
     *
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

        this.startPlayerTimer(this.currentUserId == this.player1.socket.id ? this.player1 : this.player2)
        this.sendGameState();
    }

    /**
     * Отправка информации об игре, после хода - информация о передаче хода, 
     */
    private sendGameState() {
        const dataP1: GameRoom.UserGameState = new GameRoom.UserGameState();
        const dataP2: GameRoom.UserGameState = new GameRoom.UserGameState();

        // Информация о том, сейчас ход
        dataP1.currentPlayer = dataP2.currentPlayer = this.currentUserId == this.player1.socket.id ? this.FIRST_PLAYER : this.SECOND_PLAYER;

        // Информация о поле - тот кто ходит получает поле со списком возможных ходов, другой видит только поле
        dataP1.field = this.currentUserId == this.player1.socket.id ? this.player1.field : this.field;
        dataP2.field = this.currentUserId == this.player2.socket.id ? this.player2.field : this.field;

        // Подсчет количества фишек для каждого игрока
        this.calculateCheckers();
        dataP1.countCheckersP1 = dataP2.countCheckersP1 = this.player1.countCheckers;
        dataP1.countCheckersP2 = dataP2.countCheckersP2 = this.player2.countCheckers;

        dataP1.serverTime = dataP2.serverTime = this.TURN_TIME_SEC;

        this.player1.socket.emit(SocketComands.NEXT_TURN, dataP1);
        this.player2.socket.emit(SocketComands.NEXT_TURN, dataP2);
    }

    //TODO SIDE-EFFECT, одновременно проверка и расстановка подсказок в player.field
    /**
     * Проверка есть ли доступный ход у игрока
     * @param player - игрок для которого ищутся возможные ходы
     * @returns true - есть хоть один доступный ход, false - нету ни одного хода
     */
    private checkAvailableTurns(player: Player): boolean {
        let hasAvailable = false;

        // Нахождение всех пустых ячеек
        const emptyCheckers: Array<GameRoom.Cell> = new Array();
        for (let i = 0; i < this.field.length; ++i) {
            for (let j = 0; j < this.field.length; ++j) {
                if (this.field[i][j] == this.EMPTY) {
                    emptyCheckers.push(new GameRoom.Cell(i, j, this.field[i][j]));
                }
            }
        }

        // Проверка для всех восьми направлений для пустых ячеек
        for (const cell of emptyCheckers) {
            const directionCells: Array<Array<GameRoom.Cell>> = this.getCellsFromEveryDirection(cell);

            if (this.findRightDirectionCells(directionCells, player).length != 0) {
                hasAvailable = true;
                player.field[cell.x][cell.y] = this.AVAILABLE_TURN;
            }
        }

        return hasAvailable;
    }

    /**
     * Нахождение всех клеток для каждого из направлений
     * @param cell - начальная ячейка
     * @returns - массив ячеек для каждого из 8 направлений в виде -> cells[номер направления][номер ячейки]
     */
    private getCellsFromEveryDirection(cell: GameRoom.Cell) {
        let directionCells: Array<Array<GameRoom.Cell>> = new Array<Array<GameRoom.Cell>>(); // 8 направлений

        // Горизонтальное направление до ячейки
        directionCells.push(new Array<GameRoom.Cell>());
        for (let i = cell.y - 1; i >= 0; --i) {
            directionCells[directionCells.length - 1].push(new GameRoom.Cell(cell.x, i, this.field[cell.x][i]));
        }

        // Горизонтальное направление после ячейки
        directionCells.push(new Array<GameRoom.Cell>());
        for (let i = cell.y + 1; i < this.field.length; ++i) {
            directionCells[directionCells.length - 1].push(new GameRoom.Cell(cell.x, i, this.field[cell.x][i]));
        }

        // Вертикальное направление до ячейки
        directionCells.push(new Array<GameRoom.Cell>());
        for (let i = cell.x - 1; i >= 0; --i) {
            directionCells[directionCells.length - 1].push(new GameRoom.Cell(i, cell.y, this.field[i][cell.y]));
        }

        // Вертикальное направление после ячейки
        directionCells.push(new Array<GameRoom.Cell>());
        for (let i = cell.x + 1; i < this.field.length; ++i) {
            directionCells[directionCells.length - 1].push(new GameRoom.Cell(i, cell.y, this.field[i][cell.y]));
        }

        // Левая диагональ - направление от ячейки вверх
        directionCells.push(new Array<GameRoom.Cell>());
        for (let i = cell.x - 1, j = cell.y - 1; i >= 0 && j >= 0; --i, --j) {
            directionCells[directionCells.length - 1].push(new GameRoom.Cell(i, j, this.field[i][j]));
        }

        // Левая диагональ - направление от ячейки вниз
        directionCells.push(new Array<GameRoom.Cell>());
        for (let i = cell.x + 1, j = cell.y + 1; i < this.field.length && j < this.field.length; ++i, ++j) {
            directionCells[directionCells.length - 1].push(new GameRoom.Cell(i, j, this.field[i][j]));
        }

        // Правая диагональ - направление от ячейки вверх
        directionCells.push(new Array<GameRoom.Cell>());
        for (let i = cell.x - 1, j = cell.y + 1; i >= 0 && j < this.field.length; --i, ++j) {
            directionCells[directionCells.length - 1].push(new GameRoom.Cell(i, j, this.field[i][j]));
        }

        // Правая диагональ - направление от ячейки вниз
        directionCells.push(new Array<GameRoom.Cell>());
        for (let i = cell.x + 1, j = cell.y - 1; i < this.field.length && j >= 0; ++i, --j) {
            directionCells[directionCells.length - 1].push(new GameRoom.Cell(i, j, this.field[i][j]));
        }

        return directionCells;
    }

    /**
     * Проверка всех направлений для пустой ячейки, на то возможно ли сделать хол
     * @param directionCells - список ячеек которые находятся на восьми направлениях относительно проверяемой
     * @param player - игрок для которого проверяется возможный ход
     * @returns true - ход возможнен false - ход невозможен
     */
    private findRightDirectionCells(directionCells: Array<Array<GameRoom.Cell>>, player: Player): Array<Array<GameRoom.Cell>> {
        const rightDirectionCells = new Array<Array<GameRoom.Cell>>();
        const oponnentNumber = player.number == this.FIRST_PLAYER ? this.SECOND_PLAYER : this.FIRST_PLAYER;
        let isOpponentFound = false;

        for (const cells of directionCells) {
            isOpponentFound = false;

            for (let i = 0; i < cells.length; ++i) {
                if (cells[i].value == oponnentNumber) {
                    isOpponentFound = true;
                } else if (cells[i].value == this.EMPTY || (cells[i].value == player.number && !isOpponentFound)) {
                    break;
                } else if (cells[i].value == player.number && isOpponentFound) {
                    rightDirectionCells.push(cells.slice(0, i));
                    break;
                }
            }
        }

        return rightDirectionCells;
    }
}

export namespace GameRoom {
    export class Cell {
        x: number;
        y: number;
        value: number;

        constructor(x: number, y: number, value?: number) {
            this.x = x;
            this.y = y;
            this.value = value ?? -1;
        }
    }

    export class UserGameState {
        public field: Number[][];
        public currentPlayer: number;
        public countCheckersP1: number;
        public countCheckersP2: number;
        public serverTime: number;
    }
}