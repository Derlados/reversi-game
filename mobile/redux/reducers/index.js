import { createStore, applyMiddleware, combineReducers } from 'redux';
import dynamicMiddlewares from 'redux-dynamic-middlewares'
import { userMiddleware } from '../middleware/UserMiddleware';
import { gameReducer } from './GameReducer';
import { userReducer } from './UserReducer';

const rootReducer = combineReducers({
    game: gameReducer,
    user: userReducer
})

export const store = createStore(rootReducer, applyMiddleware(
    userMiddleware,
    dynamicMiddlewares
))

