import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { UserAction } from '../types/user';


const initialStore: UserStore = {
    googleId: '',
    username: '',
    serverError: '',
    isAuthorized: false,
    isRegistered: false
}

export const userReducer = (state: UserStore = initialStore, action: any): UserStore => {
    switch (action.type) {
        case UserAction.SET_USER_DATA: {
            const { googleId, username } = action.payload;
            return { ...state, isAuthorized: true, googleId: googleId, username: username }
        }
        case UserAction.LOADING: {
            return { ...state, serverError: '' }
        }
        case UserAction.USER_REGISTERED: {
            const { googleId, username } = action.payload;
            saveUserData(googleId, username);
            return { ...state, isAuthorized: true, isRegistered: true, googleId: googleId, username: username, serverError: '' }
        }
        case UserAction.SET_SERVER_ERROR: {
            const { message } = action.payload;
            return { ...state, serverError: message }
        }
        default:
            return state;
    }
}

async function saveUserData(googleId: string, username: string) {
    await AsyncStorageLib.setItem("@googleId", googleId.toString());
    await AsyncStorageLib.setItem("@username", username);
}
