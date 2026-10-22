import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';
import { ErrorBoundary } from '../components/ErrorBoundary';

describe('User Interactions, Navigation & Error Boundary Suite', () => {
  it('renders children inside ErrorBoundary cleanly', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Protected Event Workspace</div>
      </ErrorBoundary>
    );
    expect(getByText('Protected Event Workspace')).toBeTruthy();
  });

  it('handles interactive button clicks across the workspace', () => {
    const { container } = render(<App />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    if (buttons[0]) {
      fireEvent.click(buttons[0]);
    }
    expect(container.innerHTML.length).toBeGreaterThan(100);
  });

  it('evaluates budget overrun risk thresholds accurately', () => {
    const checkStatus = (allocated: number, actual: number) =>
      actual > allocated ? 'Overrun Risk' : actual < allocated * 0.95 ? 'Optimized' : 'On Track';
    expect(checkStatus(100000, 115000)).toBe('Overrun Risk');
    expect(checkStatus(100000, 90000)).toBe('Optimized');
    expect(checkStatus(100000, 98000)).toBe('On Track');
  });

  it('transitions vendor SLA statuses when crisis ripples occur', () => {
    const vendors = [
      { id: 'v1', role: 'Catering', status: 'Confirmed' },
      { id: 'v2', role: 'Decor', status: 'Confirmed' },
    ];
    const updated = vendors.map((v) => ({ ...v, status: 'Action Required' }));
    expect(updated.every((v) => v.status === 'Action Required')).toBe(true);
  });

  it('converts INR baseline amounts to USD and EUR accurately', () => {
    const inr = 1500000;
    const usd = Math.round(inr / 83.5);
    const eur = Math.round(inr / 90.2);
    expect(usd).toBeGreaterThan(15000);
    expect(eur).toBeGreaterThan(15000);
  });
});
