import UserActionTypes from "./UserActionTypes"

export const registration = function (googleId, username) {
    return { type: UserActionTypes.REGISTRATION, payload: { googleId: googleId, username: username } }
}

export const login = function (googleId) {
    return { type: UserActionTypes.LOGIN, payload: { googleId: googleId } }
}

export const setUserData = function (googleId, username) {
    return { type: UserActionTypes.SET_USER_DATA, payload: { googleId: googleId, username: username } }
}
