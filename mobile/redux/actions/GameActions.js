import GameActionTypes from '../actions/GameActionTypes'

export const connect = function () {
    return { type: GameActionTypes.CONNECT, payload: {} }
}

export const makeTurn = function (x, y) {
    return { type: GameActionTypes.NEXT_TURN, payload: { x: x, y: y } }
}

export const turnTimeOut = function () {
    return { type: GameActionTypes.TURN_TIME_OUT, payload: {} }
}

export const giveUp = function () {
    return { type: GameActionTypes.GIVE_UP, payload: {} }
}

