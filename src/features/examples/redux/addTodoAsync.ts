import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { TODOS_ADD_TODO_ASYNC } from './constants';

// 单个action
export function addTodoAsync(todo) {
  const addTodo = (todo) => {
    return {
      type: TODOS_ADD_TODO_ASYNC,
      payload: todo,
    };
  };

  const validateTodo: Promise<{isValid: boolean}> = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isValid: true,
      });
    }, 3000);
  });

  return dispatch => {
    validateTodo.then(res => {
      const isValid = res.isValid;
      if (!isValid) {
        return;
      }
      dispatch(addTodo(todo));
    });
  };
}

// 单个reducer
export function reducer(state, action) {
  switch (action.type) {
    case TODOS_ADD_TODO_ASYNC:
      return {
        ...state,
        todoList: [...state.todoList, action.payload],
      };

    default:
      return state;
  }
}

// 单个hook
export default function useAddTodoAsync() {
  const dispatch = useDispatch();
  const todoList = useSelector((state: RootState) => state.todos.todoList);
  const boundAction = useCallback((todo) => dispatch(addTodoAsync(todo)), [dispatch]);

  return {
    todoList,
    addTodoAsync: boundAction,
  };
}
