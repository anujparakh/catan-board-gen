import { fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders a board and New board deals a different one', () => {
    const { container } = render(<App />);
    const titles = () =>
      [...container.querySelectorAll('svg[aria-label="Catan board"] title')]
        .map((t) => t.textContent)
        .join('|');
    const before = titles();
    expect(before).not.toBe('');
    fireEvent.click(screen.getAllByRole('button', { name: 'New board' })[0]!);
    expect(titles()).not.toBe(before);
  });
});
