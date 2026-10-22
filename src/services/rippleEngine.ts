import { EventPlan, BudgetCategory, TimelineNode, Vendor } from '../types/event';
import { formatCurrency } from './currency';

export interface RippleResult {
  updatedPlan: EventPlan;
  budgetChangesCount: number;
  timelineChangesCount: number;
  vendorNoticesCount: number;
  summaryExplanation: string;
  triggerName: string;
}

export function executeRainCrisis(currentPlan: EventPlan): RippleResult {
  const isCurrentlyOutdoor = currentPlan.venue.type === 'outdoor';
  const newWeather = 'Rain Forecast';
  const newVenueType = isCurrentlyOutdoor ? 'indoor' : currentPlan.venue.type;

  // 1. Ripple through Budget
  let budgetChanges = 0;
  const updatedBudgetCategories: BudgetCategory[] = currentPlan.budgetCategories.map((cat) => {
    if (cat.id.includes('contingency')) {
      const extraActual = 25000;
      budgetChanges++;
      return {
        ...cat,
        estimatedActual: cat.estimatedActual + extraActual,
        status: 'Overrun Risk',
        aiCostSavingTip: 'Deployed pre-negotiated rain canopy guarantee clause to cap rental penalty.',
        notes: 'Rain contingency unlocked: Waterproof canopy, side-curtains & portico heaters.',
        lastDiff: {
          amount: extraActual,
          percent: 50,
          direction: 'increase',
          reason: 'Emergency indoor/waterproof transition gear'
        }
      };
    }
    if (cat.id.includes('decor')) {
      budgetChanges++;
      return {
        ...cat,
        status: 'Overrun Risk',
        aiCostSavingTip: 'Shift outdoor floral arches to indoor ballroom backdrop and foyer pillars.',
        lastDiff: {
          amount: 15000,
          percent: 7,
          direction: 'increase',
          reason: 'Ballroom ceiling draping & waterproof floor runners'
        }
      };
    }
    return cat;
  });

  // 2. Ripple through Timeline
  let timelineChanges = 0;
  const updatedTimelineNodes: TimelineNode[] = currentPlan.timelineNodes.map((node) => {
    if (node.isOutdoorDependent) {
      timelineChanges++;
      return {
        ...node,
        hasConflict: true,
        conflictWarning: '⚠️ WEATHER CONFLICT: Outdoor session shifted to sheltered Ballroom / Covered Courtyard. Setup rescheduled +20m.',
        notes: `${node.notes} [EMERGENCY RAIN PLAN ACTIVATED: Relocated indoors]`,
        lastUpdatedReason: 'Rain Protocol: Switched venue to indoor sheltered hall'
      };
    }
    return node;
  });

  // 3. Ripple through Vendors
  let vendorChanges = 0;
  const updatedVendors: Vendor[] = currentPlan.vendors.map((vendor) => {
    const roleLower = vendor.role.toLowerCase();
    if (roleLower.includes('decor') || roleLower.includes('flor')) {
      vendorChanges++;
      return {
        ...vendor,
        actionRequiredReason: 'Urgent: Shift mandap / stage setup to Indoor Ballroom ASAP',
        lastNoticeGenerated: {
          timestamp: 'Just now (Auto-Agent)',
          trigger: 'Weather Crisis: Sudden Rain',
          subject: '🚨 URGENT: Deploy Rain Shelter Plan — Relocate Setup Indoors',
          message: `Hi ${vendor.contactPerson}, sudden rain forecast triggered our indoor emergency protocol. Please halt outdoor lawn setup immediately and deploy the floral mandap and stage inside the main Indoor Palace Ballroom. Waterproof canopy team is on standby. Please confirm arrival at indoor loading bay within 15 mins.`,
          sent: false
        }
      };
    }
    if (roleLower.includes('sound') || roleLower.includes('av')) {
      vendorChanges++;
      return {
        ...vendor,
        actionRequiredReason: 'Cover all line arrays and move mixer console under covered portico',
        lastNoticeGenerated: {
          timestamp: 'Just now (Auto-Agent)',
          trigger: 'Weather Crisis: Sudden Rain',
          subject: '⚡ CRITICAL SOUND SAFETY: Rain Protocol / Cover Electricals',
          message: `Hi ${vendor.contactPerson}, due to rain forecast, all outdoor amplifiers, line arrays, and open power distribution boards must be sealed or relocated to the indoor stage immediately. Please test indoor acoustics limiter before 5:00 PM.`,
          sent: false
        }
      };
    }
    if (roleLower.includes('cater') || roleLower.includes('hospitality')) {
      vendorChanges++;
      return {
        ...vendor,
        lastNoticeGenerated: {
          timestamp: 'Just now (Auto-Agent)',
          trigger: 'Weather Crisis: Sudden Rain',
          subject: '🍽️ Catering Layout Shift: Move Live Counters Indoors',
          message: `Hi ${vendor.contactPerson}, please migrate the live dessert and cocktail counters from the open garden into the sheltered colonnade verandah. Buffet lines will open on schedule.`,
          sent: false
        }
      };
    }
    return vendor;
  });

  const updatedPlan: EventPlan = {
    ...currentPlan,
    venue: {
      ...currentPlan.venue,
      type: newVenueType,
      isRainSheltered: true,
      name: `${currentPlan.venue.name} (Indoor Ballroom Transition)`
    },
    weatherCondition: newWeather,
    budgetCategories: updatedBudgetCategories,
    timelineNodes: updatedTimelineNodes,
    vendors: updatedVendors,
    meta: {
      ...currentPlan.meta,
      lastRippleTrigger: 'Sudden Rain: Move Outdoor Venue Indoors',
      lastRippleSummary: {
        triggerName: '🌧️ Sudden Rain: Move Outdoor Venue Indoors',
        budgetChangesCount: budgetChanges,
        timelineChangesCount: timelineChanges,
        vendorNoticesCount: vendorChanges,
        explanation: 'Outdoor ceremonies moved indoors. Allocated ₹40,000 from contingency for canopy/waterproofing, flagged 4 outdoor timeline nodes with rain alerts, and drafted urgent shelter notices to Decor, Sound, and Catering vendors.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }
  };

  return {
    updatedPlan,
    budgetChangesCount: budgetChanges,
    timelineChangesCount: timelineChanges,
    vendorNoticesCount: vendorChanges,
    summaryExplanation: 'Rain protocol activated: Indoors transition engaged, contingency funds unlocked, and urgent vendor relocation notices dispatched.',
    triggerName: '🌧️ Sudden Rain: Move Outdoor Venue Indoors'
  };
}

export function executeGuestCountJump(currentPlan: EventPlan, addedGuests: number = 50): RippleResult {
  const newGuestCount = currentPlan.guestCount + addedGuests;
  const growthRatio = newGuestCount / currentPlan.guestCount;
  const costPerPlateEst = currentPlan.type === 'wedding' ? 1680 : currentPlan.type === 'birthday' ? 600 : 250;
  const additionalFoodSpend = addedGuests * costPerPlateEst;

  // 1. Budget ripple
  let budgetChanges = 0;
  const updatedBudgetCategories: BudgetCategory[] = currentPlan.budgetCategories.map((cat) => {
    const idLower = cat.id.toLowerCase();
    if (idLower.includes('cater') || idLower.includes('bar')) {
      budgetChanges++;
      const newEstimated = cat.estimatedActual + additionalFoodSpend;
      return {
        ...cat,
        estimatedActual: newEstimated,
        status: newEstimated > cat.allocated ? 'Overrun Risk' : 'On Track',
        aiCostSavingTip: 'Order standard buffet top-up rather than bespoke live-station portions to trim surplus by 20%.',
        notes: `Adjusted for ${newGuestCount} pax (+${addedGuests} covers). Rate ~${formatCurrency(costPerPlateEst, currentPlan.currency)}/plate.`,
        lastDiff: {
          amount: additionalFoodSpend,
          percent: Math.round(((newEstimated - cat.estimatedActual) / cat.estimatedActual) * 100),
          direction: 'increase',
          reason: `Headcount surge (+${addedGuests} covers)`
        }
      };
    }
    if (idLower.includes('logistics') || idLower.includes('venue') || idLower.includes('stalls')) {
      const extraLogistics = 15000;
      budgetChanges++;
      return {
        ...cat,
        estimatedActual: cat.estimatedActual + extraLogistics,
        status: 'Overrun Risk',
        aiCostSavingTip: 'Request 5 additional round banquet tables and 50 extra chiavari chairs from venue stock.',
        lastDiff: {
          amount: extraLogistics,
          percent: 12,
          direction: 'increase',
          reason: `Additional seating & transport capacity for ${addedGuests} guests`
        }
      };
    }
    return cat;
  });

  // 2. Timeline ripple
  let timelineChanges = 0;
  const updatedTimelineNodes: TimelineNode[] = currentPlan.timelineNodes.map((node) => {
    const titleLower = node.title.toLowerCase();
    if (titleLower.includes('dinner') || titleLower.includes('lunch') || titleLower.includes('buffet') || titleLower.includes('tapas')) {
      timelineChanges++;
      return {
        ...node,
        timeSlot: node.timeSlot.includes('11:30 PM') ? '08:30 PM - 12:00 AM' : node.timeSlot,
        notes: `${node.notes} [EXTENDED: +30 mins added to dining window to prevent crowd bottlenecks with ${newGuestCount} pax]`,
        lastUpdatedReason: `Extended dining window for ${newGuestCount} guests`
      };
    }
    if (titleLower.includes('arrival') || titleLower.includes('baraat') || titleLower.includes('gates open')) {
      timelineChanges++;
      return {
        ...node,
        notes: `${node.notes} [CAPACITY ALERT: Valet counters & registration lanes doubled for +${addedGuests} late attendees]`,
        lastUpdatedReason: 'Added guest registration lanes'
      };
    }
    return node;
  });

  // 3. Vendor notices
  let vendorChanges = 0;
  const updatedVendors: Vendor[] = currentPlan.vendors.map((vendor) => {
    const roleLower = vendor.role.toLowerCase();
    if (roleLower.includes('cater') || roleLower.includes('kitchen') || roleLower.includes('hospitality')) {
      vendorChanges++;
      return {
        ...vendor,
        amount: vendor.amount + additionalFoodSpend,
        actionRequiredReason: `Confirm inventory prep for ${newGuestCount} pax (+${addedGuests}) with +15 vegetarian/Jain options`,
        lastNoticeGenerated: {
          timestamp: 'Just now (Auto-Agent)',
          trigger: `Guest Count Jump (+${addedGuests} Guests)`,
          subject: `🚨 HEADCOUNT REVISION: Final Pax Increased to ${newGuestCount} (+${addedGuests})`,
          message: `Dear ${vendor.contactPerson}, the RSVP register has officially updated to ${newGuestCount} guests (an increase of ${addedGuests} covers). Please scale your prep lines, ensure 4 extra buffet service staff, and allocate +15 dietary/Jain portions. Revised contract sum: ${formatCurrency(vendor.amount + additionalFoodSpend, currentPlan.currency)}.`,
          sent: false
        }
      };
    }
    if (roleLower.includes('venue') || roleLower.includes('infrastructure')) {
      vendorChanges++;
      return {
        ...vendor,
        actionRequiredReason: `Release 5 extra banquet tables & 50 chairs`,
        lastNoticeGenerated: {
          timestamp: 'Just now (Auto-Agent)',
          trigger: `Guest Count Jump (+${addedGuests} Guests)`,
          subject: `🪑 Seating & Floorplan Expansion (+${addedGuests} Pax)`,
          message: `Hi ${vendor.contactPerson}, guest count has expanded to ${newGuestCount}. Please unlock storage to deploy 5 additional banquet round-tables and 50 Chiavari chairs with gold sashes on the south perimeter.`,
          sent: false
        }
      };
    }
    return vendor;
  });

  const updatedPlan: EventPlan = {
    ...currentPlan,
    guestCount: newGuestCount,
    budgetCategories: updatedBudgetCategories,
    timelineNodes: updatedTimelineNodes,
    vendors: updatedVendors,
    meta: {
      ...currentPlan.meta,
      lastRippleTrigger: `Guest Count Jump: +${addedGuests} Guests`,
      lastRippleSummary: {
        triggerName: `👥 Guest Count Jump: +${addedGuests} Guests Added Late`,
        budgetChangesCount: budgetChanges,
        timelineChangesCount: timelineChanges,
        vendorNoticesCount: vendorChanges,
        explanation: `Increased total head-count from ${currentPlan.guestCount} to ${newGuestCount}. Dynamically calculated catering and seating adjustments (${formatCurrency(additionalFoodSpend + 15000, currentPlan.currency)} total estimated increase), extended dining service window, and dispatched updated contracts to Catering and Venue teams.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }
  };

  return {
    updatedPlan,
    budgetChangesCount: budgetChanges,
    timelineChangesCount: timelineChanges,
    vendorNoticesCount: vendorChanges,
    summaryExplanation: `Headcount updated to ${newGuestCount}. Food & seating budgets scaled, dining schedule lengthened, and vendor contracts synchronized.`,
    triggerName: `👥 Guest Count Jump: +${addedGuests} Guests Added Late`
  };
}

export function executeBudgetCancellation(currentPlan: EventPlan, cutPercent: number = 15): RippleResult {
  const reductionFactor = 1 - cutPercent / 100;
  const newTotalBudget = Math.round(currentPlan.totalBudget * reductionFactor);
  const totalCutAmount = currentPlan.totalBudget - newTotalBudget;

  let budgetChanges = 0;
  const updatedBudgetCategories: BudgetCategory[] = currentPlan.budgetCategories.map((cat) => {
    const idLower = cat.id.toLowerCase();
    // Protect venue and basic safety from drastic cuts; trim decor, production, marketing, and photo
    let categoryCutRate = cutPercent / 100;
    if (idLower.includes('venue') || idLower.includes('safety')) {
      categoryCutRate = 0.05; // only 5% cut
    } else if (idLower.includes('decor') || idLower.includes('lighting') || idLower.includes('attire')) {
      categoryCutRate = 0.22; // 22% cut
    } else if (idLower.includes('sound') || idLower.includes('marketing')) {
      categoryCutRate = 0.18; // 18% cut
    }

    const savedAmount = Math.round(cat.allocated * categoryCutRate);
    const newAllocated = cat.allocated - savedAmount;
    const newEstimated = Math.min(cat.estimatedActual, newAllocated);
    budgetChanges++;

    return {
      ...cat,
      allocated: newAllocated,
      estimatedActual: newEstimated,
      status: 'Optimized',
      aiCostSavingTip: `Auto-engineered -${Math.round(categoryCutRate * 100)}% reduction: Swapped heavy customization with modular standardized rentals.`,
      notes: `${cat.notes} [Value-engineered savings applied]`,
      lastDiff: {
        amount: savedAmount,
        percent: Math.round(categoryCutRate * 100),
        direction: 'decrease',
        reason: `Automated ${cutPercent}% global value engineering`
      }
    };
  });

  // 2. Timeline ripple
  let timelineChanges = 0;
  const updatedTimelineNodes: TimelineNode[] = currentPlan.timelineNodes.map((node) => {
    const titleLower = node.title.toLowerCase();
    if (titleLower.includes('rigging') || titleLower.includes('booth') || titleLower.includes('after-party')) {
      timelineChanges++;
      return {
        ...node,
        notes: `${node.notes} [BUDGET OPTIMIZATION: Streamlined equipment profile and crew hours to avoid overtime charges]`,
        lastUpdatedReason: 'Streamlined crew shifts to eliminate overtime'
      };
    }
    return node;
  });

  // 3. Vendor notices
  let vendorChanges = 0;
  const updatedVendors: Vendor[] = currentPlan.vendors.map((vendor) => {
    const roleLower = vendor.role.toLowerCase();
    if (roleLower.includes('decor') || roleLower.includes('sound') || roleLower.includes('photo')) {
      vendorChanges++;
      const adjustedFee = Math.round(vendor.amount * 0.85);
      return {
        ...vendor,
        amount: adjustedFee,
        actionRequiredReason: 'Review revised scope & confirm discounted package',
        lastNoticeGenerated: {
          timestamp: 'Just now (Auto-Agent)',
          trigger: `Budget Optimization (-${cutPercent}%)`,
          subject: `📋 Revised Scope of Work & Value-Engineering Agreement`,
          message: `Dear ${vendor.contactPerson}, as part of our scheduled budget realignment (-${cutPercent}%), we have streamlined the non-critical decorative elements while keeping core deliverables 100% intact. Your revised milestone target is ${formatCurrency(adjustedFee, currentPlan.currency)}. Please review the updated scope annexure attached.`,
          sent: false
        }
      };
    }
    return vendor;
  });

  const updatedPlan: EventPlan = {
    ...currentPlan,
    totalBudget: newTotalBudget,
    budgetCategories: updatedBudgetCategories,
    timelineNodes: updatedTimelineNodes,
    vendors: updatedVendors,
    meta: {
      ...currentPlan.meta,
      lastRippleTrigger: `Budget Cut: Reduce Spend by ${cutPercent}%`,
      lastRippleSummary: {
        triggerName: `✂️ Budget Cut: Reduce Total Spend by ${cutPercent}%`,
        budgetChangesCount: budgetChanges,
        timelineChangesCount: timelineChanges,
        vendorNoticesCount: vendorChanges,
        explanation: `Trimmed total budget by ${formatCurrency(totalCutAmount, currentPlan.currency)} (-${cutPercent}%). Protected venue & catering while re-engineering decor, sound, and logistics. All categories re-balanced into "Optimized" status and revised scopes drafted for production vendors.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }
  };

  return {
    updatedPlan,
    budgetChangesCount: budgetChanges,
    timelineChangesCount: timelineChanges,
    vendorNoticesCount: vendorChanges,
    summaryExplanation: `Total budget trimmed by ${formatCurrency(totalCutAmount, currentPlan.currency)}. Value-engineering applied to all categories and vendor scopes adjusted.`,
    triggerName: `✂️ Budget Cut: Reduce Total Spend by ${cutPercent}%`
  };
}

export function executeCatererDelay(currentPlan: EventPlan, delayMins: number = 45): RippleResult {
  let timelineChanges = 0;
  let vendorChanges = 0;

  // 1. Timeline ripple
  const updatedTimelineNodes: TimelineNode[] = currentPlan.timelineNodes.map((node) => {
    const titleLower = node.title.toLowerCase();

    // The delayed catering node
    if (titleLower.includes('dinner') || titleLower.includes('lunch') || titleLower.includes('banquet') || titleLower.includes('tapas')) {
      timelineChanges++;
      return {
        ...node,
        timeSlot: '09:15 PM - 12:00 AM (Delayed +45m)',
        hasConflict: true,
        conflictWarning: `⚠️ CRITICAL DELAY: Kitchen operations delayed by ${delayMins} minutes. Service start pushed from 08:30 PM to 09:15 PM.`,
        status: 'critical',
        notes: `${node.notes} [ATTENTION: Chef reported supply truck bottleneck. Hot lines opening at 09:15 PM sharp]`,
        lastUpdatedReason: `Delayed start time by ${delayMins} mins`
      };
    }

    // Entertainment or buffer to extend
    if (titleLower.includes('sangeet') || titleLower.includes('varmala') || titleLower.includes('toast') || titleLower.includes('cocktail') || titleLower.includes('dj')) {
      timelineChanges++;
      return {
        ...node,
        notes: `${node.notes} [AUTO-EXTENDED BUFFER: Program extended by +${delayMins} mins with acoustic interludes to keep crowd engaged during food delay]`,
        lastUpdatedReason: `Extended to bridge catering delay buffer`
      };
    }

    return node;
  });

  // 2. Vendor notices
  const updatedVendors: Vendor[] = currentPlan.vendors.map((vendor) => {
    const roleLower = vendor.role.toLowerCase();
    if (roleLower.includes('cater') || roleLower.includes('kitchen') || roleLower.includes('food')) {
      vendorChanges++;
      return {
        ...vendor,
        actionRequiredReason: `CRITICAL: Expedite hotline firing for 09:15 PM service start`,
        lastNoticeGenerated: {
          timestamp: 'Just now (Auto-Agent)',
          trigger: `Caterer Delay (${delayMins} mins)`,
          subject: `⚠️ URGENT: Dinner Schedule Rescheduled to 09:15 PM (+${delayMins}m)`,
          message: `Dear ${vendor.contactPerson}, the EventPulse AI schedule engine has shifted dinner commencement to 09:15 PM sharp due to the reported logistics delay. All appetizer pass-arounds must continue uninterrupted in the meantime. The main buffet line must be completely manned and steaming hot at 09:10 PM. Please reply to confirm receipt.`,
          sent: false
        }
      };
    }
    if (roleLower.includes('sound') || roleLower.includes('dj') || roleLower.includes('entertainment')) {
      vendorChanges++;
      return {
        ...vendor,
        lastNoticeGenerated: {
          timestamp: 'Just now (Auto-Agent)',
          trigger: `Caterer Delay (${delayMins} mins)`,
          subject: `🎵 SCRIPT UPDATE: Extend Cocktail Lounge Set by +${delayMins} Mins`,
          message: `Hi ${vendor.contactPerson}, due to a 45-minute dining delay, please extend the acoustic/chillout lounge set until 09:15 PM. Keep crowd energy warm and engaging before transitioning to the grand dinner announcement.`,
          sent: false
        }
      };
    }
    return vendor;
  });

  // 3. Small budget impact: additional cocktail snacks compensation
  let budgetChanges = 0;
  const updatedBudgetCategories: BudgetCategory[] = currentPlan.budgetCategories.map((cat) => {
    if (cat.id.includes('bar') || cat.id.includes('catering')) {
      budgetChanges++;
      const extraSnackCost = 8000;
      return {
        ...cat,
        estimatedActual: cat.estimatedActual + extraSnackCost,
        status: 'Overrun Risk',
        aiCostSavingTip: 'Request complimentary late-night mocktail shooters from banquet manager to offset snack surcharge.',
        notes: `${cat.notes} [Extra passed canapés deployed during 45m schedule delay]`,
        lastDiff: {
          amount: extraSnackCost,
          percent: 3,
          direction: 'increase',
          reason: 'Extended pass-around canapés during dinner delay'
        }
      };
    }
    return cat;
  });

  const updatedPlan: EventPlan = {
    ...currentPlan,
    budgetCategories: updatedBudgetCategories,
    timelineNodes: updatedTimelineNodes,
    vendors: updatedVendors,
    meta: {
      ...currentPlan.meta,
      lastRippleTrigger: `Caterer Delayed by ${delayMins} Mins`,
      lastRippleSummary: {
        triggerName: `⏰ Caterer Delayed by ${delayMins} Mins on Event Day`,
        budgetChangesCount: budgetChanges,
        timelineChangesCount: timelineChanges,
        vendorNoticesCount: vendorChanges,
        explanation: `Dinner service rescheduled to 09:15 PM (+${delayMins}m). Automatically extended the acoustic cocktail set to entertain guests, triggered pass-around snack refills, and dispatched urgent time-sync alerts to Catering and DJ teams.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }
  };

  return {
    updatedPlan,
    budgetChangesCount: budgetChanges,
    timelineChangesCount: timelineChanges,
    vendorNoticesCount: vendorChanges,
    summaryExplanation: `Dinner delayed by ${delayMins}m: Run-of-show cascaded, cocktail hour stretched, and synchronized notices pushed to Kitchen & Music crews.`,
    triggerName: `⏰ Caterer Delayed by ${delayMins} Mins on Event Day`
  };
}

/**
 * Intelligent simulation for custom user prompts
 */
export function executeCustomCrisisRipple(currentPlan: EventPlan, customPrompt: string): RippleResult {
  const promptLower = customPrompt.toLowerCase();

  // If prompt is about weather or rain
  if (promptLower.includes('rain') || promptLower.includes('storm') || promptLower.includes('weather') || promptLower.includes('wind')) {
    return executeRainCrisis(currentPlan);
  }

  // If prompt is about guest count or more people
  if (promptLower.includes('guest') || promptLower.includes('people') || promptLower.includes('headcount') || promptLower.includes('vip') || promptLower.includes('more attendee')) {
    const match = customPrompt.match(/\b\d+\b/);
    const count = match ? parseInt(match[0], 10) : 50;
    return executeGuestCountJump(currentPlan, count > 0 && count < 500 ? count : 50);
  }

  // If prompt is about budget cut, save money, trim spend
  if (promptLower.includes('budget') || promptLower.includes('cut') || promptLower.includes('save') || promptLower.includes('cheap') || promptLower.includes('reduce')) {
    const match = customPrompt.match(/\b\d+\b/);
    const percent = match ? parseInt(match[0], 10) : 15;
    return executeBudgetCancellation(currentPlan, percent > 0 && percent <= 50 ? percent : 15);
  }

  // If prompt is about delay, late, traffic, power outage
  if (promptLower.includes('delay') || promptLower.includes('late') || promptLower.includes('traffic') || promptLower.includes('time') || promptLower.includes('power')) {
    return executeCatererDelay(currentPlan, 45);
  }

  // Default intelligent generic ripple for any other prompt
  let budgetChanges = 0;
  let timelineChanges = 0;
  let vendorChanges = 0;

  const updatedBudgetCategories: BudgetCategory[] = currentPlan.budgetCategories.map((cat, idx) => {
    if (idx === 0 || idx === 1) {
      budgetChanges++;
      const delta = 12000;
      return {
        ...cat,
        estimatedActual: cat.estimatedActual + delta,
        status: 'Overrun Risk',
        aiCostSavingTip: `AI re-evaluated against prompt: "${customPrompt.slice(0, 40)}..."`,
        lastDiff: {
          amount: delta,
          percent: 5,
          direction: 'increase',
          reason: `Auto-adjusted per prompt: "${customPrompt.slice(0, 30)}..."`
        }
      };
    }
    return cat;
  });

  const updatedTimelineNodes: TimelineNode[] = currentPlan.timelineNodes.map((node, idx) => {
    if (idx === 2 || idx === 3) {
      timelineChanges++;
      return {
        ...node,
        notes: `${node.notes} [AI UPDATE: Synchronized for: "${customPrompt.slice(0, 45)}..."]`,
        lastUpdatedReason: `Adjusted based on: ${customPrompt.slice(0, 30)}`
      };
    }
    return node;
  });

  const updatedVendors: Vendor[] = currentPlan.vendors.map((vendor, idx) => {
    if (idx === 0) {
      vendorChanges++;
      return {
        ...vendor,
        actionRequiredReason: `Prompt Action: Re-align deliverable with updated client directive`,
        lastNoticeGenerated: {
          timestamp: 'Just now (Auto-Agent)',
          trigger: `Custom Prompt Ripple`,
          subject: `✨ AI Event Directive Update: ${customPrompt.slice(0, 35)}...`,
          message: `Hi ${vendor.contactPerson}, an automated event ripple was triggered with the following directive: "${customPrompt}". Please adjust your execution checklist and confirm updated readiness with the floor coordinator.`,
          sent: false
        }
      };
    }
    return vendor;
  });

  const updatedPlan: EventPlan = {
    ...currentPlan,
    budgetCategories: updatedBudgetCategories,
    timelineNodes: updatedTimelineNodes,
    vendors: updatedVendors,
    meta: {
      ...currentPlan.meta,
      lastRippleTrigger: customPrompt,
      lastRippleSummary: {
        triggerName: `Custom AI Directive: "${customPrompt}"`,
        budgetChangesCount: budgetChanges,
        timelineChangesCount: timelineChanges,
        vendorNoticesCount: vendorChanges,
        explanation: `Custom ripple computed successfully. Dynamically evaluated impact on budget allocations, task sequences, and vendor communications for: "${customPrompt}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }
  };

  return {
    updatedPlan,
    budgetChangesCount: budgetChanges,
    timelineChangesCount: timelineChanges,
    vendorNoticesCount: vendorChanges,
    summaryExplanation: `Agentic ripple applied for "${customPrompt}". Budget, timeline, and vendor SLA records updated in real time.`,
    triggerName: `Custom AI Directive`
  };
}
