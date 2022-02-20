import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../common/store';
import { TODOS_REMOVE_TODO } from './constants';

interface TodosState {
  todoList: string[];
}

// 单个action
export function removeTodo(index) {
  return {
    type: TODOS_REMOVE_TODO,
    payload: index,
  };
}

// 单个reducer
export function reducer(state: TodosState, action) {
  switch (action.type) {
    case TODOS_REMOVE_TODO:
      // 下面这样写会导致页面不更新，原因待研究
      // const newState = {...state};
      // newState.todoList.splice(action.payload, 1); // 主要是这句
      // return newState;
      return {
        ...state,
        todoList: state.todoList.filter((item, index) => index !== action.payload),
      };

    default:
      return state;
  }
}

// 单个hook
export default function useRemoveTodo() {
  const dispatch = useDispatch();
  const todoList = useSelector((state: RootState) => state.todos.todoList);
  const boundAction = useCallback(
    (index) => dispatch(removeTodo(index)),
    [dispatch]
  );

  return {
    todoList,
    removeTodo: boundAction,
  };
}
