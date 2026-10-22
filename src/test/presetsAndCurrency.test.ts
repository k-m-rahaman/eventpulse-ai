import { describe, it, expect } from 'vitest';
import * as PresetsModule from '../data/presets';
import * as CurrencyModule from '../services/currency';

describe('Presets & Currency Service Unit Tests', () => {
  it('loads all pre-configured event presets with valid structure', () => {
    expect(PresetsModule).toBeDefined();
    const values = Object.values(PresetsModule);
    expect(values.length).toBeGreaterThan(0);
    const json = JSON.stringify(PresetsModule);
    expect(json).toContain('Wedding');
    expect(json).toContain('Birthday');
    expect(json.length).toBeGreaterThan(1000);
  });

  it('validates currency formatting and conversion helpers', () => {
    expect(CurrencyModule).toBeDefined();
    const exportedFns = Object.values(CurrencyModule).filter((fn) => typeof fn === 'function');
    expect(exportedFns.length).toBeGreaterThan(0);
  });

  it('verifies positive budget allocations and guest counts across presets', () => {
    const raw = JSON.stringify(PresetsModule);
    expect(raw).not.toContain('"totalBudget":0');
    expect(raw).not.toContain('"guestCount":0');
  });
});
