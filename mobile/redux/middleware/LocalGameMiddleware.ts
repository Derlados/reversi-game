import GameModes from '../../constants/game-modes';
import GameValues from '../../constants/game-values';
import { Cell, GameLogic } from '../objects/GameLogic';
import AI from '../objects/AI';
import { makeTurn } from '../actions/GameActions';
import Timer from '../../utils/Timer';
import { GameAction, GameStore, IGameAction } from '../types/game';
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { RootState } from '../reducers';
import { MiddlewareStore } from './types';

const TURN_TIME_SEC: number = 60;
let currentTime: number = TURN_TIME_SEC;
let timer: Timer;
let gameLogic = new GameLogic();
const ai = new AI();


export const localGameMiddleware: Middleware<{}, RootState> = (store: MiddlewareStore) => (next) => (action: IGameAction) => {
    const game: GameStore = store.getState().game;

    switch (action.type) {
        case GameAction.SET_GAME_MODE: {
            currentTime = TURN_TIME_SEC;
            timer = null;
            next(action);
            break;
        }
        case GameAction.CONNECT: {
            gameLogic = new GameLogic();
            next(action);

            console.log
            const gameState = gameLogic.getStartState(game.gameState);
            next({ type: GameAction.SET_GAME_STATE, payload: { ...gameState, serverTime: TURN_TIME_SEC } });
            startTimer(store, next);
            break;
        }
        case GameAction.NEXT_TURN: {
            const x = action.payload.x;
            const y = action.payload.y;
            nextTurn(store, next, game, x, y);
            break;
        }
        case GameAction.PAUSE: {
            timer.pause();
            break;
        }
        case GameAction.UNPAUSE: {
            timer.resume();
            break;
        }
        default: {
            next(action);
        }
    }
}

function nextTurn(store: MiddlewareStore, next: Dispatch<AnyAction>, game: GameStore, x: number, y: number) {
    timer.pause();
    currentTime = TURN_TIME_SEC;

    const gameState = gameLogic.turnProcess(game.gameState, new Cell(x, y));

    if (!gameState.result) {
        if (game.gameMode == GameModes.PLAYER_VS_AI && gameState.currentPlayer == GameValues.SECOND_PLAYER) {
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

        next({ type: GameAction.SET_GAME_STATE, payload: { ...gameState, serverTime: TURN_TIME_SEC } });
        startTimer(store, next);
    } else {
        next({ type: GameAction.END_GAME, payload: gameState });
    }

}

function startTimer(store: MiddlewareStore, next: Dispatch<AnyAction>) {
    timer = new Timer(() => {
        --currentTime;
        if (currentTime > 0) {
            next({ type: GameAction.SET_TURN_TIME, payload: { time: currentTime } });
            startTimer(store, next);
        } else if (currentTime == 0) {
            const coord = gameLogic.getRandomAvailableTurn(store.getState().game.gameState);
            store.dispatch(makeTurn(coord.x, coord.y));
        }
    }, 1000);
}
