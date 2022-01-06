import ActionTypes from '../actions/GameActionTypes';
import { createStore, applyMiddleware } from 'redux';
import { gameMiddleware } from '../middleware/GameMiddleware';
import GameValues from '../../constants/GameValues';

const initialStore = {
    roomId: '',
    isConnected: false,
    field: [],
    lastField: [],
    currentPlayer: GameValues.FIRST_PLAYER,
    serverTime: 0,
    player1Name: 'player 1',
    player2Name: 'player 2',
    countCheckersP1: 2,
    countCheckersP2: 2,
    result: null,
}

const gameReducer = function (state = initialStore, action) {
    switch (action.type) {
        case ActionTypes.CONNECT: {
            return { ...state, isConnected: false }
        }
        case ActionTypes.SET_CONNECTION: {
            return { ...state, roomId: action.payload.roomId, isConnected: true }
        }
        case ActionTypes.SET_GAME_STATE: {
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
        case ActionTypes.SET_TURN_TIME: {
            return { ...state, serverTime: action.payload.time }
        }
        case ActionTypes.END_GAME: {
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
        case ActionTypes.RESET: {
            return initialStore;
        }
        default:
            return state;
    }
}

export const store = createStore(gameReducer, applyMiddleware(gameMiddleware));