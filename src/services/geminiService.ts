import { EventPlan, BudgetCategory, TimelineNode, Vendor, IntakeParams, CurrencyType } from '../types/event';
import { formatCurrency } from './currency';

export const GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface DualEngineRippleResult {
  updatedPlan: EventPlan;
  budgetChangesCount: number;
  timelineChangesCount: number;
  vendorNoticesCount: number;
  aiRippleSummary: string[];
  explanation: string;
  triggerName: string;
}

// Strict Gemini responseSchema for Engine A (Event Architect)
const EVENT_ARCHITECT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    name: { type: 'STRING' },
    type: { type: 'STRING' },
    date: { type: 'STRING' },
    guestCount: { type: 'NUMBER' },
    totalBudget: { type: 'NUMBER' },
    currency: { type: 'STRING' },
    venue: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING' },
        type: { type: 'STRING' },
        capacity: { type: 'NUMBER' },
        location: { type: 'STRING' },
        isRainSheltered: { type: 'BOOLEAN' },
      },
      required: ['name', 'type', 'capacity', 'location', 'isRainSheltered'],
    },
    weatherCondition: { type: 'STRING' },
    themeVibe: { type: 'STRING' },
    budgetCategories: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'STRING' },
          category: { type: 'STRING' },
          allocated: { type: 'NUMBER' },
          estimatedActual: { type: 'NUMBER' },
          status: { type: 'STRING' },
          aiCostSavingTip: { type: 'STRING' },
          notes: { type: 'STRING' },
        },
        required: ['id', 'category', 'allocated', 'estimatedActual', 'status', 'aiCostSavingTip', 'notes'],
      },
    },
    timelineNodes: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'STRING' },
          title: { type: 'STRING' },
          timeSlot: { type: 'STRING' },
          phase: { type: 'STRING' },
          category: { type: 'STRING' },
          owner: { type: 'STRING' },
          dependsOn: { type: 'ARRAY', items: { type: 'STRING' } },
          hasConflict: { type: 'BOOLEAN' },
          conflictWarning: { type: 'STRING' },
          status: { type: 'STRING' },
          notes: { type: 'STRING' },
          isOutdoorDependent: { type: 'BOOLEAN' },
        },
        required: ['id', 'title', 'timeSlot', 'phase', 'category', 'owner', 'status', 'notes', 'isOutdoorDependent'],
      },
    },
    vendors: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'STRING' },
          name: { type: 'STRING' },
          role: { type: 'STRING' },
          contactPerson: { type: 'STRING' },
          email: { type: 'STRING' },
          phone: { type: 'STRING' },
          slaDeadline: { type: 'STRING' },
          paymentMilestone: { type: 'STRING' },
          amount: { type: 'NUMBER' },
          autoDraftedMessage: { type: 'STRING' },
        },
        required: ['id', 'name', 'role', 'contactPerson', 'slaDeadline', 'paymentMilestone', 'amount'],
      },
    },
    ideation: {
      type: 'OBJECT',
      properties: {
        decorMoodboard: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              id: { type: 'STRING' },
              title: { type: 'STRING' },
              vibe: { type: 'STRING' },
              description: { type: 'STRING' },
              colorHexes: { type: 'ARRAY', items: { type: 'STRING' } },
              costImpact: { type: 'STRING' },
              tags: { type: 'ARRAY', items: { type: 'STRING' } },
              imagePlaceholder: { type: 'STRING' },
            },
            required: ['id', 'title', 'vibe', 'description', 'colorHexes', 'costImpact', 'tags'],
          },
        },
        dietaryMenu: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              id: { type: 'STRING' },
              dish: { type: 'STRING' },
              course: { type: 'STRING' },
              dietary: { type: 'ARRAY', items: { type: 'STRING' } },
              costPerHead: { type: 'NUMBER' },
              aiPairingNotes: { type: 'STRING' },
            },
            required: ['id', 'dish', 'course', 'dietary', 'costPerHead', 'aiPairingNotes'],
          },
        },
        guestEngagement: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              id: { type: 'STRING' },
              activity: { type: 'STRING' },
              targetAudience: { type: 'STRING' },
              duration: { type: 'STRING' },
              costImpact: { type: 'STRING' },
              engagementScore: { type: 'NUMBER' },
              notes: { type: 'STRING' },
            },
            required: ['id', 'activity', 'targetAudience', 'duration', 'costImpact', 'engagementScore', 'notes'],
          },
        },
        sustainabilitySwaps: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              id: { type: 'STRING' },
              standardItem: { type: 'STRING' },
              ecoSwap: { type: 'STRING' },
              co2Saved: { type: 'STRING' },
              costDelta: { type: 'STRING' },
              status: { type: 'STRING' },
            },
            required: ['id', 'standardItem', 'ecoSwap', 'co2Saved', 'costDelta', 'status'],
          },
        },
      },
      required: ['decorMoodboard', 'dietaryMenu', 'guestEngagement', 'sustainabilitySwaps'],
    },
  },
  required: ['name', 'type', 'date', 'guestCount', 'totalBudget', 'currency', 'venue', 'budgetCategories', 'timelineNodes', 'vendors', 'ideation'],
};

// Strict Gemini responseSchema for Engine B (Ripple & Crisis Simulator)
const RIPPLE_SIMULATOR_SCHEMA = {
  type: 'OBJECT',
  properties: {
    explanation: { type: 'STRING' },
    aiRippleSummary: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Top 4 cross-functional fixes applied across Budget, Timeline, Vendor SLAs and Ideation',
    },
    weatherCondition: { type: 'STRING' },
    venueUpdate: {
      type: 'OBJECT',
      properties: {
        type: { type: 'STRING' },
        name: { type: 'STRING' },
        isRainSheltered: { type: 'BOOLEAN' },
      },
    },
    budgetCategories: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'STRING' },
          category: { type: 'STRING' },
          allocated: { type: 'NUMBER' },
          estimatedActual: { type: 'NUMBER' },
          status: { type: 'STRING' },
          aiCostSavingTip: { type: 'STRING' },
          notes: { type: 'STRING' },
          wasUpdated: { type: 'BOOLEAN' },
          deltaChange: { type: 'STRING' },
          changeReason: { type: 'STRING' },
        },
        required: ['id', 'category', 'allocated', 'estimatedActual', 'status'],
      },
    },
    timelineNodes: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'STRING' },
          title: { type: 'STRING' },
          timeSlot: { type: 'STRING' },
          phase: { type: 'STRING' },
          category: { type: 'STRING' },
          owner: { type: 'STRING' },
          dependsOn: { type: 'ARRAY', items: { type: 'STRING' } },
          hasConflict: { type: 'BOOLEAN' },
          conflictWarning: { type: 'STRING' },
          status: { type: 'STRING' },
          notes: { type: 'STRING' },
          isOutdoorDependent: { type: 'BOOLEAN' },
          wasUpdated: { type: 'BOOLEAN' },
          changeReason: { type: 'STRING' },
        },
        required: ['id', 'title', 'timeSlot', 'hasConflict', 'status'],
      },
    },
    vendors: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'STRING' },
          name: { type: 'STRING' },
          role: { type: 'STRING' },
          contactPerson: { type: 'STRING' },
          email: { type: 'STRING' },
          phone: { type: 'STRING' },
          slaDeadline: { type: 'STRING' },
          paymentMilestone: { type: 'STRING' },
          amount: { type: 'NUMBER' },
          actionRequiredReason: { type: 'STRING' },
          autoDraftedMessage: { type: 'STRING' },
          wasUpdated: { type: 'BOOLEAN' },
          changeReason: { type: 'STRING' },
        },
        required: ['id', 'name', 'paymentMilestone', 'autoDraftedMessage'],
      },
    },
  },
  required: ['explanation', 'aiRippleSummary', 'budgetCategories', 'timelineNodes', 'vendors'],
};

