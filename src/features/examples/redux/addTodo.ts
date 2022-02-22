import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { produce } from 'immer';
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
export const reducer = produce((draft, action) => {
  switch (action.type) {
    case TODOS_ADD_TODO:
      draft.todoList.push(action.payload);
  }
})

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
