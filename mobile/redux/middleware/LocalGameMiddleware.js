import GameModes from '../../constants/GameModes';
import GameActionTypes from '../actions/GameActionTypes';
import GameValues from '../../constants/GameValues';
import { GameLogic } from '../objects/GameLogic';
import AI from '../objects/AI';
import { makeTurn } from '../actions/GameActions';
import Timer from '../../utils/Timer';

const TURN_TIME_SEC = 60;
let currentTime = TURN_TIME_SEC;
let timer;
let gameLogic = new GameLogic();
const ai = new AI();

export const localGameMiddleware = (store) => (next) => (action) => {
    const game = store.getState().game;

    switch (action.type) {
        case GameActionTypes.SET_GAME_MODE: {
            currentTime = TURN_TIME_SEC;
            timer = null;
            next(action);
            break;
        }
        case GameActionTypes.CONNECT: {
            gameLogic = new GameLogic();
            next(action);

            const gameState = gameLogic.getStartState(game);
            next({ type: GameActionTypes.SET_GAME_STATE, payload: { ...gameState, serverTime: TURN_TIME_SEC } });
            startTimer(store, next);
            break;
        }
        case GameActionTypes.NEXT_TURN: {
            timer.pause();
            currentTime = TURN_TIME_SEC;

            const x = action.payload.x;
            const y = action.payload.y;
            const gameState = gameLogic.turnProcess(game, { x: x, y: y });

            if (!gameState.result) {
                if (game.gameMode == GameModes.PLAYER_VS_AI && game.currentPlayer == GameValues.FIRST_PLAYER) {
                    const aiField = gameState.field.map(arr => arr.slice());

                    // Очистка поля, так как ходит ИИ
                    for (let i = 0; i < gameState.field.length; ++i) {
                        for (let j = 0; j < gameState.field[i].length; ++j) {
                            if (gameState.field[i][j] == GameValues.AVAILABLE_TURN) {
                                gameState.field[i][j] = GameValues.EMPTY;
                            }
                        }
                    }

                    // Ход ИИ
                    setTimeout(() => {
                        const turn = ai.chooseTurn(gameLogic, aiField, GameValues.SECOND_PLAYER);
                        store.dispatch(makeTurn(turn.x, turn.y));
                    }, Math.floor(Math.random() * 2 + 1) * 1000);
                }

                next({ type: GameActionTypes.SET_GAME_STATE, payload: { ...gameState, serverTime: TURN_TIME_SEC } });
                startTimer(store, next);
            } else {
                next({ type: GameActionTypes.END_GAME, payload: gameState });
            }

            break;
        }
        case GameActionTypes.PAUSE: {
            timer.pause();
            break;
        }
        case GameActionTypes.UNPAUSE: {
            timer.resume();
            break;
        }
    }
}

function startTimer(store, next) {
    timer = new Timer(() => {
        --currentTime;
        if (currentTime > 0) {
            next({ type: GameActionTypes.SET_TURN_TIME, payload: { time: currentTime } });
            startTimer(store, next);
        } else if (currentTime == 0) {
            const coord = gameLogic.getRandomAvailableTurn(store.getState().game);
            store.dispatch(makeTurn(coord.x, coord.y));
        }
    }, 1000);
}
