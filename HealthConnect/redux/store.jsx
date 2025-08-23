import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from './slices/authSlice'

const rootReducer = combineReducers({ 
	auth: authReducer,
})

const persistConfig = {
	key: "root",
	version: 1,
	storage: AsyncStorage,
	whitelist: ['auth']
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
})

export const persistor = persistStore(store)
