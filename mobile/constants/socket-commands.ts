enum SocketCommands {
    CONNECTION = 'connection',
    START = 'start',
    DISCONNECT = 'disconnect',
    GAME_TURN = 'game_turn',
    TIME_TURN = 'time_turn',
    GAME_TURN_TIMEOUT = 'game_turn_timeout',
    GIVE_UP = 'give_up',
    ERROR_CONNECTION = 'error_connection',
    END_GAME = 'end_game',
    END_GAME_DISCONNECT = 'end_game_disconnect',
    NEXT_TURN = 'next_turn'
}

export default SocketCommands;