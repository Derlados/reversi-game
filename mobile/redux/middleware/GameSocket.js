import { io } from 'socket.io-client';
import SocketCommands from '../../constants/SocketCommands';
import GameActionTypes from '../actions/GameActionTypes'

const HOST = 'localhost';
let socket;

export const gameSocket = (store) => (next) => (action) => {
    switch (action.type) {
        case GameActionTypes.CONNECT: {
            initSocket(store);
            next(action);
        }
        case GameActionTypes.NEXT_TURN: {
            const x = action.payload.x;
            const y = action.payload.y;
            socket.emit(SocketCommands.GAME_TURN, { x: x, y: y });
        }
        case GameActionTypes.TURN_TIME_OUT: {
            const coord = findAvailableTurn(store.getState().field);
            socket.emit(SocketCommands.GAME_TURN, coord)
        }
        case GameActionTypes.GIVE_UP: {
            //TODO
            socket.emit(SocketCommands.GIVE_UP);
        }
    }
}

function initSocket(store) {
    socket = io(HOST);

    socket.on(SocketCommands.CONNECTION, function (gameId) {
        store.dispatch({ type: GameActionTypes.SET_CONNECTION, payload: { gameId: gameId } })
    });
    socket.on(SocketCommands.NEXT_TURN, function (gameState) {
        store.dispatch({ type: GameActionTypes.SET_GAME_STATE, payload: gameState })
    })
    socket.on(SocketCommands.END_GAME, function (data) {
        //TODO
    })
}

function findAvailableTurn(field) {
    //TODO
}