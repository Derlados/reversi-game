import GameActionTypes from '../actions/GameActionTypes';
import GameModes from '../../constants/GameModes';

/**
 * 
 * @param {GameModes} gameMode 
 */
export const setGameMode = function (gameMode) {
    return { type: GameActionTypes.SET_GAME_MODE, payload: { gameMode: gameMode } }
}

export const connect = function () {
    return { type: GameActionTypes.CONNECT, payload: {} }
}

export const makeTurn = function (x, y) {
    return { type: GameActionTypes.NEXT_TURN, payload: { x: x, y: y } }
}

export const giveUp = function () {
    return { type: GameActionTypes.GIVE_UP, payload: {} }
}

export const disconnect = function () {
    return { type: GameActionTypes.DISCONNECT, payload: {} }
}

export const pause = function () {
    return { type: GameActionTypes.PAUSE, payload: {} }
}

export const unpause = function () {
    return { type: GameActionTypes.UNPAUSE, payload: {} }
}
