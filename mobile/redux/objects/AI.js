import { GameLogic, Cell } from './GameLogic';
import GameValues from '../../constants/GameValues';

const MEDIUM_PRIORITY = 5;
const HIGH_PRIORITY = 10;

export default class AI {

    constructor() {
        this.priorityMap = [];
        for (let i = 0; i < 8; ++i) {
            this.priorityMap.push([]);
        }

    }

    /**
     * Инициализация маски приоритетов. На углах высокий приоритет, по бокам средний, в середине нулевой
     * @param {number} fieldSize 
     */
    initPriorityMap(fieldSize) {
        for (let i = 0; i < fieldSize; ++i) {
            for (let j = 0; j < fieldSize; ++j) {
                this.priorityMap[i][j] = 0;
            }
        }

        for (let i = 0; i < fieldSize; ++i) {
            this.priorityMap[0][i] = this.priorityMap[fieldSize - 1][i]
                = this.priorityMap[i][0] = this.priorityMap[i][fieldSize - 1] = MEDIUM_PRIORITY;
        }

        this.priorityMap[0][0] = this.priorityMap[fieldSize - 1][0]
            = this.priorityMap[0][fieldSize - 1] = this.priorityMap[fieldSize - 1][fieldSize - 1] = HIGH_PRIORITY;
    }

    /**
     * Установка приоритетов. Приоритет каждй ячейки равен количеству фишек которые закрываются + приоритет по маске. Ячейки
     * на который невозможно походить получаются приоритет -1000
     * @param {GameLogic} gameLogic 
     * @param {Array} field 
     * @param {number} playerNumber 
     */
    setPriorities(gameLogic, field, playerNumber) {
        for (let i = 0; i < field.length; ++i) {
            for (let j = 0; j < field[i].length; ++j) {
                if (field[i][j] == GameValues.AVAILABLE_TURN) {
                    const directionCells = gameLogic.getCellsFromEveryDirection(new Cell(i, j, playerNumber));
                    const cellsToFlip = gameLogic.getCellsToFlip(directionCells, playerNumber);

                    let priority = 0;
                    for (const cells of cellsToFlip) {
                        priority += cells.length;
                    }

                    this.priorityMap[i][j] += priority;
                } else {
                    this.priorityMap[i][j] -= 1000;
                }
            }
        }
    }

    /**
     * Выбор хода. Приоритет отдается ходам, которые переворачиваются максимальное количество фишек, с учетом боковых и угловых позиций
     * @param {GameLogic} gameLogic 
     * @param {Array} field 
     * @param {number} playerNumber 
     */
    chooseTurn(gameLogic, field, playerNumber) {
        this.initPriorityMap(field.length);
        this.setPriorities(gameLogic, field, playerNumber);

        let turn = new Cell(-1, -1, -1);
        for (let i = 0; i < this.priorityMap.length; i++) {
            for (let j = 0; j < this.priorityMap[i].length; ++j) {
                if (this.priorityMap[i][j] > turn.value) {
                    turn = new Cell(i, j, this.priorityMap[i][j]);
                }
            }
        }

        return turn;
    }

}