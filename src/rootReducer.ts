import { todosSlice } from './features/examples/redux/slice';

const rootReducer = {
  todos: todosSlice.reducer,
};

export default rootReducer;
