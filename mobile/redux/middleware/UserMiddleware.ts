import axios from "axios";
import { AnyAction, Dispatch, Middleware } from "redux";
import { HOST } from "../../values/global";
import { UserAction, UserStore } from "../types/user";


export const userMiddleware: Middleware<{}, UserStore> = (store) => (next) => (action) => {
    switch (action.type) {
        case UserAction.REGISTRATION: {
            registration(action.payload.googleId, action.payload.username, next);
            break;
        }
        case UserAction.LOGIN: {
            login(action.payload.googleId, next);
            break;
        }
        default: {
            next(action);
        }
    }
}

async function registration(googleId: string, username: string, next: Dispatch<AnyAction>) {
    next({ type: UserAction.LOADING, payload: {} })
    axios.post(`${HOST}/api/reg`, { googleId: googleId, username: username })
        .then(res => {
            const { googleId, username } = res.data;
            next({ type: UserAction.USER_REGISTERED, payload: { googleId: googleId, username: username } })
        })
        .catch(err => {
            const status = err.response.status;
            const message = err.response.data.message;

            if (status === 409) {
                next({ type: UserAction.SET_SERVER_ERROR, payload: { message: message } })
            } else {
                next({ type: UserAction.SET_SERVER_ERROR, payload: { message: "Server error. Please try again later" } })
            }
        })
}

async function login(googleId: string, next: Dispatch<AnyAction>) {
    next({ type: UserAction.LOADING, payload: {} })
    axios.post(`${HOST}/api/login`, { googleId: googleId })
        .then(res => {
            const { googleId, username } = res.data;
            next({ type: UserAction.USER_REGISTERED, payload: { googleId: googleId, username: username } })
        })
        .catch(err => {
            const status = err.response.status;

            if (status === 404) {
                next({ type: UserAction.SET_SERVER_ERROR, payload: { message: "Not found" } })
            } else {
                next({ type: UserAction.SET_SERVER_ERROR, payload: { message: "Server error. Please try again later" } })
            }
        })
}