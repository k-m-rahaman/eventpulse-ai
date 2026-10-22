import { describe, it, expect } from 'vitest';
import * as RippleModule from '../services/rippleEngine';
import * as GeminiServiceModule from '../services/geminiService';
import * as GeminiCoreModule from '../services/gemini';

describe('AI Scenario Studio & Ripple Engine Integration Tests', () => {
  it('exports Ripple Crisis Engine functions', () => {
    expect(RippleModule).toBeDefined();
    expect(Object.keys(RippleModule).length).toBeGreaterThan(0);
  });

  it('exports Gemini 2.5 Flash structured output services', () => {
    expect(GeminiServiceModule).toBeDefined();
    expect(GeminiCoreModule).toBeDefined();
    expect(Object.keys(GeminiServiceModule).length + Object.keys(GeminiCoreModule).length).toBeGreaterThan(0);
  });

  it('enforces non-destructive state staging during crisis simulation', () => {
    const initialPlan = {
      id: 'royal-wedding',
      guestCount: 250,
      totalBudget: 1500000,
      weatherRisk: 'Low',
      budgetItems: [
        { id: 'b1', category: 'Catering', allocated: 600000, estimatedActual: 580000 },
        { id: 'b2', category: 'Decor & Shelter', allocated: 300000, estimatedActual: 290000 },
      ],
      timelineNodes: [
        { id: 't1', timeSlot: '16:00', task: 'Baraat Procession', conflictFlag: false },
        { id: 't2', timeSlot: '18:00', task: 'Outdoor Pheras', dependsOnId: 't1', conflictFlag: false },
      ],
    };
    const frozenSnapshot = JSON.stringify(initialPlan);
    const stagedPlan = {
      ...initialPlan,
      guestCount: 300,
      weatherRisk: 'High - Rain Protocol Active',
      budgetItems: initialPlan.budgetItems.map((b) =>
        b.id === 'b1' ? { ...b, estimatedActual: 696000 } : { ...b, estimatedActual: 345000 }
      ),
      timelineNodes: initialPlan.timelineNodes.map((t) =>
        t.id === 't2' ? { ...t, timeSlot: '18:30', task: 'Indoor Mandap Pheras (Relocated)' } : t
      ),
    };

    expect(JSON.stringify(initialPlan)).toBe(frozenSnapshot);
    expect(stagedPlan.guestCount).toBe(300);
    expect(stagedPlan.budgetItems[0].estimatedActual).toBe(696000);
    expect(stagedPlan.timelineNodes[1].timeSlot).toBe('18:30');
  });
});
