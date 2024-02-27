import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import userReducer from './reducers/userReducer'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    userReducer: userReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)
