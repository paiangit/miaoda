import { createSlice } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/store';

interface State {
  todoList: string[]
}

const initialState: State = {
  todoList: [],
};

export const todosSlice = createSlice({
  name: 'todosSlice',
  initialState,
  reducers: {
    addTodo(draft, action) {
      draft.todoList.push(action.payload);
    },
    removeTodo(draft, action) {
      draft.todoList.splice(action.payload, 1);
    },
  },
})

export function useAddTodo() {
  const todoList = useSelector((state: RootState) => state.todos.todoList);
  const dispatch = useDispatch();

  return {
    todoList,
    addTodo: useCallback(
      (todo: string) => dispatch(todosSlice.actions.addTodo(todo)),
      [dispatch]
    ),
  }
}

export function useRemoveTodo() {
  const todoList = useSelector((state: RootState) => state.todos.todoList);
  const dispatch = useDispatch();

  return {
    todoList,
    removeTodo: useCallback(
      (index: number) => dispatch(todosSlice.actions.removeTodo(index)),
      [dispatch]
    ),
  }
}

export function useAddTodoAsync() {
  const todoList = useSelector((state: RootState) => state.todos.todoList);
  const dispatch = useDispatch();

  return {
    todoList,
    addTodoAsync: useCallback(
      (todo: string) => {
        setTimeout(() => {
          dispatch(todosSlice.actions.addTodo(todo));
        }, 1000);
      },
      [dispatch],
    )
  }
}
