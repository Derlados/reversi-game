import GameActionTypes from '../actions/GameActionTypes'

const connect = function () {
    return { type: GameActionTypes.CONNECT, payload: {} }
}

const makeTurn = function (x, y) {
    return { type: GameActionTypes.NEXT_TURN, payload: { x: x, y: y } }
}

const turnTimeOut = function () {
    return { type: GameActionTypes.TURN_TIME_OUT, payload: {} }
}

const giveUp = function () {
    return { type: GameActionTypes.GIVE_UP, payload: {} }
}

