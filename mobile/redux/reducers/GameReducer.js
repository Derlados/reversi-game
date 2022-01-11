import GameActionTypes from '../actions/GameActionTypes';
import { createStore, applyMiddleware } from 'redux';
import { gameMiddleware } from '../middleware/GameMiddleware';
import GameValues from '../../constants/GameValues';
import GameModes from '../../constants/GameModes';

const BASIC_FIELD_SIZE = 8;

const initialStore = {
    gameMode: -1,
    roomId: '',
    isConnected: false,
    field: initField(),
    lastField: initField(),
    currentPlayer: null,
    serverTime: 0,
    player1Name: 'player 1',
    player2Name: 'player 2',
    countCheckersP1: 2,
    countCheckersP2: 2,
    result: null,
}

function initField(fieldSize = BASIC_FIELD_SIZE) {
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

const gameReducer = function (state = initialStore, action) {
    switch (action.type) {
        case GameActionTypes.SET_GAME_MODE: {
            return { ...initialStore, gameMode: action.payload.gameMode }
        }
        case GameActionTypes.CONNECT: {
            const isConnected = state.gameMode == GameModes.MULTIPLAYER ? false : true;
            return { ...state, isConnected: isConnected }
        }
        case GameActionTypes.SET_CONNECTION: {
            return { ...state, roomId: action.payload.roomId, isConnected: true }
        }
        case GameActionTypes.SET_GAME_STATE: {
            const gameState = action.payload;
            const lastField = state.field.length == 0 ? gameState.field : state.field;

            return {
                ...state,
                field: gameState.field,
                lastField: lastField,
                serverTime: gameState.serverTime,
                currentPlayer: gameState.currentPlayer,
                countCheckersP1: gameState.countCheckersP1,
                countCheckersP2: gameState.countCheckersP2
            };
        }
        case GameActionTypes.SET_TURN_TIME: {
            return { ...state, serverTime: action.payload.time }
        }
        case GameActionTypes.END_GAME: {
            const lastGameState = action.payload.lastGameState;
            const lastField = state.field.length == 0 ? lastGameState.field : state.field;

            return {
                ...state,
                result: action.payload.result,
                field: lastGameState.field,
                lastField: lastField,
                countCheckersP1: lastGameState.countCheckersP1,
                countCheckersP2: lastGameState.countCheckersP2
            }
        }
        default:
            return state;
    }
}

export const store = createStore(gameReducer, applyMiddleware(gameMiddleware));