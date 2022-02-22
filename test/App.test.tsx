import { render, screen } from '@testing-library/react';
import App from '../src/App';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';

test('renders root', () => {
  const initialState = { count: 10 };
  const mockStore = configureStore();
  let store = mockStore(initialState);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );

  const rootElement = screen.getByText(/examples/i);
  expect(rootElement).toBeInTheDocument();
});
