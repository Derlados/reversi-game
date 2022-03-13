export enum UserAction {
    REGISTRATION = 'REGISTRATION',
    SET_USER_DATA = 'SET_USER_DATA',
    SET_SERVER_ERROR = 'SET_SERVER_ERROR',
    USER_REGISTERED = 'USER_REGISTERED',
    LOADING = 'LOADING',
    LOGIN = 'LOGIN'
}

export interface IUserAction {
    type: UserAction;
    payload: any;
}

export interface UserStore {
    googleId: string;
    username: string;
    serverError: string;
    isAuthorized: boolean;
    isRegistered: boolean;
}
