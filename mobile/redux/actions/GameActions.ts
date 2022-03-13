import GameMode from '../../constants/game-modes';
import { GameAction, IGameAction } from '../types/game';

/**
 * 
 * @param {GameModes} gameMode 
 */
export const setGameMode = (gameMode: GameMode): IGameAction => {
    return { type: GameAction.SET_GAME_MODE, payload: { gameMode: gameMode } }
}

export const connect = (): IGameAction => {
    return { type: GameAction.CONNECT, payload: {} }
}

export const makeTurn = (x: number, y: number): IGameAction => {
    return { type: GameAction.NEXT_TURN, payload: { x: x, y: y } }
}

export const giveUp = (): IGameAction => {
    return { type: GameAction.GIVE_UP, payload: {} }
}

export const disconnect = (): IGameAction => {
    return { type: GameAction.DISCONNECT, payload: {} }
}

export const pause = (): IGameAction => {
    return { type: GameAction.PAUSE, payload: {} }
}

export const unpause = (): IGameAction => {
    return { type: GameAction.UNPAUSE, payload: {} }
}
