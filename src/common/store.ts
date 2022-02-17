import { createStore } from 'redux';
import rootReducer from './rootReducer';

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;

export default store;
