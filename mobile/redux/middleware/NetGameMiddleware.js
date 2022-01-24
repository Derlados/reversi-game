import { io } from 'socket.io-client';
import SocketCommands from '../../constants/SocketCommands';
import { HOST } from '../../values/global';
import GameActionTypes from '../actions/GameActionTypes';

let socket;

export const netGameMiddleware = (store) => (next) => (action) => {
    switch (action.type) {
        case GameActionTypes.SET_GAME_MODE: {
            next(action);
            break;
        }
        case GameActionTypes.CONNECT: {
            initSocket(store.getState().user.username, next);
            next(action);
            break;
        }
        case GameActionTypes.NEXT_TURN: {
            const x = action.payload.x;
            const y = action.payload.y;
            socket.emit(SocketCommands.GAME_TURN, { x: x, y: y });
            break;
        }
        case GameActionTypes.GIVE_UP: {
            socket.emit(SocketCommands.GIVE_UP);
            break;
        }
        case GameActionTypes.DISCONNECT: {
            if (socket) {
                socket.disconnect();
                socket = null;
            }

            break;
        }
        default: {
            next(action);
        }
    }
}

function initSocket(username, next) {
    socket = io(HOST, { transports: ['websocket'], query: `username=${username}` });

    socket.on(SocketCommands.START, ({ roomId, username1, username2 }) => {
        next({ type: GameActionTypes.SET_CONNECTION, payload: { roomId: roomId, username1: username1, username2: username2 } });
    });
    socket.on(SocketCommands.NEXT_TURN, (gameState) => {
        next({ type: GameActionTypes.SET_GAME_STATE, payload: gameState });
    });
    socket.on(SocketCommands.TIME_TURN, (time) => {
        next({ type: GameActionTypes.SET_TURN_TIME, payload: { time: time } });
    });
    socket.on(SocketCommands.END_GAME, (data) => {
        next({ type: GameActionTypes.END_GAME, payload: data });
    });
}