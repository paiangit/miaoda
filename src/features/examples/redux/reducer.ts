import initialState from './initialState';
import { reducer as addTodo } from './addTodo';
import { reducer as removeTodo } from './removeTodo';

const reducers = [addTodo, removeTodo];

export default function reducer(state = initialState, action) {
  let newState;

  switch (action.type) {
    // 在这里放置全局reducer
    default:
      newState = state;
      break;
  }

  // reduce((acc, cur), initialAcc)
  const result = reducers.reduce(
    (previousState, reducer) => reducer(previousState, action),
    newState
  );

  // 得到的结果是 { todoList: xxx }
  return result;
}
