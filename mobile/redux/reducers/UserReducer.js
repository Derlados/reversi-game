import { createStore, applyMiddleware } from 'redux';
import UserActionTypes from '../actions/UserActionTypes';
import { userMiddleware } from '../middleware/UserMiddleware';

const initialStore = {
    googleId: -1,
    username: '',
    serverError: '',
    isAuthorized: false,
    isRegistered: false
}

export const userReducer = function (state = initialStore, action) {
    switch (action.type) {
        case UserActionTypes.SET_USER_DATA: {
            const { googleId, userId } = action.payload;
            return { ...state, isAuthorized: true, isRegistered: true, googleId: googleId, userId: userId }
        }
        case UserActionTypes.SET_SERVER_ERROR: {
            const { message } = action.payload;
            return { ...state, serverError: message }
        }
        default:
            return state;
    }
}

