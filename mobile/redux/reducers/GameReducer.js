import GameActionTypes from '../actions/GameActionTypes'

const initialStore = {
    gameId: '',
    isConnected: false,
    field: [],
    isTurn: false,
    countCheckersP1: 2,
    countCheckersP2: 2
}

const gameReducer = function (state = initialStore, action) {
    switch (action.type) {
        case GameActionTypes.CONNECT: {
            return { ...state, isConnected: false }
        }
        case GameActionTypes.SET_CONNECTION: {
            return { ...state, gameId: action.payload.gameId, isConnected: true }
        }
        case GameActionTypes.SET_GAME_STATE: {
            const gameState = action.payload;
            return { ...state, field: gameState.field, isTurn: gameState.isTurn, countCheckersP1: gameState.countCheckersP1, countCheckersP2: gameState.countCheckersP2 };
        }
        default:
            return state;
    }
}
export default gameReducer;