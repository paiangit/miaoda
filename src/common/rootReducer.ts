import { combineReducers } from 'redux';
import homeReducer from '../features/examples/redux/reducer.ts';

const reducerMap = {
  home: homeReducer,
};

export default combineReducers(reducerMap);
