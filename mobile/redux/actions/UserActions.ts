import { IUserAction, UserAction } from "../types/user"

export const registration = function (googleId: string, username: string): IUserAction {
    return { type: UserAction.REGISTRATION, payload: { googleId: googleId, username: username } }
}

export const login = function (googleId: string): IUserAction {
    return { type: UserAction.LOGIN, payload: { googleId: googleId } }
}

export const setUserData = function (googleId: string, username: string): IUserAction {
    return { type: UserAction.SET_USER_DATA, payload: { googleId: googleId, username: username } }
}
