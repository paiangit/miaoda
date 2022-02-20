import { combineReducers } from 'redux';
import todosReducer from './features/examples/redux/reducer';

const reducerMap = {
  todos: todosReducer,
};

export default combineReducers(reducerMap);
