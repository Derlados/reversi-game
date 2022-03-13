import GameValues from '../../constants/game-values';
import GameMode from '../../constants/game-modes';
import { GameAction, GameStore, IGameAction, IGameState } from '../types/game';

const BASIC_FIELD_SIZE = 4;

const initialStore: GameStore = {
    gameMode: -1,
    roomId: '',
    isConnected: false,
    gameState: {
        field: initField(),
        lastField: initField(),
        currentPlayer: null,
        player1: { username: "player 1", countCheckers: 2 },
        player2: { username: "player 1", countCheckers: 2 },
        result: null,
        serverTime: 0,
    }
}

function initField(fieldSize: number = BASIC_FIELD_SIZE) {
    const field = new Array(fieldSize);
    for (var i = 0; i < fieldSize; ++i) {
        field[i] = new Array(fieldSize);
        for (var j = 0; j < fieldSize; ++j) {
            field[i][j] = GameValues.EMPTY;
        }
    }

    field[fieldSize / 2 - 1][fieldSize / 2] = GameValues.SECOND_PLAYER;
    field[fieldSize / 2][fieldSize / 2 - 1] = GameValues.SECOND_PLAYER;
    field[fieldSize / 2 - 1][fieldSize / 2 - 1] = GameValues.FIRST_PLAYER;
    field[fieldSize / 2][fieldSize / 2] = GameValues.FIRST_PLAYER;

    return field;
}

export const gameReducer = (state: GameStore = initialStore, action: IGameAction): GameStore => {
    switch (action.type) {
        case GameAction.SET_GAME_MODE: {
            return { ...initialStore, gameMode: action.payload.gameMode }
        }
        case GameAction.CONNECT: {
            const isConnected = state.gameMode == GameMode.MULTIPLAYER ? false : true;
            return { ...state, isConnected: isConnected }
        }
        case GameAction.SET_CONNECTION: {
            const { roomId, player1, player2 } = action.payload;
            return { ...state, roomId: roomId, gameState: { ...state.gameState, player1: player1, player2: player2 } };
        }
        case GameAction.SET_GAME_STATE: {
            const gameState: IGameState = action.payload;
            gameState.lastField = state.gameState.field;

            return {
                ...state,
                gameState: gameState
            };
        }
        case GameAction.SET_TURN_TIME: {
            return { ...state, gameState: { ...state.gameState, serverTime: action.payload.time } }
        }
        case GameAction.END_GAME: {
            const finalGameState: IGameState = action.payload;
            finalGameState.lastField = state.gameState.field;

            return {
                ...state,
                gameState: finalGameState
            }
        }
        default:
            return state;
    }
}

