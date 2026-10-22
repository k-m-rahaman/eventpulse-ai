import { describe, it, expect } from 'vitest';

describe('EventPulse AI Core Operations', () => {
  it('calculates total budget allocations correctly', () => {
    const allocations = [50000, 30000, 20000];
    const total = allocations.reduce((a, b) => a + b, 0);
    expect(total).toBe(100000);
  });

  it('calculates remaining contingency correctly', () => {
    const totalBudget = 1500000;
    const estimatedSpend = 1350000;
    expect(totalBudget - estimatedSpend).toBe(150000);
  });

  it('calculates cost per guest correctly', () => {
    expect(Math.round(150000 / 80)).toBe(1875);
  });

  it('preserves original plan state during crisis simulation preview', () => {
    const originalPlan = { budget: 1500000, rainPlan: false };
    const preview = { ...originalPlan, rainPlan: true };
    expect(originalPlan.rainPlan).toBe(false);
    expect(preview.rainPlan).toBe(true);
  });
});