// ============================================================================
// ENGINE A: NEW EVENT ARCHITECT
// ============================================================================
export async function generateEventPlanFromIntake(
  params: IntakeParams,
  apiKey?: string
): Promise<EventPlan> {
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are EventPulse AI Architect. Design a production-ready, highly granular celebration operating plan for:
Event Type: ${params.eventType}
Event Title: ${params.eventTitle}
Guest Count: ${params.guestCount}
Total Budget: ${params.totalBudget} ${params.currency}
Venue Preference: ${params.venueStyle}
Special Requirements: ${params.specialRequirements || 'None'}

Return a fully populated JSON adhering strictly to responseSchema with realistic vendors, timeline nodes with dependencies, budget line items, and cultural/thematic concepts. Zero placeholders.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: EVENT_ARCHITECT_SCHEMA,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return {
            id: `plan-${Date.now()}`,
            name: parsed.name || params.eventTitle,
            type: (parsed.type as EventPlan['type']) || 'custom',
            date: parsed.date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            guestCount: parsed.guestCount || params.guestCount,
            totalBudget: parsed.totalBudget || params.totalBudget,
            currency: params.currency,
            venue: parsed.venue || {
              name: `${params.venueStyle} Grand Venue`,
              type: 'hybrid',
              capacity: params.guestCount * 1.3,
              location: 'Metropolitan City',
              isRainSheltered: true,
            },
            weatherCondition: (parsed.weatherCondition as EventPlan['weatherCondition']) || 'Sunny & Clear',
            themeVibe: parsed.themeVibe || `${params.venueStyle} Contemporary Luxury`,
            budgetCategories: parsed.budgetCategories || [],
            timelineNodes: parsed.timelineNodes || [],
            vendors: (parsed.vendors || []).map((v: any) => ({
              ...v,
              currency: params.currency,
              lastNoticeGenerated: v.autoDraftedMessage
                ? {
                    timestamp: 'Just now',
                    trigger: 'Initial Scope Assignment',
                    subject: `Welcome & Scope Brief: ${v.role}`,
                    message: v.autoDraftedMessage,
                    sent: true,
                  }
                : undefined,
            })),
            ideation: parsed.ideation || {
              decorMoodboard: [],
              dietaryMenu: [],
              guestEngagement: [],
              sustainabilitySwaps: [],
            },
            meta: {
              isDiffActive: false,
            },
          };
        }
      }
    } catch (err) {
      console.warn('Gemini 2.5 Flash Architect call failed; utilizing bulletproof deterministic generator:', err);
    }
  }

  // Bulletproof Deterministic Local AI Architect Fallback
  return generateDeterministicEventPlan(params);
}

// ============================================================================
// ENGINE B: RIPPLE-EFFECT CRISIS & CHANGE SIMULATOR
// ============================================================================
export async function simulateRippleEffect(
  currentPlan: EventPlan,
  disruptionPrompt: string,
  apiKey?: string
): Promise<DualEngineRippleResult> {
  // If API key is present and valid, attempt official Gemini 2.5 Flash REST fetch
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are EventPulse AI Agentic Crisis Engine.
Analyze this disruption: "${disruptionPrompt}"
Against this current plan:
${JSON.stringify({
  guestCount: currentPlan.guestCount,
  totalBudget: currentPlan.totalBudget,
  currency: currentPlan.currency,
  venue: currentPlan.venue,
  weatherCondition: currentPlan.weatherCondition,
  budgetCategories: currentPlan.budgetCategories.map(b => ({ id: b.id, category: b.category, allocated: b.allocated, estimatedActual: b.estimatedActual, status: b.status })),
  timelineNodes: currentPlan.timelineNodes.map(t => ({ id: t.id, title: t.title, timeSlot: t.timeSlot, dependsOn: t.dependsOn, isOutdoorDependent: t.isOutdoorDependent })),
  vendors: currentPlan.vendors.map(v => ({ id: v.id, name: v.name, role: v.role, contactPerson: v.contactPerson, amount: v.amount, paymentMilestone: v.paymentMilestone }))
})}

Determine dynamic ripple updates:
1. Update affected budgetCategories (recalculate estimatedActual, set status, deltaChange string e.g. "+₹45,000", aiCostSavingTip, mark wasUpdated: true, changeReason).
2. Shift dependent timelineNodes (update timeSlot, set hasConflict/conflictWarning, mark wasUpdated: true, changeReason).
3. Update vendors (mark affected as "Action Required", write specific autoDraftedMessage addressing the disruption, mark wasUpdated: true, changeReason).
4. Return an aiRippleSummary array listing the top 4 cross-functional fixes.
Follow the JSON schema strictly.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: RIPPLE_SIMULATOR_SCHEMA,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return mergeGeminiRippleOutput(currentPlan, disruptionPrompt, parsed);
        }
      }
    } catch (err) {
      console.warn('Gemini 2.5 Flash Ripple call failed; falling back to deterministic local AI engine:', err);
    }
  }

  // Bulletproof Deterministic Local AI Ripple Engine
  return executeDeterministicLocalRipple(currentPlan, disruptionPrompt);
}

// ============================================================================
// BULLETPROOF DETERMINISTIC FALLBACK LOGIC
// ============================================================================

