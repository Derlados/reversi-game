import GameMode from "../../constants/game-modes";
import GameValues from "../../constants/game-values";

export enum GameAction {
    SET_GAME_MODE = 'SET_GAME_MODE',
    CONNECT = 'CONNECT',
    DISCONNECT = 'DISCONNECT',
    RESTART = 'RESTART',
    SET_GAME_STATE = 'SET_GAME_STATE',
    SET_CONNECTION = 'SET_CONNECTION',
    SET_TURN_TIME = 'SET_TURN_TIME',
    END_GAME = 'END_GAME',
    NEXT_TURN = 'NEXT_TURN',
    GIVE_UP = 'GIVE_UP',
    PAUSE = 'PAUSE',
    UNPAUSE = 'UNPAUSE',
}

export interface IPlayer {
    username: string;
    countCheckers: number;
}

export interface IGameState {
    field: Array<Array<number>>;
    lastField: Array<Array<number>>;
    currentPlayer: number;
    player1: IPlayer;
    player2: IPlayer;
    result: GameValues | null;
    serverTime: number;
}

export interface GameStore {
    gameMode: GameMode;
    roomId: string;
    isConnected: boolean;
    gameState: IGameState;
}

export interface IGameAction {
    type: GameAction,
    payload: any
}