export type CurrencyType = 'INR' | 'USD' | 'EUR';

export interface BudgetCategory {
  id: string;
  category: string;
  allocated: number;
  estimatedActual: number;
  status: 'On Track' | 'Overrun Risk' | 'Optimized';
  aiCostSavingTip: string;
  aiSavingTip?: string; // alias
  notes: string;
  wasUpdated?: boolean;
  deltaChange?: string; // e.g. "+₹45,000" or "-₹18,000"
  changeReason?: string;
  lastDiff?: {
    amount: number;
    percent: number;
    direction: 'increase' | 'decrease' | 'neutral';
    reason: string;
  };
}

export interface TimelineNode {
  id: string;
  title: string;
  task?: string; // alias
  timeSlot: string; // e.g. "06:30 PM - 07:30 PM" or "2 Weeks Prior"
  phase: 'pre-event' | 'day-of';
  category: string;
  owner: string;
  dependsOn: string[]; // List of title or IDs
  hasConflict: boolean;
  conflictWarning: string | null;
  status: 'completed' | 'in-progress' | 'pending' | 'critical';
  notes: string;
  isOutdoorDependent: boolean;
  wasUpdated?: boolean;
  changeReason?: string;
  lastUpdatedReason?: string;
}

export interface Vendor {
  id: string;
  name: string;
  role: string; // e.g. "Catering & Mixology", "Stage Decor & Florals"
  contactPerson: string;
  email: string;
  phone: string;
  slaDeadline: string;
  paymentMilestone: 'Deposit Paid' | 'Pending Approval' | 'Action Required' | 'Paid in Full';
  amount: number;
  currency: CurrencyType;
  actionRequiredReason?: string;
  wasUpdated?: boolean;
  changeReason?: string;
  autoDraftedMessage?: string;
  lastNoticeGenerated?: {
    timestamp: string;
    trigger: string;
    subject: string;
    message: string;
    sent: boolean;
  };
}

export interface DecorConcept {
  id: string;
  title: string;
  vibe: string;
  description: string;
  colorHexes: string[];
  costImpact: string; // e.g. "+₹35,000"
  tags: string[];
  imagePlaceholder: string;
  wasUpdated?: boolean;
  changeReason?: string;
}

export interface MenuItem {
  id: string;
  dish: string;
  course: 'Appetizers' | 'Main Course' | 'Desserts & Bar' | 'Late-Night Snacks';
  dietary: string[]; // ["Jain Option", "Vegan", "GF", "Halal"]
  costPerHead: number;
  aiPairingNotes: string;
  wasUpdated?: boolean;
  changeReason?: string;
}

export interface GuestEngagement {
  id: string;
  activity: string;
  targetAudience: string;
  duration: string;
  costImpact: string;
  engagementScore: number; // 0 - 100
  notes: string;
  wasUpdated?: boolean;
  changeReason?: string;
}

export interface SustainabilitySwap {
  id: string;
  standardItem: string;
  ecoSwap: string;
  co2Saved: string;
  costDelta: string; // e.g. "-12% cost"
  status: 'Adopted' | 'Reviewing';
  wasUpdated?: boolean;
  changeReason?: string;
}

export type DietaryOption = 'Standard' | 'Vegetarian' | 'Jain' | 'Vegan' | 'Gluten-Free' | 'Halal';
export type RsvpStatus = 'Confirmed' | 'Pending' | 'Declined';
export type GuestCohort = 'Family' | 'VIP' | 'Friends' | 'Colleagues' | 'Performers' | 'Volunteers';
export type VipTier = 'General' | 'VIP' | 'VVIP';

export interface GuestRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cohort: GuestCohort;
  rsvpStatus: RsvpStatus;
  dietary: DietaryOption;
  tableNumber?: string;
  vipTier: VipTier;
  plusOnes: number;
  notes?: string;
  wasUpdated?: boolean;
  changeReason?: string;
}

export interface ScenarioCausalStep {
  step: number;
  phase: string;
  action: string;
  affectedEntity: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface ScenarioProposal {
  id: string;
  scenarioName: string;
  prompt: string;
  timestamp: string;
  confidenceScore: number;
  causalChain: ScenarioCausalStep[];
  baselineBudgetTotal: number;
  proposedBudgetTotal: number;
  budgetVariance: number;
  timelineShiftsCount: number;
  vendorAlertsCount: number;
  proposedPlan: EventPlan;
  summaryBulletPoints: string[];
}

export interface EventPlan {
  id: string;
  name: string;
  type: 'wedding' | 'birthday' | 'fest' | 'corporate' | 'custom';
  date: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencyType;
  venue: {
    name: string;
    type: 'outdoor' | 'indoor' | 'hybrid';
    capacity: number;
    location: string;
    isRainSheltered: boolean;
  };
  weatherCondition: 'Sunny & Clear' | 'Mild Breeze' | 'Rain Forecast' | 'Overcast' | 'Heavy Rain';
  themeVibe: string;
  budgetCategories: BudgetCategory[];
  timelineNodes: TimelineNode[];
  vendors: Vendor[];
  guests?: GuestRecord[];
  ideation: {
    decorMoodboard: DecorConcept[];
    dietaryMenu: MenuItem[];
    guestEngagement: GuestEngagement[];
    sustainabilitySwaps: SustainabilitySwap[];
  };
  meta: {
    lastRippleTrigger?: string;
    lastRippleSummary?: {
      triggerName: string;
      budgetChangesCount: number;
      timelineChangesCount: number;
      vendorNoticesCount: number;
      explanation: string;
      timestamp: string;
    };
    aiRippleSummary?: string[]; // Top 4 cross-functional fixes applied
    isDiffActive?: boolean; // whether visual diff badges should be highlighted
    baselinePlan?: EventPlan; // baseline plan before crisis/ripples
  };
}

export interface RippleLog {
  id: string;
  timestamp: string;
  triggerName: string;
  triggerType: 'crisis' | 'manual' | 'ai-prompt';
  budgetImpact: string;
  timelineImpact: string;
  vendorImpact: string;
  summary: string;
}

export interface IntakeParams {
  eventType: string;
  eventTitle: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencyType;
  venueStyle: string;
  specialRequirements: string;
}
