import initialState from './initialState';
import { reducer as counterPlusOne } from './counterPlusOne';
import { reducer as counterMinusOne } from './counterMinusOne';

const reducers = [counterPlusOne, counterMinusOne];

export default function reducer(state = initialState, action) {
  let newState;

  switch (action.type) {
    // 在这里放置全局reducer
    default:
      newState = state;
      break;
  }

  // reduce((acc, cur), initialAcc)
  return reducers.reduce(
    (previousState, reducer) => reducer(previousState, action),
    newState
  );
}
