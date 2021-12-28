import { render, screen } from '@testing-library/react';
import Home from '../src/Home/Home';

test('renders root', () => {
  render(<Home />);
  const rootElement = screen.getByText(/home/i);
  expect(rootElement).toBeInTheDocument();
});