export function executeDeterministicLocalRipple(
  currentPlan: EventPlan,
  disruptionPrompt: string
): DualEngineRippleResult {
  const pLower = disruptionPrompt.toLowerCase();
  const baseline = currentPlan.meta.baselinePlan || currentPlan;

  // SCENARIO 1: Rain / Weather Out
  if (pLower.includes('rain') || pLower.includes('weather') || pLower.includes('storm')) {
    let bCount = 0;
    let tCount = 0;
    let vCount = 0;

    const updatedBudget: BudgetCategory[] = currentPlan.budgetCategories.map((cat) => {
      const id = cat.id.toLowerCase();
      if (id.includes('contingency')) {
        bCount++;
        const delta = 30000;
        return {
          ...cat,
          estimatedActual: cat.estimatedActual + delta,
          status: 'Overrun Risk',
          wasUpdated: true,
          deltaChange: `+${formatCurrency(delta, currentPlan.currency)}`,
          changeReason: 'Emergency indoor ballroom transit & canopy anchors',
          aiCostSavingTip: 'Deploy pre-negotiated inclement weather clause to freeze equipment transport surcharges.',
        };
      }
      if (id.includes('decor') || id.includes('stage')) {
        bCount++;
        const delta = 15000;
        return {
          ...cat,
          estimatedActual: cat.estimatedActual + delta,
          status: 'Overrun Risk',
          wasUpdated: true,
          deltaChange: `+${formatCurrency(delta, currentPlan.currency)}`,
          changeReason: 'Indoor ballroom drapery & moisture-proof stage runners',
          aiCostSavingTip: 'Repurpose courtyard marigold arches as foyer photo backdrops.',
        };
      }
      return { ...cat, wasUpdated: false };
    });

    const updatedTimeline: TimelineNode[] = currentPlan.timelineNodes.map((node) => {
      if (node.isOutdoorDependent) {
        tCount++;
        return {
          ...node,
          hasConflict: true,
          conflictWarning: '⚠️ WEATHER RELOCATION: Moved to Sheltered Ballroom / Portico. Shifted +20m.',
          notes: `${node.notes} [RAIN PROTOCOL: Relocated indoors with safety check]`,
          wasUpdated: true,
          changeReason: 'Relocated indoors due to rain alert; +20m canopy buffer',
        };
      }
      return { ...node, wasUpdated: false };
    });

    const updatedVendors: Vendor[] = currentPlan.vendors.map((vendor) => {
      const role = vendor.role.toLowerCase();
      if (role.includes('decor') || role.includes('stage')) {
        vCount++;
        const autoMsg = `Hi ${vendor.contactPerson}, sudden rain triggered our emergency indoor setup. Please halt outdoor lawn rigging immediately and deploy the mandap/stage in the covered Ballroom. Weather canopy crew on standby. Confirm arrival at indoor dock within 15 mins.`;
        return {
          ...vendor,
          paymentMilestone: 'Action Required',
          actionRequiredReason: 'Urgent: Relocate stage & floral frames to covered ballroom',
          autoDraftedMessage: autoMsg,
          wasUpdated: true,
          changeReason: 'Immediate indoor relocation directive',
          lastNoticeGenerated: {
            timestamp: 'Just now (Auto-Agent)',
            trigger: 'Rain Protocol Activation',
            subject: '🚨 URGENT: Deploy Rain Shelter Plan — Relocate Setup Indoors',
            message: autoMsg,
            sent: false,
          },
        };
      }
      if (role.includes('sound') || role.includes('av') || role.includes('dj')) {
        vCount++;
        const autoMsg = `Hi ${vendor.contactPerson}, safety alert: all line arrays and console mixers must be covered and relocated into the indoor hall immediately to prevent water damage. Please recalibrate limiter for indoor acoustic reflections.`;
        return {
          ...vendor,
          paymentMilestone: 'Action Required',
          actionRequiredReason: 'Cover electricals & move mixer to portico',
          autoDraftedMessage: autoMsg,
          wasUpdated: true,
          changeReason: 'Acoustic & electrical water safety precautions',
          lastNoticeGenerated: {
            timestamp: 'Just now (Auto-Agent)',
            trigger: 'Rain Protocol Activation',
            subject: '⚡ CRITICAL SOUND SAFETY: Cover Electricals & Relocate',
            message: autoMsg,
            sent: false,
          },
        };
      }
      if (role.includes('cater') || role.includes('bar')) {
        vCount++;
        const autoMsg = `Dear ${vendor.contactPerson}, please shift all live appetizer and cocktail stations under the sheltered colonnade veranda immediately. Buffet counters open on time.`;
        return {
          ...vendor,
          autoDraftedMessage: autoMsg,
          wasUpdated: true,
          changeReason: 'Moved live counters to covered veranda',
          lastNoticeGenerated: {
            timestamp: 'Just now (Auto-Agent)',
            trigger: 'Rain Protocol Activation',
            subject: '🍽️ Catering Layout Shift: Move Live Counters Indoors',
            message: autoMsg,
            sent: false,
          },
        };
      }
      return { ...vendor, wasUpdated: false };
    });

    const aiRippleSummary = [
      'Activated indoor ballroom backup with 100% rain sheltering',
      'Unlocked ₹45,000 contingency for waterproof trussing & indoor drapery',
      'Flagged 4 outdoor timeline nodes with +20m dry-run conflict alerts',
      'Generated urgent WhatsApp relocation orders to Decor, AV, and Catering partners',
    ];

    const updatedPlan: EventPlan = {
      ...currentPlan,
      weatherCondition: 'Rain Forecast',
      venue: {
        ...currentPlan.venue,
        type: 'indoor',
        isRainSheltered: true,
        name: `${currentPlan.venue.name} (Indoor Transition)`,
      },
      budgetCategories: updatedBudget,
      timelineNodes: updatedTimeline,
      vendors: updatedVendors,
      meta: {
        ...currentPlan.meta,
        isDiffActive: true,
        baselinePlan: baseline,
        aiRippleSummary,
        lastRippleTrigger: disruptionPrompt,
        lastRippleSummary: {
          triggerName: '🌧️ Sudden Rain: Move Outdoor Venue Indoors',
          budgetChangesCount: bCount,
          timelineChangesCount: tCount,
          vendorNoticesCount: vCount,
          explanation: 'Weather protocol engaged: Ceremonies relocated indoors, contingency unlocked for canopy anchors, and emergency directives dispatched to all production vendors.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      },
    };

    return {
      updatedPlan,
      budgetChangesCount: bCount,
      timelineChangesCount: tCount,
      vendorNoticesCount: vCount,
      aiRippleSummary,
      explanation: 'Weather protocol engaged: Outdoor setups transitioned into indoor halls, contingency funds unlocked, and urgent vendor outreach drafted.',
      triggerName: '🌧️ Sudden Rain: Move Outdoor Venue Indoors',
    };
  }

  // SCENARIO 2: Guest Count Jump (+50 guests)
  if (pLower.includes('guest') || pLower.includes('pax') || pLower.includes('headcount') || pLower.includes('attendee')) {
    const match = disruptionPrompt.match(/\b\d+\b/);
    const added = match ? parseInt(match[0], 10) : 50;
    const finalGuests = currentPlan.guestCount + added;
    const costPerHead = currentPlan.type === 'wedding' ? 1680 : currentPlan.type === 'birthday' ? 650 : 250;
    const cateringDelta = added * costPerHead;
    const logisticsDelta = 12000;

    let bCount = 0;
    let tCount = 0;
    let vCount = 0;

    const updatedBudget: BudgetCategory[] = currentPlan.budgetCategories.map((cat) => {
      const id = cat.id.toLowerCase();
      if (id.includes('cater') || id.includes('bar')) {
        bCount++;
        return {
          ...cat,
          estimatedActual: cat.estimatedActual + cateringDelta,
          status: 'Overrun Risk',
          wasUpdated: true,
          deltaChange: `+${formatCurrency(cateringDelta, currentPlan.currency)}`,
          changeReason: `Headcount jump +${added} pax (${formatCurrency(costPerHead, currentPlan.currency)}/plate)`,
          aiCostSavingTip: 'Lock fixed buffet top-up rates instead of adding redundant live counters.',
        };
      }
      if (id.includes('logistics') || id.includes('venue') || id.includes('stalls')) {
        bCount++;
        return {
          ...cat,
          estimatedActual: cat.estimatedActual + logisticsDelta,
          status: 'Overrun Risk',
          wasUpdated: true,
          deltaChange: `+${formatCurrency(logisticsDelta, currentPlan.currency)}`,
          changeReason: `Additional 5 round tables & ${added} Chiavari chairs`,
          aiCostSavingTip: 'Borrow banquet inventory from partner hotel wing to waive rental markups.',
        };
      }
      return { ...cat, wasUpdated: false };
    });

    const updatedTimeline: TimelineNode[] = currentPlan.timelineNodes.map((node) => {
      const t = node.title.toLowerCase();
      if (t.includes('dinner') || t.includes('lunch') || t.includes('buffet') || t.includes('tapas')) {
        tCount++;
        return {
          ...node,
          timeSlot: `${node.timeSlot.split('-')[0].trim()} - 11:45 PM (+30m)`,
          notes: `${node.notes} [EXTENDED DINING: +30 mins to prevent buffet queues for ${finalGuests} pax]`,
          wasUpdated: true,
          changeReason: `Extended dining window for +${added} guests`,
        };
      }
      if (t.includes('arrival') || t.includes('baraat') || t.includes('gates')) {
        tCount++;
        return {
          ...node,
          notes: `${node.notes} [REGISTRATION EXPANSION: Added 2 check-in stations & valet crew for ${finalGuests} pax]`,
          wasUpdated: true,
          changeReason: 'Doubled registration lanes for late attendee surge',
        };
      }
      return { ...node, wasUpdated: false };
    });

    const updatedVendors: Vendor[] = currentPlan.vendors.map((vendor) => {
      const role = vendor.role.toLowerCase();
      if (role.includes('cater') || role.includes('kitchen') || role.includes('food')) {
        vCount++;
        const autoMsg = `Dear ${vendor.contactPerson}, RSVP update: Headcount has increased from ${currentPlan.guestCount} to ${finalGuests} (+${added} pax). Please scale prep portions, allocate +15 dietary/Jain options, and deploy 4 additional buffet servers. Updated contract amount: ${formatCurrency(vendor.amount + cateringDelta, currentPlan.currency)}.`;
        return {
          ...vendor,
          amount: vendor.amount + cateringDelta,
          paymentMilestone: 'Action Required',
          actionRequiredReason: `Confirm inventory & +4 servers for ${finalGuests} pax`,
          autoDraftedMessage: autoMsg,
          wasUpdated: true,
          changeReason: `Headcount increased to ${finalGuests} (+${added} pax)`,
          lastNoticeGenerated: {
            timestamp: 'Just now (Auto-Agent)',
            trigger: `Guest Count Surge (+${added} Pax)`,
            subject: `🚨 HEADCOUNT EXPANSION: Final Pax ${finalGuests} (+${added} Covers)`,
            message: autoMsg,
            sent: false,
          },
        };
      }
      if (role.includes('venue') || role.includes('logistics') || role.includes('infrastructure')) {
        vCount++;
        const autoMsg = `Hi ${vendor.contactPerson}, guest count reached ${finalGuests}. Please deploy 5 additional banquet round-tables and ${added} Chiavari chairs in the south wing by 4:00 PM.`;
        return {
          ...vendor,
          paymentMilestone: 'Action Required',
          actionRequiredReason: `Deploy +5 banquet tables & ${added} chairs`,
          autoDraftedMessage: autoMsg,
          wasUpdated: true,
          changeReason: `Extra seating for ${added} attendees`,
          lastNoticeGenerated: {
            timestamp: 'Just now (Auto-Agent)',
            trigger: `Guest Count Surge (+${added} Pax)`,
            subject: `🪑 Floorplan Expansion: +${added} Seats Required`,
            message: autoMsg,
            sent: false,
          },
        };
      }
      return { ...vendor, wasUpdated: false };
    });

    const aiRippleSummary = [
      `Scaled guest headcount from ${currentPlan.guestCount} to ${finalGuests} (+${added} pax)`,
      `Recalculated catering & logistics budget (+${formatCurrency(cateringDelta + logisticsDelta, currentPlan.currency)})`,
      'Extended dinner buffet duration by 30 mins to eliminate crowd bottlenecks',
      `Dispatched urgent capacity orders & revised contracts to Catering and Venue teams`,
    ];

    const updatedPlan: EventPlan = {
      ...currentPlan,
      guestCount: finalGuests,
      budgetCategories: updatedBudget,
      timelineNodes: updatedTimeline,
      vendors: updatedVendors,
      meta: {
        ...currentPlan.meta,
        isDiffActive: true,
        baselinePlan: baseline,
        aiRippleSummary,
        lastRippleTrigger: disruptionPrompt,
        lastRippleSummary: {
          triggerName: `👥 Guest Count Jump: +${added} Guests Added Late`,
          budgetChangesCount: bCount,
          timelineChangesCount: tCount,
          vendorNoticesCount: vCount,
          explanation: `Headcount increased to ${finalGuests}. Dynamically adjusted per-plate catering and floor seating, expanded dinner service window, and revised vendor work orders.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      },
    };

    return {
      updatedPlan,
      budgetChangesCount: bCount,
      timelineChangesCount: tCount,
      vendorNoticesCount: vCount,
      aiRippleSummary,
      explanation: `Guest count scaled to ${finalGuests}. Unit economics adjusted, dining run-of-show expanded, and catering orders updated.`,
      triggerName: `👥 Guest Count Jump: +${added} Guests Added Late`,
    };
  }

  // SCENARIO 3: Budget Cut (-15%)
  if (pLower.includes('budget') || pLower.includes('cut') || pLower.includes('save') || pLower.includes('trim')) {
    const cutRate = 0.15;
    const newTotal = Math.round(currentPlan.totalBudget * (1 - cutRate));
    const totalCut = currentPlan.totalBudget - newTotal;

    let bCount = 0;
    let tCount = 0;
    let vCount = 0;

    const updatedBudget: BudgetCategory[] = currentPlan.budgetCategories.map((cat) => {
      const id = cat.id.toLowerCase();
      let rate = cutRate;
      if (id.includes('venue') || id.includes('safety')) rate = 0.05;
      if (id.includes('decor') || id.includes('lighting')) rate = 0.22;
      if (id.includes('sound') || id.includes('marketing')) rate = 0.18;

      const saving = Math.round(cat.allocated * rate);
      const newAllocated = cat.allocated - saving;
      bCount++;
      return {
        ...cat,
        allocated: newAllocated,
        estimatedActual: Math.min(cat.estimatedActual, newAllocated),
        status: 'Optimized',
        wasUpdated: true,
        deltaChange: `-${formatCurrency(saving, currentPlan.currency)}`,
        changeReason: `Value-engineered -${Math.round(rate * 100)}% to meet global -15% budget cap`,
        aiCostSavingTip: 'Replaced custom one-off fabrications with modular standardized rentals.',
      };
    });

    const updatedTimeline: TimelineNode[] = currentPlan.timelineNodes.map((node) => {
      const t = node.title.toLowerCase();
      if (t.includes('rigging') || t.includes('sound') || t.includes('after-party')) {
        tCount++;
        return {
          ...node,
          notes: `${node.notes} [BUDGET OPTIMIZATION: Shifted crew hours to eliminate overtime surcharges]`,
          wasUpdated: true,
          changeReason: 'Optimized crew shift to avoid double-time overtime fees',
        };
      }
      return { ...node, wasUpdated: false };
    });

    const updatedVendors: Vendor[] = currentPlan.vendors.map((vendor) => {
      const role = vendor.role.toLowerCase();
      if (role.includes('decor') || role.includes('sound') || role.includes('photo')) {
        vCount++;
        const revised = Math.round(vendor.amount * 0.85);
        const autoMsg = `Dear ${vendor.contactPerson}, as part of our scheduled budget realignment (-15%), we have trimmed secondary elements while preserving primary deliverables. Revised target: ${formatCurrency(revised, currentPlan.currency)}. Please review updated scope annexure.`;
        return {
          ...vendor,
          amount: revised,
          paymentMilestone: 'Action Required',
          actionRequiredReason: 'Sign revised value-engineered scope of work',
          autoDraftedMessage: autoMsg,
          wasUpdated: true,
          changeReason: '15% scope value engineering',
          lastNoticeGenerated: {
            timestamp: 'Just now (Auto-Agent)',
            trigger: 'Budget Optimization (-15%)',
            subject: '📋 Revised Scope of Work & Value-Engineering Agreement',
            message: autoMsg,
            sent: false,
          },
        };
      }
      return { ...vendor, wasUpdated: false };
    });

    const aiRippleSummary = [
      `Reduced total budget ceiling by ${formatCurrency(totalCut, currentPlan.currency)} (-15%)`,
      'Protected critical venue & food lines while trimming discretionary decor & production',
      'All 8 categories rebalanced into "Optimized" fiscal status with zero deficit',
      'Issued revised scope-of-work agreements and milestone payouts to production vendors',
    ];

    const updatedPlan: EventPlan = {
      ...currentPlan,
      totalBudget: newTotal,
      budgetCategories: updatedBudget,
      timelineNodes: updatedTimeline,
      vendors: updatedVendors,
      meta: {
        ...currentPlan.meta,
        isDiffActive: true,
        baselinePlan: baseline,
        aiRippleSummary,
        lastRippleTrigger: disruptionPrompt,
        lastRippleSummary: {
          triggerName: '✂️ Budget Cut: Reduce Total Spend by 15%',
          budgetChangesCount: bCount,
          timelineChangesCount: tCount,
          vendorNoticesCount: vCount,
          explanation: `Trimmed total spend by ${formatCurrency(totalCut, currentPlan.currency)}. Core categories value-engineered, overtime eliminated, and vendor contracts synchronized.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      },
    };

    return {
      updatedPlan,
      budgetChangesCount: bCount,
      timelineChangesCount: tCount,
      vendorNoticesCount: vCount,
      aiRippleSummary,
      explanation: `Budget cut of ${formatCurrency(totalCut, currentPlan.currency)} applied. Allocations rebalanced and production scopes value-engineered.`,
      triggerName: '✂️ Budget Cut: Reduce Total Spend by 15%',
    };
  }

  // SCENARIO 4: Caterer Delay (+45 mins)
  let bCount = 1;
  let tCount = 2;
  let vCount = 2;

  const updatedBudget: BudgetCategory[] = currentPlan.budgetCategories.map((cat) => {
    const id = cat.id.toLowerCase();
    if (id.includes('bar') || id.includes('cater')) {
      const extraSnack = 8000;
      return {
        ...cat,
        estimatedActual: cat.estimatedActual + extraSnack,
        status: 'Overrun Risk',
        wasUpdated: true,
        deltaChange: `+${formatCurrency(extraSnack, currentPlan.currency)}`,
        changeReason: 'Extended cocktail pass-around canapés during 45m dinner delay',
        aiCostSavingTip: 'Request complimentary late-night mocktail shooters to balance food surcharge.',
      };
    }
    return { ...cat, wasUpdated: false };
  });

  const updatedTimeline: TimelineNode[] = currentPlan.timelineNodes.map((node) => {
    const t = node.title.toLowerCase();
    if (t.includes('dinner') || t.includes('buffet') || t.includes('lunch') || t.includes('banquet')) {
      return {
        ...node,
        timeSlot: '09:15 PM - 12:00 AM (Delayed +45m)',
        hasConflict: true,
        conflictWarning: '⚠️ CRITICAL DELAY: Supply bottleneck. Hot lines opening at 09:15 PM sharp.',
        status: 'critical',
        notes: `${node.notes} [CHEF ALERT: Service delayed 45 mins. Pass-around canapés active]`,
        wasUpdated: true,
        changeReason: 'Kitchen logistics delay +45m',
      };
    }
    if (t.includes('sangeet') || t.includes('cocktail') || t.includes('dj') || t.includes('toast')) {
      return {
        ...node,
        notes: `${node.notes} [EXTENDED PROGRAM: Acoustic lounge music extended +45m to bridge dinner delay]`,
        wasUpdated: true,
        changeReason: 'Extended entertainment buffer during kitchen delay',
      };
    }
    return { ...node, wasUpdated: false };
  });

  const updatedVendors: Vendor[] = currentPlan.vendors.map((vendor) => {
    const role = vendor.role.toLowerCase();
    if (role.includes('cater') || role.includes('kitchen') || role.includes('food')) {
      const autoMsg = `Dear ${vendor.contactPerson}, the EventPulse schedule engine has pushed dinner opening to 09:15 PM (+45m). Appetizer pass-arounds must continue uninterrupted. The main buffet line must be completely manned and steaming hot at 09:10 PM. Confirm receipt immediately.`;
      return {
        ...vendor,
        paymentMilestone: 'Action Required',
        actionRequiredReason: 'Expedite hotline firing for revised 09:15 PM opening',
        autoDraftedMessage: autoMsg,
        wasUpdated: true,
        changeReason: 'Schedule shift +45 mins',
        lastNoticeGenerated: {
          timestamp: 'Just now (Auto-Agent)',
          trigger: 'Caterer Delay (45 mins)',
          subject: '⚠️ URGENT: Dinner Opening Shifted to 09:15 PM (+45m)',
          message: autoMsg,
          sent: false,
        },
      };
    }
    if (role.includes('dj') || role.includes('sound') || role.includes('entertainment')) {
      const autoMsg = `Hi ${vendor.contactPerson}, please extend your acoustic lounge music set until 09:15 PM (+45m) to bridge the catering delay. Keep guest engagement smooth before dinner announcement.`;
      return {
        ...vendor,
        autoDraftedMessage: autoMsg,
        wasUpdated: true,
        changeReason: 'Extended cocktail lounge set +45m',
        lastNoticeGenerated: {
          timestamp: 'Just now (Auto-Agent)',
          trigger: 'Caterer Delay (45 mins)',
          subject: '🎵 SCRIPT UPDATE: Extend Cocktail Lounge Set by +45 Mins',
          message: autoMsg,
          sent: false,
        },
      };
    }
    return { ...vendor, wasUpdated: false };
  });

  const aiRippleSummary = [
    'Cascaded dinner run-of-show start from 08:30 PM to 09:15 PM (+45m)',
    'Seamlessly stretched acoustic lounge & cocktail program to keep guests entertained',
    'Allocated emergency pass-around canapés to prevent guest hunger dissatisfaction',
    'Dispatched coordinated time-sync orders to Head Chef and Lead DJ',
  ];

  const updatedPlan: EventPlan = {
    ...currentPlan,
    budgetCategories: updatedBudget,
    timelineNodes: updatedTimeline,
    vendors: updatedVendors,
    meta: {
      ...currentPlan.meta,
      isDiffActive: true,
      baselinePlan: baseline,
      aiRippleSummary,
      lastRippleTrigger: disruptionPrompt,
      lastRippleSummary: {
        triggerName: '⏰ Caterer Delayed by 45 Mins on Event Day',
        budgetChangesCount: bCount,
        timelineChangesCount: tCount,
        vendorNoticesCount: vCount,
        explanation: 'Dinner opening pushed to 09:15 PM (+45m). Acoustic cocktail set extended, continuous pass-around canapés authorized, and urgent time-sync alerts sent to kitchen and audio teams.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    },
  };

  return {
    updatedPlan,
    budgetChangesCount: bCount,
    timelineChangesCount: tCount,
    vendorNoticesCount: vCount,
    aiRippleSummary,
    explanation: 'Run-of-show cascaded for 45m dinner delay. Cocktail music extended and coordinated alerts sent to kitchen and audio teams.',
    triggerName: '⏰ Caterer Delayed by 45 Mins on Event Day',
  };
}

// Helper to merge Gemini output with plan
function mergeGeminiRippleOutput(
  currentPlan: EventPlan,
  triggerName: string,
  geminiOutput: any
): DualEngineRippleResult {
  const baseline = currentPlan.meta.baselinePlan || currentPlan;

  const updatedBudgetCategories: BudgetCategory[] = currentPlan.budgetCategories.map((cat) => {
    const gemCat = geminiOutput.budgetCategories?.find((g: any) => g.id === cat.id || g.category === cat.category);
    if (gemCat) {
      return {
        ...cat,
        estimatedActual: gemCat.estimatedActual ?? cat.estimatedActual,
        status: (gemCat.status as BudgetCategory['status']) ?? cat.status,
        aiCostSavingTip: gemCat.aiCostSavingTip || cat.aiCostSavingTip,
        wasUpdated: true,
        deltaChange: gemCat.deltaChange || (gemCat.estimatedActual !== cat.estimatedActual ? `+${formatCurrency(Math.abs(gemCat.estimatedActual - cat.estimatedActual), currentPlan.currency)}` : undefined),
        changeReason: gemCat.changeReason || 'Recalculated by Gemini 2.5 Flash',
      };
    }
    return { ...cat, wasUpdated: false };
  });

  const updatedTimelineNodes: TimelineNode[] = currentPlan.timelineNodes.map((node) => {
    const gemNode = geminiOutput.timelineNodes?.find((g: any) => g.id === node.id || g.title === node.title);
    if (gemNode) {
      return {
        ...node,
        timeSlot: gemNode.timeSlot || node.timeSlot,
        hasConflict: gemNode.hasConflict ?? node.hasConflict,
        conflictWarning: gemNode.conflictWarning ?? node.conflictWarning,
        status: (gemNode.status as TimelineNode['status']) ?? node.status,
        wasUpdated: true,
        changeReason: gemNode.changeReason || 'Rescheduled by Gemini 2.5 Flash',
      };
    }
    return { ...node, wasUpdated: false };
  });

  const updatedVendors: Vendor[] = currentPlan.vendors.map((vendor) => {
    const gemVendor = geminiOutput.vendors?.find((g: any) => g.id === vendor.id || g.role === vendor.role || g.name === vendor.name);
    if (gemVendor) {
      const msg = gemVendor.autoDraftedMessage || vendor.autoDraftedMessage || 'Schedule revision notice.';
      return {
        ...vendor,
        paymentMilestone: (gemVendor.paymentMilestone as Vendor['paymentMilestone']) || 'Action Required',
        actionRequiredReason: gemVendor.actionRequiredReason || vendor.actionRequiredReason,
        autoDraftedMessage: msg,
        wasUpdated: true,
        changeReason: gemVendor.changeReason || 'Disruption notice drafted by Gemini 2.5 Flash',
        lastNoticeGenerated: {
          timestamp: 'Just now (Gemini 2.5 Flash)',
          trigger: triggerName,
          subject: `⚡ AI Schedule Update: ${vendor.role}`,
          message: msg,
          sent: false,
        },
      };
    }
    return { ...vendor, wasUpdated: false };
  });

  const bChanges = updatedBudgetCategories.filter((b) => b.wasUpdated).length;
  const tChanges = updatedTimelineNodes.filter((t) => t.wasUpdated).length;
  const vChanges = updatedVendors.filter((v) => v.wasUpdated).length;

  const aiRippleSummary: string[] = geminiOutput.aiRippleSummary || [
    'Cross-functional adjustments propagated by Gemini 2.5 Flash',
    'Updated budget items & contingency allocations',
    'Aligned dependency timeline with latest arrival schedules',
    'Drafted customized vendor WhatsApp instructions',
  ];

  const updatedPlan: EventPlan = {
    ...currentPlan,
    weatherCondition: (geminiOutput.weatherCondition as EventPlan['weatherCondition']) || currentPlan.weatherCondition,
    venue: geminiOutput.venueUpdate ? { ...currentPlan.venue, ...geminiOutput.venueUpdate } : currentPlan.venue,
    budgetCategories: updatedBudgetCategories,
    timelineNodes: updatedTimelineNodes,
    vendors: updatedVendors,
    meta: {
      ...currentPlan.meta,
      isDiffActive: true,
      baselinePlan: baseline,
      aiRippleSummary,
      lastRippleTrigger: triggerName,
      lastRippleSummary: {
        triggerName: `Gemini 2.5 Flash: ${triggerName}`,
        budgetChangesCount: bChanges,
        timelineChangesCount: tChanges,
        vendorNoticesCount: vChanges,
        explanation: geminiOutput.explanation || 'Gemini 2.5 Flash dynamically adapted your event operating state.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    },
  };

  return {
    updatedPlan,
    budgetChangesCount: bChanges,
    timelineChangesCount: tChanges,
    vendorNoticesCount: vChanges,
    aiRippleSummary,
    explanation: geminiOutput.explanation || 'Gemini 2.5 Flash successfully evaluated disruption ripples.',
    triggerName: `Gemini 2.5 Flash: ${triggerName}`,
  };
}

// Fallback deterministic event plan generator for Engine A
function generateDeterministicEventPlan(params: IntakeParams): EventPlan {
  const guestCount = params.guestCount || 100;
  const totalBudget = params.totalBudget || 500000;
  const currency = params.currency || 'INR';

  return {
    id: `plan-${Date.now()}`,
    name: params.eventTitle || `${params.eventType.toUpperCase()} Celebration Master Plan`,
    type: (params.eventType.toLowerCase().includes('wedding') ? 'wedding' : params.eventType.toLowerCase().includes('birthday') ? 'birthday' : 'custom') as EventPlan['type'],
    date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    guestCount,
    totalBudget,
    currency,
    venue: {
      name: `${params.venueStyle || 'Grand Heritage'} Pavilion`,
      type: 'hybrid',
      capacity: Math.round(guestCount * 1.3),
      location: 'Central Luxury District',
      isRainSheltered: true,
    },
    weatherCondition: 'Sunny & Clear',
    themeVibe: `${params.venueStyle} Contemporary Elegance & Artisanal Warmth`,
    budgetCategories: [
      {
        id: 'cat-venue',
        category: 'Venue Rental & Production Grounds',
        allocated: Math.round(totalBudget * 0.3),
        estimatedActual: Math.round(totalBudget * 0.3),
        status: 'On Track',
        aiCostSavingTip: 'Package includes daytime lawn lighting and backup generator fuel.',
        notes: 'Includes main ballroom, lawn colonnade, and private green rooms.',
      },
      {
        id: 'cat-catering',
        category: 'Gourmet Catering & Mixology Bar',
        allocated: Math.round(totalBudget * 0.35),
        estimatedActual: Math.round(totalBudget * 0.36),
        status: 'Overrun Risk',
        aiCostSavingTip: 'Consolidate live dessert stations into 2 signature chef show-counters.',
        notes: `Catering calculated for ${guestCount} guests with dietary preferences.`,
      },
      {
        id: 'cat-decor',
        category: 'Stage Design, Florals & Ambient Mood Lighting',
        allocated: Math.round(totalBudget * 0.15),
        estimatedActual: Math.round(totalBudget * 0.14),
        status: 'Optimized',
        aiCostSavingTip: 'Use seasonal flora and ambient LED uplighting to reduce cut-flower costs.',
        notes: 'Includes entrance portal, table centerpieces, and backdrop.',
      },
      {
        id: 'cat-sound',
        category: 'AV, Live Acoustics & Entertainment',
        allocated: Math.round(totalBudget * 0.1),
        estimatedActual: Math.round(totalBudget * 0.1),
        status: 'On Track',
        aiCostSavingTip: 'Utilize venue line-array scaffolding to avoid separate truss transport.',
        notes: 'Line array sound, wireless microphones, and DJ console.',
      },
      {
        id: 'cat-contingency',
        category: 'Emergency Buffer & Weather Reserve',
        allocated: Math.round(totalBudget * 0.1),
        estimatedActual: Math.round(totalBudget * 0.04),
        status: 'Optimized',
        aiCostSavingTip: 'Pre-negotiate rain canopy deposit refund policy.',
        notes: 'Buffer for unforeseen overtime, parking valets, and weather protection.',
      },
    ],
    timelineNodes: [
      {
        id: 'node-1',
        title: 'Venue Handover & Electrical Grid Safety Check',
        timeSlot: '08:00 AM - 09:30 AM',
        phase: 'day-of',
        category: 'Production',
        owner: 'Venue Liaison',
        dependsOn: [],
        hasConflict: false,
        conflictWarning: null,
        status: 'completed',
        notes: 'Confirm 3-phase generator power and clean restrooms.',
        isOutdoorDependent: false,
      },
      {
        id: 'node-2',
        title: 'Stage Rigging, Sound Tuning & Lighting Calibration',
        timeSlot: '09:30 AM - 12:00 PM',
        phase: 'day-of',
        category: 'Production',
        owner: 'Technical Director',
        dependsOn: ['Venue Handover & Electrical Grid Safety Check'],
        hasConflict: false,
        conflictWarning: null,
        status: 'completed',
        notes: 'Decibel limiter checked; moving heads focused.',
        isOutdoorDependent: true,
      },
      {
        id: 'node-3',
        title: 'Catering Prep, Live Counters Setup & Bar Ingest',
        timeSlot: '12:00 PM - 03:00 PM',
        phase: 'day-of',
        category: 'Hospitality',
        owner: 'Executive Chef',
        dependsOn: ['Venue Handover & Electrical Grid Safety Check'],
        hasConflict: false,
        conflictWarning: null,
        status: 'in-progress',
        notes: `Prep lines configured for ${guestCount} covers with dietary segregation.`,
        isOutdoorDependent: false,
      },
      {
        id: 'node-4',
        title: 'Guest Arrival, Valet Flow & Welcome Cocktails',
        timeSlot: '05:30 PM - 07:00 PM',
        phase: 'day-of',
        category: 'Hospitality',
        owner: 'Hospitality Lead',
        dependsOn: ['Catering Prep, Live Counters Setup & Bar Ingest'],
        hasConflict: false,
        conflictWarning: null,
        status: 'pending',
        notes: 'Welcome drinks and interactive photo booth open.',
        isOutdoorDependent: true,
      },
      {
        id: 'node-5',
        title: 'Main Ceremony / Stage Keynote & Toast',
        timeSlot: '07:00 PM - 08:30 PM',
        phase: 'day-of',
        category: 'Main Stage',
        owner: 'Master of Ceremonies',
        dependsOn: ['Guest Arrival, Valet Flow & Welcome Cocktails'],
        hasConflict: false,
        conflictWarning: null,
        status: 'pending',
        notes: 'Spotlight on celebrants; wireless microphones live.',
        isOutdoorDependent: false,
      },
      {
        id: 'node-6',
        title: 'Grand Banquet Dinner Service & Live Stations',
        timeSlot: '08:30 PM - 11:00 PM',
        phase: 'day-of',
        category: 'Dining',
        owner: 'F&B Operations Director',
        dependsOn: ['Main Ceremony / Stage Keynote & Toast'],
        hasConflict: false,
        conflictWarning: null,
        status: 'pending',
        notes: 'Main buffet opens; dessert bar flamed live.',
        isOutdoorDependent: false,
      },
    ],
    vendors: [
      {
        id: 'v-1',
        name: 'Artisan Gourmet Kitchens',
        role: 'Catering & Mixology',
        contactPerson: 'Chef Raghav',
        email: 'raghav@artisangourmet.in',
        phone: '+91 98450 12345',
        slaDeadline: 'Today 04:00 PM (Tasting Ready)',
        paymentMilestone: 'Deposit Paid',
        amount: Math.round(totalBudget * 0.35),
        currency,
        autoDraftedMessage: `Dear Chef Raghav, confirming operational briefing for ${params.eventTitle} (${guestCount} pax). Please ensure all dietary guidelines are observed.`,
      },
      {
        id: 'v-2',
        name: 'Lumina Scenic & Stagecraft',
        role: 'Decor & Illumination',
        contactPerson: 'Aditi Varma',
        email: 'aditi@luminastages.com',
        phone: '+91 98210 98765',
        slaDeadline: 'Today 02:00 PM (Stage Finished)',
        paymentMilestone: 'Deposit Paid',
        amount: Math.round(totalBudget * 0.15),
        currency,
        autoDraftedMessage: `Hi Aditi, confirming stage and lighting setup according to ${params.venueStyle} aesthetic brief.`,
      },
      {
        id: 'v-3',
        name: 'Apex Line Array Audio & DJ',
        role: 'AV & Acoustics',
        contactPerson: 'Rohan Deshmukh',
        email: 'rohan@apexlineaudio.com',
        phone: '+91 97660 55432',
        slaDeadline: 'Today 12:00 PM (Soundcheck)',
        paymentMilestone: 'Pending Approval',
        amount: Math.round(totalBudget * 0.1),
        currency,
      },
    ],
    ideation: {
      decorMoodboard: [
        {
          id: 'dec-1',
          title: `${params.venueStyle} Ambient Glow & Clean Lines`,
          vibe: 'Sophisticated, luminous, warm',
          description: 'Architectural lighting combined with natural botanical accents and clean metallic structures.',
          colorHexes: ['#8B5CF6', '#F59E0B', '#10B981', '#0F172A'],
          costImpact: 'Included in Base Package',
          tags: ['Contemporary', 'Warm Glow', 'Sustainable'],
          imagePlaceholder: 'Decor Moodboard 1',
        },
      ],
      dietaryMenu: [
        {
          id: 'menu-1',
          dish: 'Wood-Fired Wild Mushroom & Truffle Bruschetta',
          course: 'Appetizers',
          dietary: ['Vegetarian', 'Vegan on Request'],
          costPerHead: 180,
          aiPairingNotes: 'Pair with sparkling botanical tonic and aged balsamic drizzle.',
        },
        {
          id: 'menu-2',
          dish: 'Slow-Simmered Saffron Risotto with Roasted Seasonal Veggies',
          course: 'Main Course',
          dietary: ['Gluten-Free', 'Vegetarian'],
          costPerHead: 380,
          aiPairingNotes: 'Served with microgreens and cold-pressed basil olive oil.',
        },
      ],
      guestEngagement: [
        {
          id: 'act-1',
          activity: 'Interactive QR Memory Wall & Audio Guestbook',
          targetAudience: 'All Guests',
          duration: 'Throughout Evening',
          costImpact: 'Zero Extra Cost',
          engagementScore: 92,
          notes: 'Guests scan coaster QR codes to upload instant candid snaps to the live projection screen.',
        },
      ],
      sustainabilitySwaps: [
        {
          id: 'sust-1',
          standardItem: 'Single-Use Plastic Bottles & Flex Banners',
          ecoSwap: 'Chilled Infused Glass Decanters & Cloth Tension Banners',
          co2Saved: '95 kg CO2e + 400 bottles eliminated',
          costDelta: '-15% signage spend',
          status: 'Adopted',
        },
      ],
    },
    meta: {
      isDiffActive: false,
    },
  };
}
