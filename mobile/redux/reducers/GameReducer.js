import GameActionTypes from '../actions/GameActionTypes';
import { createStore, applyMiddleware } from 'redux';
import { gameMiddleware } from '../middleware/GameMiddleware';

const initialStore = {
    roomId: '',
    isConnected: false,
    field: testInitField(),
    isTurn: false,
    player1Name: 'player 1',
    player2Name: 'player 2',
    countCheckersP1: 2,
    countCheckersP2: 2
}

function testInitField() {
    const EMPTY = 0;
    const FIRST_PLAYER = 1;
    const SECOND_PLAYER = 2;
    const AVAILABLE_TRUN = 3;

    const field = [];
    const fieldSize = 8;

    for (let i = 0; i < fieldSize; ++i) {
        field[i] = [];

        for (let j = 0; j < fieldSize; ++j) {
            field[i][j] = EMPTY;
        }
    }

    field[fieldSize / 2 - 1][fieldSize / 2] = SECOND_PLAYER;
    field[fieldSize / 2][fieldSize / 2 - 1] = SECOND_PLAYER;
    field[fieldSize / 2 - 1][fieldSize / 2 - 1] = FIRST_PLAYER;
    field[fieldSize / 2][fieldSize / 2] = FIRST_PLAYER;

    return field;
}

const gameReducer = function (state = initialStore, action) {
    console.log(action);
    switch (action.type) {
        case GameActionTypes.CONNECT: {
            return { ...state, isConnected: false }
        }
        case GameActionTypes.SET_CONNECTION: {
            return { ...state, roomId: action.payload.roomId, isConnected: true }
        }
        case GameActionTypes.SET_GAME_STATE: {
            const gameState = action.payload;
            return { ...state, field: gameState.field, isTurn: gameState.isTurn, countCheckersP1: gameState.countCheckersP1, countCheckersP2: gameState.countCheckersP2 };
        }
        default:
            return state;
    }
}

export const store = createStore(gameReducer, applyMiddleware(gameMiddleware));