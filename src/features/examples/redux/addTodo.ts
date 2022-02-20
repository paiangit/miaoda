import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { TODOS_ADD_TODO } from './constants';

// 单个action
export function addTodo(todo) {
  return {
    type: TODOS_ADD_TODO,
    payload: todo,
  };
}

// 单个reducer
export function reducer(state, action) {
  switch (action.type) {
    case TODOS_ADD_TODO:
      // 为什么下面这样写就洁界面不刷新呢
      // const newState = {...state};
      // newState.todoList.push(action.payload); // 主要是这一句所导致的
      // newState.todoList = [...newState.todoList, action.payload];
      // return newState;
      return {
        ...state,
        todoList: [...state.todoList, action.payload],
      };

    default:
      return state;
  }
}

// 单个hook
export default function useAddTodo() {
  const dispatch = useDispatch();
  const todoList = useSelector((state: RootState) => state.todos.todoList);
  const boundAction = useCallback((todo) => dispatch(addTodo(todo)), [dispatch]);

  return {
    todoList,
    addTodo: boundAction,
  };
}
