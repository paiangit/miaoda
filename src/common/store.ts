import { createStore } from 'redux';
import rootReducer from './rootReducer';

function initStore() {
  const store = createStore(rootReducer);

  return store;
}

export default initStore();
