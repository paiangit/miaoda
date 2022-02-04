import { combineReducers } from 'redux';
import homeReducer from '../features/examples/redux/reducer';

const reducerMap = {
  home: homeReducer,
};

export default combineReducers(reducerMap);
