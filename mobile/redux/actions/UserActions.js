import UserActionTypes from "./UserActionTypes"

export const registration = function (googleId, username) {
    return { type: UserActionTypes.REGISTRATION, payload: { googleId: googleId, username: username } }
}

