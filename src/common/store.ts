import { createStore } from 'redux';
import rootReducer from './rootReducer.ts';

function initStore() {
  const store = createStore(rootReducer);

  return store;
}

export default initStore();
