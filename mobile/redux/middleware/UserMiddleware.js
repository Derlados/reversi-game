import axios from "axios";
import { HOST } from "../../values/global";
import UserActionTypes from "../actions/UserActionTypes";


export const userMiddleware = (store) => (next) => (action) => {
    switch (action.type) {
        case UserActionTypes.REGISTRATION: {
            registration(action.payload.googleId, action.payload.username, next);
            break;
        }
        default: {
            next(action);
        }
    }
}

async function registration(googleId, username, next) {

    axios.post(`${HOST}/reg`, { googleId: googleId, username: username })
        .then(res => {
            const { googleId, username } = res.data;
            next({ type: UserActionTypes.SET_USER_DATA, payload: { googleId: googleId, username: username } })
        })
        .catch(err => {
            const status = err.response.status;
            const message = err.response.data.message;

            if (status === 409) {
                next({ type: UserActionTypes.SET_SERVER_ERROR, payload: { message: message } })
            } else {
                next({ type: UserActionTypes.SET_SERVER_ERROR, payload: { message: "Server error. Please try again later." } })
            }
        })
}