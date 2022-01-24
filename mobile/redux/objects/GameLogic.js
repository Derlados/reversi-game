import GameValues from "../../constants/GameValues";

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
export class GameLogic {
    field;
    player1;
    player2;

    /**
     * Инициализация игроков. У каждого игрока свой номер, кол-во фишек и копия поля. У каждого игрока своя копия, так как для каждого
     * создаются разные подсказки куда можно походить
     * @param {*} state 
     */
    init(state) {
        this.field = state.field.map(arr => arr.slice());

        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                if (this.field[i][j] == GameValues.AVAILABLE_TURN) {
                    this.field[i][j] = GameValues.EMPTY;
                }
            }
        }

        this.player1 = new Player(GameValues.FIRST_PLAYER, state.countCheckersP1);
        this.player2 = new Player(GameValues.SECOND_PLAYER, state.countCheckersP2);
    }

    getStartState(state) {
        this.init(state);
        return this.getNextState(state);
    }

    /**
     * Обпработка хода. Изменение состояния игры в соответствии с действием игрока (изменение доски, подсчет фишек для каждого игрока)
     * @param {*} state - store state
     * @param {{x: number, y: number}} playerTurn - координаты точки куда походил игрок
     * @return
     */
    turnProcess(state, playerTurn) {
        this.init(state);

        // Изменение доски в соответствии с выбором
        const directionCells = this.getCellsFromEveryDirection(playerTurn);
        const cellsToFlip = this.getCellsToFlip(directionCells, state.currentPlayer);

        for (const cells of cellsToFlip) {
            for (let i = 0; i < cells.length; ++i) {
                const x = cells[i].x;
                const y = cells[i].y;
                this.field[x][y] = state.currentPlayer;
            }
        }
        this.field[playerTurn.x][playerTurn.y] = state.currentPlayer;

        return this.getNextState(state);
    }

    getRandomAvailableTurn(state) {
        const turns = new Array();

        for (let i = 0; i < state.field.length; ++i) {
            for (let j = 0; j < state.field[i].length; ++j) {
                if (state.field[i][j] == GameValues.AVAILABLE_TURN) {
                    turns.push(new Cell(i, j, state.number));
                }
            }
        }

        return turns[Math.floor(Math.random() * turns.length)];
    }

    /**
     * Подсчет фишек для каждого игрока
     * @param {Array<Array<number>>} field - поле
     * @returns {Array<number>} - пара значений 
     */
    calculateCheckers() {
        let countCheckersP1 = 0;
        let countCheckersP2 = 0;

        for (let i = 0; i < this.field.length; ++i) {
            for (let j = 0; j < this.field.length; ++j) {
                if (this.field[i][j] == GameValues.FIRST_PLAYER) {
                    ++countCheckersP1;
                } else if (this.field[i][j] == GameValues.SECOND_PLAYER) {
                    ++countCheckersP2;
                }
            }
        }

        return [countCheckersP1, countCheckersP2];
    }

    //TODO ОПТИМИЗАЦИЯ. Лучше изначально проверить может ли ходить опонент - если нет, то потом проверить сможет ли текущий игрок походить еще раз
    /**
     * Анализ текущего состояния игры - поиск доступных ходов для каждого игрока и решение кому передать ход (по правилам), если ходов нет - игра окончена 
     *
     */
    getNextState(state) {
        this.player1.field = this.field.map(arr => arr.slice());
        this.player2.field = this.field.map(arr => arr.slice());

        const [countCheckersP1, countCheckersP2] = this.calculateCheckers();
        const isAvailableTurnsP1 = this.checkAvailableTurns(this.player1);
        const isAvailableTurnsP2 = this.checkAvailableTurns(this.player2);

        // Если у обоих игроков нет допустимых ходов - игра заканчивается
        if (!isAvailableTurnsP1 && !isAvailableTurnsP2) {

            const lastGameState = {
                field: this.player1.field,
                countCheckersP1: countCheckersP1,
                countCheckersP2: countCheckersP2
            }

            return {
                result: countCheckersP1 > countCheckersP2 ? GameValues.FIRST_PLAYER_WIN : GameValues.SECOND_PLAYER_WIN,
                lastGameState: lastGameState
            };
        }

        // Обработку кому передается ход и какое поле с подсказками отрисовать
        let nextPlayer = -1;
        let nextField = {};
        if (state.currentPlayer == GameValues.FIRST_PLAYER && isAvailableTurnsP2) {
            nextPlayer = GameValues.SECOND_PLAYER;
            nextField = this.player2.field;
        } else if (state.currentPlayer == GameValues.SECOND_PLAYER && isAvailableTurnsP1) {
            nextPlayer = GameValues.FIRST_PLAYER;
            nextField = this.player1.field;
        } else if (!state.currentPlayer) {
            nextPlayer = GameValues.FIRST_PLAYER;
            nextField = this.player1.field;
        }

        return {
            currentPlayer: nextPlayer,
            field: nextField,
            countCheckersP1: countCheckersP1,
            countCheckersP2: countCheckersP2
        }
    }

    /**
     * Проверка есть ли доступный ход у игрока
     * @param {Player} player - игрок для которого ищутся возможные ходы
     * @returns true - есть хоть один доступный ход, false - нету ни одного хода
     */
    checkAvailableTurns(player) {
        let hasAvailable = false;

        // Нахождение всех пустых ячеек
        const emptyCells = new Array();
        for (let i = 0; i < this.field.length; ++i) {
            for (let j = 0; j < this.field.length; ++j) {
                if (this.field[i][j] == GameValues.EMPTY) {
                    emptyCells.push(new Cell(i, j, this.field[i][j]));
                }
            }
        }

        // Проверка для всех восьми направлений для пустых ячеек
        for (const cell of emptyCells) {
            const directionCells = this.getCellsFromEveryDirection(cell);

            if (this.getCellsToFlip(directionCells, player.number).length != 0) {
                hasAvailable = true;
                player.field[cell.x][cell.y] = GameValues.AVAILABLE_TURN;
            }
        }

        return hasAvailable;
    }

    /**
     * Нахождение всех клеток для каждого из направлений
     * @param {Array<Array<number>>} field - поле
     * @param {Cell} cell - начальная ячейка
     * @returns - массив ячеек для каждого из 8 направлений в виде -> cells[номер направления][номер ячейки]
     */
    getCellsFromEveryDirection(cell) {
        const directionCells = new Array(); // 8 направлений

        // Горизонтальное направление до ячейки
        directionCells.push(new Array());
        for (let i = cell.y - 1; i >= 0; --i) {
            directionCells[directionCells.length - 1].push(new Cell(cell.x, i, this.field[cell.x][i]));
        }

        // Горизонтальное направление после ячейки
        directionCells.push(new Array());
        for (let i = cell.y + 1; i < this.field.length; ++i) {
            directionCells[directionCells.length - 1].push(new Cell(cell.x, i, this.field[cell.x][i]));
        }

        // Вертикальное направление до ячейки
        directionCells.push(new Array());
        for (let i = cell.x - 1; i >= 0; --i) {
            directionCells[directionCells.length - 1].push(new Cell(i, cell.y, this.field[i][cell.y]));
        }

        // Вертикальное направление после ячейки
        directionCells.push(new Array());
        for (let i = cell.x + 1; i < this.field.length; ++i) {
            directionCells[directionCells.length - 1].push(new Cell(i, cell.y, this.field[i][cell.y]));
        }

        // Левая диагональ - направление от ячейки вверх
        directionCells.push(new Array());
        for (let i = cell.x - 1, j = cell.y - 1; i >= 0 && j >= 0; --i, --j) {
            directionCells[directionCells.length - 1].push(new Cell(i, j, this.field[i][j]));
        }

        // Левая диагональ - направление от ячейки вниз
        directionCells.push(new Array());
        for (let i = cell.x + 1, j = cell.y + 1; i < this.field.length && j < this.field.length; ++i, ++j) {
            directionCells[directionCells.length - 1].push(new Cell(i, j, this.field[i][j]));
        }

        // Правая диагональ - направление от ячейки вверх
        directionCells.push(new Array());
        for (let i = cell.x - 1, j = cell.y + 1; i >= 0 && j < this.field.length; --i, ++j) {
            directionCells[directionCells.length - 1].push(new Cell(i, j, this.field[i][j]));
        }

        // Правая диагональ - направление от ячейки вниз
        directionCells.push(new Array());
        for (let i = cell.x + 1, j = cell.y - 1; i < this.field.length && j >= 0; ++i, --j) {
            directionCells[directionCells.length - 1].push(new Cell(i, j, this.field[i][j]));
        }

        return directionCells;
    }

    /**
     * Проверка всех направлений для пустой ячейки, на то возможно ли сделать хол
     * @param {Array<Array<number>>} directionCells - список ячеек которые находятся на восьми направлениях относительно проверяемой
     * @param {number} player - игрок для которого проверяется возможный ход
     * @returns массив фишек, которые будут перевернуты
     */
    getCellsToFlip(directionCells, player) {
        const rightDirectionCells = new Array();
        const oponnentNumber = player == GameValues.FIRST_PLAYER ? GameValues.SECOND_PLAYER : GameValues.FIRST_PLAYER;

        for (const cells of directionCells) {
            let isOpponentFound = false;

            for (let i = 0; i < cells.length; ++i) {
                if (cells[i].value == oponnentNumber) {
                    isOpponentFound = true;
                } else if (cells[i].value == GameValues.EMPTY || (cells[i].value == player && !isOpponentFound)) {
                    break;
                } else if (cells[i].value == player && isOpponentFound) {
                    rightDirectionCells.push(cells.slice(0, i));
                    break;
                }
            }
        }

        return rightDirectionCells;
    }
}

export class Cell {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value ?? -1;
    }
}

class Player {
    number;
    countCheckers;
    field;

    constructor(number, countCheckers) {
        this.number = number;
        this.countCheckers = countCheckers; // По умолчанию старт с двумя фишками
    }
}