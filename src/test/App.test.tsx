import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('EventPulse AI Component & Accessibility Tests', () => {
  it('renders the main application without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
    expect(container.innerHTML.length).toBeGreaterThan(200);
  });

  it('renders interactive navigation buttons and accessible controls', () => {
    const { container } = render(<App />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(2);
  });
});
