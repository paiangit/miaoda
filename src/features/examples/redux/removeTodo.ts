import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { produce } from 'immer';
import { RootState } from '../../../store';
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
export const reducer = produce((draft: TodosState, action) => {
  switch (action.type) {
    case TODOS_REMOVE_TODO:
      draft.todoList.splice(action.payload, 1);
  }
})

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
