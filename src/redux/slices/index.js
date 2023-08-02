import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiHandler} from '../../services/service';
import {combineReducers} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import serviceReducer from './serviceSlice';
import stripeSlice from './stripeSlice';
import userReducer from './userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  service: serviceReducer,
  stripe: stripeSlice,
  [apiHandler.reducerPath]: apiHandler.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'stripe'],
  timeout: null,
};

const root = (state, action) => {
  return persistedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default root;
