import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import UserActionTypes from '../actions/UserActionTypes';
import { userMiddleware } from '../middleware/UserMiddleware';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

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
            const { googleId, username } = action.payload;
            return { ...state, isAuthorized: true, googleId: googleId, username: username }
        }
        case UserActionTypes.LOADING: {
            return { ...state, serverError: '' }
        }
        case UserActionTypes.USER_REGISTERED: {
            const { googleId, username } = action.payload;
            saveUserData(googleId, username);
            return { ...state, isAuthorized: true, isRegistered: true, googleId: googleId, username: username, serverError: '' }
        }
        case UserActionTypes.SET_SERVER_ERROR: {
            const { message } = action.payload;
            return { ...state, serverError: message }
        }
        default:
            return state;
    }
}

async function saveUserData(googleId, username) {
    await AsyncStorageLib.setItem("@googleId", googleId.toString());
    await AsyncStorageLib.setItem("@username", username);
    console.log(await AsyncStorageLib.getAllKeys());
}
