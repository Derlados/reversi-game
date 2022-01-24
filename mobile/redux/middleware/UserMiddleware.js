import axios from "axios";
import { HOST } from "../../values/global";
import { setUserData } from "../actions/UserActions";
import UserActionTypes from "../actions/UserActionTypes";


export const userMiddleware = (store) => (next) => (action) => {
    switch (action.type) {
        case UserActionTypes.REGISTRATION: {
            registration(action.payload.googleId, action.payload.username, next);
            break;
        }
        case UserActionTypes.LOGIN: {
            login(action.payload.googleId, next);
            break;
        }
        default: {
            next(action);
        }
    }
}

async function registration(googleId, username, next) {
    next({ type: UserActionTypes.LOADING, payload: {} })
    axios.post(`${HOST}/api/reg`, { googleId: googleId, username: username })
        .then(res => {
            const { googleId, username } = res.data;
            next({ type: UserActionTypes.USER_REGISTERED, payload: { googleId: googleId, username: username } })
        })
        .catch(err => {
            const status = err.response.status;
            const message = err.response.data.message;

            if (status === 409) {
                next({ type: UserActionTypes.SET_SERVER_ERROR, payload: { message: message } })
            } else {
                next({ type: UserActionTypes.SET_SERVER_ERROR, payload: { message: "Server error. Please try again later" } })
            }
        })
}

async function login(googleId, next) {
    next({ type: UserActionTypes.LOADING, payload: {} })
    axios.post(`${HOST}/api/login`, { googleId: googleId })
        .then(res => {
            const { googleId, username } = res.data;
            next({ type: UserActionTypes.USER_REGISTERED, payload: { googleId: googleId, username: username } })
        })
        .catch(err => {
            const status = err.response.status;

            if (status === 404) {
                next({ type: UserActionTypes.SET_SERVER_ERROR, payload: { message: "Not found" } })
            } else {
                next({ type: UserActionTypes.SET_SERVER_ERROR, payload: { message: "Server error. Please try again later" } })
            }
        })
}