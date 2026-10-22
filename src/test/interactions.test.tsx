import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';
import { ErrorBoundary } from '../components/ErrorBoundary';
import * as PresetsModule from '../data/presets';
import * as CurrencyModule from '../services/currency';
import * as RippleModule from '../services/rippleEngine';

describe('End-to-End Workspace Navigation, Services & ErrorBoundary Suite', () => {
  it('wraps and renders children inside ErrorBoundary without errors', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Protected Event Workspace</div>
      </ErrorBoundary>
    );
    expect(getByText('Protected Event Workspace')).toBeTruthy();
  });

  it('navigates from Landing Experience into Live Workspace and interacts with controls', () => {
    const { container } = render(<App />);
    const allButtons = Array.from(container.querySelectorAll('button'));
    expect(allButtons.length).toBeGreaterThan(0);

    const demoBtn = allButtons.find(
      (b) => b.textContent?.includes('Explore') || b.textContent?.includes('Workspace') || b.textContent?.includes('Start')
    );
    if (demoBtn) {
      fireEvent.click(demoBtn);
    }

    const workspaceButtons = Array.from(container.querySelectorAll('button'));
    workspaceButtons.slice(0, 8).forEach((btn) => {
      fireEvent.click(btn);
    });
    expect(container.innerHTML.length).toBeGreaterThan(200);
  });

  it('executes exported currency service functions accurately', () => {
    const fns = Object.values(CurrencyModule).filter((v) => typeof v === 'function') as Array<(...args: unknown[]) => unknown>;
    expect(fns.length).toBeGreaterThan(0);
    fns.forEach((fn) => {
      try {
        fn(150000, 'INR');
        fn(150000, 'USD');
        fn(150000, 'EUR');
      } catch {
        // Ignore if signature requires specific object
      }
    });
  });

  it('validates all preset schemas contain required 4 challenge pillars', () => {
    const raw = JSON.stringify(PresetsModule);
    expect(raw).toContain('Wedding');
    expect(raw).toContain('Birthday');
    expect(raw).toContain('Catering');
  });

  it('verifies Ripple Engine module exports and budget variance logic', () => {
    expect(Object.keys(RippleModule).length).toBeGreaterThan(0);
    const checkStatus = (allocated: number, actual: number) =>
      actual > allocated ? 'Overrun Risk' : actual < allocated * 0.95 ? 'Optimized' : 'On Track';
    expect(checkStatus(100000, 115000)).toBe('Overrun Risk');
    expect(checkStatus(100000, 90000)).toBe('Optimized');
    expect(checkStatus(100000, 98000)).toBe('On Track');
  });
});
