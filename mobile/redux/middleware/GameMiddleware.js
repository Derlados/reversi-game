import { io } from 'socket.io-client';
import GameModes from '../../constants/GameModes';
import SocketCommands from '../../constants/SocketCommands';
import GameActionTypes from '../actions/GameActionTypes';
import { GameLogic } from './GameLogic';
import { makeTurn } from '../actions/GameActions';
import Timer from '../../utils/Timer';

// const HOST = 'https://glacial-brushlands-19520.herokuapp.com/';
const HOST = 'http://192.168.1.3:3000';

export const gameMiddleware = (store) => (next) => (action) => {
    switch (action.type) {
        case GameActionTypes.SET_GAME_MODE: {
            next(action);
            break;
        }
        default: {
            if (store.getState().gameMode == GameModes.MULTIPLAYER) {
                networkProcess(store, next, action);
            } else {
                localProcess(store, next, action);
            }
        }
    }
}

const TURN_TIME_SEC = 60;
let currentTime = TURN_TIME_SEC;
let timer;
let gameLogic = new GameLogic();

function localProcess(store, next, action) {
    console.log(action.type);
    switch (action.type) {
        case GameActionTypes.CONNECT: {
            gameLogic = new GameLogic();
            next(action);

            const gameState = gameLogic.getStartState(store.getState());
            next({ type: GameActionTypes.SET_GAME_STATE, payload: { ...gameState, serverTime: TURN_TIME_SEC } });
            startTimer(store, next);
            break;
        }
        case GameActionTypes.NEXT_TURN: {
            timer.pause();
            currentTime = TURN_TIME_SEC;

            const x = action.payload.x;
            const y = action.payload.y;
            const gameState = gameLogic.turnProcess(store.getState(), { x: x, y: y });

            if (!gameState.result) {
                next({ type: GameActionTypes.SET_GAME_STATE, payload: { ...gameState, serverTime: TURN_TIME_SEC } });
                startTimer(store, next);
            } else {
                next({ type: GameActionTypes.END_GAME, payload: gameState });
            }

            break;
        }
        case GameActionTypes.PAUSE: {
            timer.pause();
            break;
        }
        case GameActionTypes.UNPAUSE: {
            timer.resume();
            break;
        }
    }
}

function startTimer(store, next) {
    timer = new Timer(() => {
        --currentTime;
        if (currentTime > 0) {
            next({ type: GameActionTypes.SET_TURN_TIME, payload: { time: currentTime } });
            startTimer(store, next);
        } else if (currentTime == 0) {
            const coord = gameLogic.getRandomAvailableTurn(store.getState());
            store.dispatch(makeTurn(coord.x, coord.y));
        }
    }, 1000);
}

/********************************* NETWORK PROCEING FOR MULTIPLAYER MODE  *********************************/
let socket;
function networkProcess(store, next, action) {
    switch (action.type) {

        case GameActionTypes.CONNECT: {
            initSocket(next);
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
    }
}

function initSocket(next) {
    socket = io(HOST, { transports: ['websocket'] });

    socket.on(SocketCommands.START, (roomId) => {
        next({ type: GameActionTypes.SET_CONNECTION, payload: { roomId: roomId } });
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
