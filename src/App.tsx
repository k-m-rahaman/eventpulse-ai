import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  EventPlan,
  CurrencyType,
  Vendor,
  TimelineNode,
  IntakeParams,
  GuestRecord,
  RsvpStatus,
  ScenarioProposal
} from './types/event';
import { formatCurrency } from './services/currency';
import { PRESET_A_WEDDING, PRESET_B_BIRTHDAY, PRESET_C_COMMUNITY_FEST } from './data/presets';
import {
  generateEventPlanFromIntake,
  simulateRippleEffect,
  DualEngineRippleResult
} from './services/geminiService';
import { getGeminiConfig, saveGeminiConfig, GeminiConfig } from './services/gemini';
import { AmbientAuroraBackdrop } from './components/AmbientAuroraBackdrop';
import { LandingExperience } from './components/LandingExperience';
import { AppShell, WorkspaceTab } from './components/AppShell';
import { CommandPalette } from './components/CommandPalette';
import { OverviewView } from './components/views/OverviewView';
import { GuestsView } from './components/views/GuestsView';
import { ScenarioStudioView } from './components/views/ScenarioStudioView';
import { BudgetTab } from './components/tabs/BudgetTab';
import { TimelineTab } from './components/tabs/TimelineTab';
import { VendorsTab } from './components/tabs/VendorsTab';
import { IdeationTab } from './components/tabs/IdeationTab';
import { RippleBanner } from './components/RippleBanner';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ExportModal } from './components/ExportModal';
import { WhatsAppNoticeModal } from './components/WhatsAppNoticeModal';
import { AgentThinkingModal } from './components/AgentThinkingModal';
import { IntakeModal } from './components/IntakeModal';
import { PromptSchemaDrawer } from './components/PromptSchemaDrawer';
import { CheckCircle2 } from 'lucide-react';

interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning';
}

export function App() {
  // Navigation Mode: Landing experience vs Live Workspace with Bidirectional Cinematic Transition
  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>('workspace');
  const [transitionStage, setTransitionStage] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateWithTransition = (targetView: 'landing' | 'workspace', onMidpoint?: () => void) => {
    if (viewMode === targetView && transitionStage === 'idle') {
      if (onMidpoint) onMidpoint();
      return;
    }

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Phase A: Exit (220ms) - scale down, blur out, translate up
    setTransitionStage('exiting');

    transitionTimeoutRef.current = setTimeout(() => {
      if (onMidpoint) {
        onMidpoint();
      }
      setViewMode(targetView);
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Phase B: Enter (420ms) - unblur, scale from 1.02, slide in
      setTransitionStage('entering');

      transitionTimeoutRef.current = setTimeout(() => {
        setTransitionStage('idle');
      }, 420);
    }, 220);
  };

  // Unified Master JSON State
  const [eventPlan, setEventPlan] = useState<EventPlan>(() => ({
    ...PRESET_A_WEDDING,
    meta: {
      ...PRESET_A_WEDDING.meta,
      baselinePlan: PRESET_A_WEDDING,
      isDiffActive: false,
    },
  }));
  const [planHistory, setPlanHistory] = useState<EventPlan[]>([]);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [currency, setCurrency] = useState<CurrencyType>('INR');

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Global Command Palette state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Modals & Drawer state
  const [geminiConfig, setGeminiConfig] = useState<GeminiConfig>(getGeminiConfig());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [isPromptSchemaOpen, setIsPromptSchemaOpen] = useState(false);
  const [selectedVendorForNotice, setSelectedVendorForNotice] = useState<Vendor | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dismissedBannerTimestamp, setDismissedBannerTimestamp] = useState<string | null>(null);

  // 900ms Agent Thinking Progress State
  const [isThinkingOpen, setIsThinkingOpen] = useState(false);
  const [thinkingTrigger, setThinkingTrigger] = useState('');
  const [pendingRippleAction, setPendingRippleAction] = useState<(() => Promise<void>) | null>(null);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Global Keyboard Listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync document class with dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Theme effect
  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        showToast('Dark Mode Activated', 'Switched to Project AURA dark slate surface');
      } else {
        showToast('Light Mode Activated', 'Switched to Project AURA daylight canvas');
      }
      return next;
    });
  };

  // Sync currency changes into eventPlan
  const handleCurrencyChange = (newCurrency: CurrencyType) => {
    setCurrency(newCurrency);
    setEventPlan((prev) => ({
      ...prev,
      currency: newCurrency,
      vendors: prev.vendors.map((v) => ({ ...v, currency: newCurrency })),
    }));
    showToast('Currency Updated', `Active display currency set to ${newCurrency}`);
  };

  // Preset Switcher
  const handleSelectPreset = (presetKey: 'wedding' | 'birthday' | 'fest') => {
    setPlanHistory([]);
    let base: EventPlan;
    if (presetKey === 'wedding') {
      base = PRESET_A_WEDDING;
    } else if (presetKey === 'birthday') {
      base = PRESET_B_BIRTHDAY;
    } else {
      base = PRESET_C_COMMUNITY_FEST;
    }

    const nextPlan: EventPlan = {
      ...base,
      currency,
      vendors: base.vendors.map((v) => ({ ...v, currency })),
      meta: {
        ...base.meta,
        baselinePlan: base,
        isDiffActive: false,
      },
    };

    setEventPlan(nextPlan);
    setDismissedBannerTimestamp(null);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.2 },
    });

    const presetNames = {
      wedding: 'Royal Heritage Wedding (250 Pax, ₹15L)',
      birthday: 'Milestone 30th Birthday Gala (80 Pax, ₹1.5L)',
      fest: 'Cultural & Tech Community Fest (500 Pax, ₹3L)',
    };
    showToast('Preset Activated', presetNames[presetKey]);
  };

  // Helper to commit plan update with history push & visual diff activation
  const commitRipple = (result: DualEngineRippleResult) => {
    setPlanHistory((prev) => [eventPlan, ...prev.slice(0, 5)]);
    setEventPlan(result.updatedPlan);
    setDismissedBannerTimestamp(null);

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.25 },
      colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
    });

    showToast('AI Causal Ripple Applied', 'Master plan state dynamically updated across all tabs');
  };

  // Triggers the 900ms step-by-step thinking progress animation before executing ripple
  const triggerWithThinkingAnimation = (triggerName: string, action: () => Promise<void>) => {
    setThinkingTrigger(triggerName);
    setPendingRippleAction(() => action);
    setIsThinkingOpen(true);
  };

  const handleThinkingComplete = async () => {
    setIsThinkingOpen(false);
    if (pendingRippleAction) {
      setIsProcessing(true);
      try {
        await pendingRippleAction();
      } finally {
        setIsProcessing(false);
        setPendingRippleAction(null);
      }
    }
  };

  // Non-Destructive Scenario Studio Simulation Engine
  const handleRunScenarioSimulation = async (
    prompt: string,
    triggerTitle: string
  ): Promise<ScenarioProposal> => {
    const apiKey = geminiConfig.useFallbackSimulation ? '' : geminiConfig.apiKey;
    const result = await simulateRippleEffect(eventPlan, prompt, apiKey);

    const baselineTotal = eventPlan.totalBudget;
    const proposedTotal = result.updatedPlan.budgetCategories.reduce(
      (sum, c) => sum + c.estimatedActual,
      0
    );
    const variance =
      proposedTotal - eventPlan.budgetCategories.reduce((sum, c) => sum + c.estimatedActual, 0);

    const timelineShiftsCount = result.updatedPlan.timelineNodes.filter((n) => n.wasUpdated).length;
    const vendorAlertsCount = result.updatedPlan.vendors.filter(
      (v) => v.wasUpdated || v.paymentMilestone === 'Action Required'
    ).length;

    return {
      id: `prop-${Date.now()}`,
      scenarioName: triggerTitle,
      prompt,
      timestamp: new Date().toLocaleTimeString(),
      confidenceScore: 98.4,
      causalChain: [
        {
          step: 1,
          phase: 'Constraint Ingestion',
          action: 'Parsed environmental & logistical constraints',
          affectedEntity: 'System Prompt',
          status: 'completed',
        },
        {
          step: 2,
          phase: 'Graph Dependency Audit',
          action: 'Audited critical milestone links and delay buffers',
          affectedEntity: 'Timeline Graph',
          status: 'completed',
        },
        {
          step: 3,
          phase: 'Plate & Headcount Calc',
          action: 'Recalculated per-head catering & weatherproofing',
          affectedEntity: 'Budget Ledger',
          status: 'completed',
        },
        {
          step: 4,
          phase: 'Timestamp Re-alignment',
          action: 'Shifted dependent day-of run-of-show timestamps',
          affectedEntity: 'Run of Show',
          status: 'completed',
        },
        {
          step: 5,
          phase: 'Vendor Directives',
          action: 'Generated tailored WhatsApp change notices',
          affectedEntity: 'Vendor SLAs',
          status: 'completed',
        },
      ],
      baselineBudgetTotal: baselineTotal,
      proposedBudgetTotal: proposedTotal,
      budgetVariance: variance,
      timelineShiftsCount,
      vendorAlertsCount,
      proposedPlan: result.updatedPlan,
      summaryBulletPoints: result.updatedPlan.meta.aiRippleSummary || [
        'Recalculated per-head and contingency allocations',
        'Cascaded delay buffers across sequential ceremonial milestones',
        'Updated vendor action milestones with tailored change orders',
        'Optimized decor and menu selections to mitigate budget deficits',
      ],
    };
  };

  const handleCommitProposal = (proposal: ScenarioProposal) => {
    setPlanHistory((prev) => [eventPlan, ...prev.slice(0, 5)]);
    setEventPlan(proposal.proposedPlan);
    setDismissedBannerTimestamp(null);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.25 },
      colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
    });

    showToast('Scenario Staged & Committed', proposal.scenarioName);
  };

  // Direct scenario triggers from Overview or Command Palette
  const handleTriggerDirectScenario = (promptText: string) => {
    triggerWithThinkingAnimation('AI Causal Ripple', async () => {
      const apiKey = geminiConfig.useFallbackSimulation ? '' : geminiConfig.apiKey;
      const result = await simulateRippleEffect(eventPlan, promptText, apiKey);
      commitRipple(result);
    });
  };

  // Reset to Baseline
  const handleResetToBaseline = () => {
    const baseline = eventPlan.meta.baselinePlan;
    if (!baseline) return;

    const cleanPlan: EventPlan = {
      ...baseline,
      budgetCategories: baseline.budgetCategories.map((b) => ({
        ...b,
        wasUpdated: false,
        deltaChange: undefined,
        changeReason: undefined,
      })),
      timelineNodes: baseline.timelineNodes.map((t) => ({
        ...t,
        wasUpdated: false,
        changeReason: undefined,
        hasConflict: false,
        conflictWarning: null,
      })),
      vendors: baseline.vendors.map((v) => ({
        ...v,
        wasUpdated: false,
        changeReason: undefined,
        paymentMilestone:
          v.paymentMilestone === 'Action Required' ? 'Deposit Paid' : v.paymentMilestone,
      })),
      ideation: {
        ...baseline.ideation,
        decorMoodboard: baseline.ideation.decorMoodboard.map((d) => ({
          ...d,
          wasUpdated: false,
          changeReason: undefined,
        })),
        dietaryMenu: baseline.ideation.dietaryMenu.map((m) => ({
          ...m,
          wasUpdated: false,
          changeReason: undefined,
        })),
        guestEngagement: baseline.ideation.guestEngagement.map((g) => ({
          ...g,
          wasUpdated: false,
          changeReason: undefined,
        })),
        sustainabilitySwaps: baseline.ideation.sustainabilitySwaps.map((s) => ({
          ...s,
          wasUpdated: false,
          changeReason: undefined,
        })),
      },
      meta: {
        ...baseline.meta,
        isDiffActive: false,
        lastRippleSummary: undefined,
        aiRippleSummary: undefined,
      },
    };

    setEventPlan(cleanPlan);
    setDismissedBannerTimestamp(null);

    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.25 },
    });

    showToast('Plan Reset', 'Restored original event plan baseline');
  };

  // Revert / Undo Single Step
  const handleUndoRipple = () => {
    if (planHistory.length === 0) return;
    const previous = planHistory[0];
    setPlanHistory((prev) => prev.slice(1));
    setEventPlan(previous);
    showToast('Action Reverted', 'Restored previous plan state');
  };

  // Guests View Handlers
  const handleUpdateGuestStatus = (guestId: string, status: RsvpStatus) => {
    setEventPlan((prev) => ({
      ...prev,
      guests: (prev.guests || []).map((g) => (g.id === guestId ? { ...g, rsvpStatus: status } : g)),
    }));
    showToast('RSVP Status Updated', `Attendee marked as ${status}`);
  };

  const handleAddGuest = (newGuest: Omit<GuestRecord, 'id'>) => {
    const created: GuestRecord = {
      ...newGuest,
      id: `gst-${Date.now()}`,
    };
    setEventPlan((prev) => ({
      ...prev,
      guests: [created, ...(prev.guests || [])],
    }));

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.3 },
    });

    showToast('Guest Added', `${newGuest.name} registered (${newGuest.dietary})`);
  };

  // Budget & Timeline Handlers
  const handleUpdateCategoryAllocation = (categoryId: string, newAllocated: number) => {
    setEventPlan((prev) => ({
      ...prev,
      budgetCategories: prev.budgetCategories.map((cat) =>
        cat.id === categoryId ? { ...cat, allocated: newAllocated } : cat
      ),
    }));
  };

  const handleApplySavingTip = (categoryId: string) => {
    setEventPlan((prev) => ({
      ...prev,
      budgetCategories: prev.budgetCategories.map((cat) => {
        if (cat.id === categoryId) {
          const savings = Math.round(cat.estimatedActual * 0.1);
          return {
            ...cat,
            estimatedActual: cat.estimatedActual - savings,
            status: 'Optimized',
            wasUpdated: true,
            deltaChange: `-${formatCurrency(savings, eventPlan.currency)}`,
            changeReason: 'Applied AI Cost-Saving Recommendation',
          };
        }
        return cat;
      }),
    }));
    showToast('AI Cost-Saving Applied', 'Reduced estimated category spend by 10%');
  };

  const handleUpdateTimelineStatus = (nodeId: string, status: TimelineNode['status']) => {
    setEventPlan((prev) => ({
      ...prev,
      timelineNodes: prev.timelineNodes.map((n) =>
        n.id === nodeId ? { ...n, status } : n
      ),
    }));
    showToast('Milestone Updated', `Timeline task status changed to ${status}`);
  };

  const handleShiftTimelineTime = (nodeId: string, deltaMinutes: number) => {
    setEventPlan((prev) => ({
      ...prev,
      timelineNodes: prev.timelineNodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              notes: `${n.notes} [Shifted by +${deltaMinutes} mins]`,
              wasUpdated: true,
              changeReason: `Manual time shift +${deltaMinutes}m`,
            }
          : n
      ),
    }));
    showToast('Milestone Shifted', `Task shifted by +${deltaMinutes} minutes`);
  };

  const handleResolveTimelineConflict = (nodeId: string) => {
    setEventPlan((prev) => ({
      ...prev,
      timelineNodes: prev.timelineNodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              hasConflict: false,
              conflictWarning: null,
              status: 'completed',
              notes: `${n.notes} [Conflict resolved by coordinator override]`,
            }
          : n
      ),
    }));
    showToast('Conflict Resolved', 'Coordinator override applied to milestone');
  };

  const handleUpdateVendorPaymentStatus = (vendorId: string, status: Vendor['paymentMilestone']) => {
    setEventPlan((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) =>
        v.id === vendorId ? { ...v, paymentMilestone: status } : v
      ),
    }));
    showToast('Vendor Milestone Updated', `Payment milestone changed to ${status}`);
  };

  const handleMarkVendorNoticeSent = (vendorId: string) => {
    setEventPlan((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) => {
        if (v.id === vendorId && v.lastNoticeGenerated) {
          return {
            ...v,
            lastNoticeGenerated: {
              ...v.lastNoticeGenerated,
              sent: !v.lastNoticeGenerated.sent,
            },
          };
        }
        return v;
      }),
    }));
    if (selectedVendorForNotice && selectedVendorForNotice.id === vendorId) {
      setSelectedVendorForNotice((prev) =>
        prev && prev.lastNoticeGenerated
          ? {
              ...prev,
              lastNoticeGenerated: {
                ...prev.lastNoticeGenerated,
                sent: !prev.lastNoticeGenerated.sent,
              },
            }
          : prev
      );
    }
    showToast('Directive Dispatched', 'WhatsApp message status updated');
  };

  const handleAddIdeationConcept = (type: 'decor' | 'menu' | 'activity' | 'sustainability') => {
    if (type === 'decor') {
      const newConcept = {
        id: `decor-${Date.now()}`,
        title: 'Bioluminescent Botanical Canopy & Amber Lanterns',
        vibe: 'Modern ethereal, warm ambient glow',
        description: 'Suspended blown glass orbs housing live succulents, copper fairy lights, and marigold garlands.',
        colorHexes: ['#4F46E5', '#D97706', '#10B981', '#0F172A'],
        costImpact: '+₹24,000 for courtyard centerpieces',
        tags: ['Warm Amber', 'Eco-Chic', 'Mandap Glow'],
        imagePlaceholder: 'Terrarium Glow',
        wasUpdated: true,
        changeReason: 'Generated by AI Ideator',
      };
      setEventPlan((prev) => ({
        ...prev,
        ideation: {
          ...prev.ideation,
          decorMoodboard: [newConcept, ...prev.ideation.decorMoodboard],
        },
      }));
    } else if (type === 'menu') {
      const newItem = {
        id: `menu-${Date.now()}`,
        dish: 'Live Nitro Saffron & Pistachio Cloud Kulfi',
        course: 'Desserts & Bar' as const,
        dietary: ['Vegetarian', 'Gluten-Free', 'Nut Allergy Notice'],
        costPerHead: 190,
        aiPairingNotes: 'Instant liquid nitrogen freezing creates theater smoke alongside cardamom espresso shooters.',
        wasUpdated: true,
        changeReason: 'Generated by AI Ideator',
      };
      setEventPlan((prev) => ({
        ...prev,
        ideation: {
          ...prev.ideation,
          dietaryMenu: [newItem, ...prev.ideation.dietaryMenu],
        },
      }));
    } else if (type === 'activity') {
      const newAct = {
        id: `act-${Date.now()}`,
        activity: 'Collaborative Live Heritage Canvas (Guest Co-Creation)',
        targetAudience: 'All Guests (Memorable Keepsake)',
        duration: 'Throughout evening reception',
        costImpact: '₹12,000 including canvas & non-toxic acrylics',
        engagementScore: 95,
        notes: 'Local folk artist outlines custom event geometry; guests fill in signature color tiles.',
        wasUpdated: true,
        changeReason: 'Generated by AI Ideator',
      };
      setEventPlan((prev) => ({
        ...prev,
        ideation: {
          ...prev.ideation,
          guestEngagement: [newAct, ...prev.ideation.guestEngagement],
        },
      }));
    } else {
      const newSwap = {
        id: `sust-${Date.now()}`,
        standardItem: 'Printed Acrylic Table Place Cards',
        ecoSwap: 'Seed-Paper Embedded Cards (Plantable Basil & Marigold)',
        co2Saved: '15 kg CO2e + 500 plants grown',
        costDelta: '-20% stationery spend',
        status: 'Adopted' as const,
        wasUpdated: true,
        changeReason: 'Generated by AI Ideator',
      };
      setEventPlan((prev) => ({
        ...prev,
        ideation: {
          ...prev.ideation,
          sustainabilitySwaps: [newSwap, ...prev.ideation.sustainabilitySwaps],
        },
      }));
    }

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.3 },
    });

    showToast('AI Concept Added', `New ${type} concept generated for Creative Studio`);
  };

  // Engine A: Architect Event from Intake Params
  const handleArchitectSubmit = (params: IntakeParams) => {
    setIsIntakeModalOpen(false);
    triggerWithThinkingAnimation(`Architecting: ${params.eventTitle}`, async () => {
      const apiKey = geminiConfig.useFallbackSimulation ? '' : geminiConfig.apiKey;
      const generated = await generateEventPlanFromIntake(params, apiKey);
      const planWithBaseline: EventPlan = {
        ...generated,
        meta: {
          ...generated.meta,
          baselinePlan: generated,
          isDiffActive: false,
        },
      };
      setPlanHistory([]);
      setEventPlan(planWithBaseline);
      setDismissedBannerTimestamp(null);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.25 },
      });
    });
  };

  const showBanner =
    Boolean(eventPlan.meta.lastRippleSummary) &&
    dismissedBannerTimestamp !== eventPlan.meta.lastRippleSummary?.timestamp;

  // Render Unified Application Frame with Live Aurora Light Mesh & View Transition Layer
  return (
    <div className="relative min-h-screen bg-transparent antialiased font-sans selection:bg-indigo-600 selection:text-white">
      {/* Live Moving & Scroll-Reactive Aurora Light Mesh */}
      <AmbientAuroraBackdrop isDarkMode={isDarkMode} />

      {/* Cinematic Bidirectional View Transition Layer */}
      <div
        className={`relative z-10 w-full min-h-screen ${
          transitionStage === 'exiting'
            ? 'animate-cinematic-exit pointer-events-none'
            : transitionStage === 'entering'
            ? 'animate-cinematic-enter'
            : ''
        }`}
      >
        {viewMode === 'landing' ? (
          <LandingExperience
            onLaunchWorkspace={() => navigateWithTransition('workspace')}
            onLoadPreset={(presetKey) => {
              navigateWithTransition('workspace', () => handleSelectPreset(presetKey));
            }}
            currency={currency}
          />
        ) : (
          <AppShell
            currentPlan={eventPlan}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onSelectPreset={handleSelectPreset}
            currency={currency}
            onChangeCurrency={handleCurrencyChange}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
            onOpenPromptSchemaDrawer={() => setIsPromptSchemaOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onGoToLanding={() => navigateWithTransition('landing')}
            geminiConfig={geminiConfig}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          >
            <div key={`${activeTab}-${eventPlan.id}`} className="animate-blur-in space-y-6">
              {/* Recent AI Ripple Log Banner */}
              {showBanner && (
                <RippleBanner
                  eventPlan={eventPlan}
                  onUndo={handleUndoRipple}
                  onResetBaseline={handleResetToBaseline}
                  onDismiss={() =>
                    setDismissedBannerTimestamp(eventPlan.meta.lastRippleSummary?.timestamp || null)
                  }
                  canUndo={planHistory.length > 0}
                  hasBaseline={Boolean(eventPlan.meta.baselinePlan)}
                />
              )}

              {/* Workspace Active Tab Router */}
              {activeTab === 'overview' && (
                <OverviewView
                  eventPlan={eventPlan}
                  onNavigateTab={setActiveTab}
                  onOpenVendorNotice={(vendor) => setSelectedVendorForNotice(vendor)}
                  onTriggerQuickScenario={(type) => {
                    if (type === 'rain') {
                      handleTriggerDirectScenario(
                        'Sudden unseasonal rain forces outdoor event indoors with waterproof tenting.'
                      );
                    } else if (type === 'guests') {
                      handleTriggerDirectScenario(
                        'Guest count unexpectedly increased by 50 attendees 48 hours before the event.'
                      );
                    } else {
                      handleTriggerDirectScenario(
                        'Immediate 15% overall budget reduction required across discretionary categories.'
                      );
                    }
                  }}
                  currency={currency}
                />
              )}

              {activeTab === 'budget' && (
                <BudgetTab
                  eventPlan={eventPlan}
                  onUpdateCategoryAllocation={handleUpdateCategoryAllocation}
                  onApplySavingTip={handleApplySavingTip}
                />
              )}

              {activeTab === 'timeline' && (
                <TimelineTab
                  eventPlan={eventPlan}
                  onUpdateNodeStatus={handleUpdateTimelineStatus}
                  onShiftTime={handleShiftTimelineTime}
                  onResolveConflict={handleResolveTimelineConflict}
                />
              )}

              {activeTab === 'guests' && (
                <GuestsView
                  eventPlan={eventPlan}
                  onUpdateGuestStatus={handleUpdateGuestStatus}
                  onAddGuest={handleAddGuest}
                  onTriggerGuestSurgeScenario={() => {
                    setActiveTab('scenario-studio');
                    handleTriggerDirectScenario(
                      'Guest count unexpectedly increased by 50 attendees 48 hours before the event.'
                    );
                  }}
                />
              )}

              {activeTab === 'vendors' && (
                <VendorsTab
                  eventPlan={eventPlan}
                  onOpenVendorNotice={(vendor) => setSelectedVendorForNotice(vendor)}
                  onUpdatePaymentStatus={handleUpdateVendorPaymentStatus}
                />
              )}

              {activeTab === 'scenario-studio' && (
                <ScenarioStudioView
                  currentPlan={eventPlan}
                  baselinePlan={eventPlan.meta.baselinePlan}
                  canUndo={planHistory.length > 0}
                  onRunScenarioSimulation={handleRunScenarioSimulation}
                  onCommitProposal={handleCommitProposal}
                  onUndoLastCommit={handleUndoRipple}
                  onResetBaseline={handleResetToBaseline}
                  isProcessing={isProcessing}
                  currency={currency}
                />
              )}

              {activeTab === 'ideation' && (
                <IdeationTab
                  eventPlan={eventPlan}
                  onAddConcept={handleAddIdeationConcept}
                />
              )}
            </div>
          </AppShell>
        )}
      </div>

      {/* Global Command Palette (⌘K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          navigateWithTransition('workspace');
        }}
        onSelectPreset={(preset) => {
          navigateWithTransition('workspace', () => handleSelectPreset(preset));
        }}
        onTriggerScenario={(prompt) => {
          navigateWithTransition('workspace', () => {
            setActiveTab('scenario-studio');
            handleTriggerDirectScenario(prompt);
          });
        }}
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onToggleCurrency={() => {
          const order: CurrencyType[] = ['INR', 'USD', 'EUR'];
          const nextIdx = (order.indexOf(currency) + 1) % order.length;
          handleCurrencyChange(order[nextIdx]);
        }}
        onToggleTheme={handleToggleTheme}
        onGoToLanding={() => navigateWithTransition('landing')}
        currentCurrency={currency}
        isDarkMode={isDarkMode}
      />

      {/* Slide-Overs & Dialog Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        config={geminiConfig}
        onSave={(cfg) => {
          setGeminiConfig(cfg);
          saveGeminiConfig(cfg);
        }}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        eventPlan={eventPlan}
      />

      <IntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onSubmit={handleArchitectSubmit}
        currency={currency}
        isProcessing={isProcessing || isThinkingOpen}
      />

      <PromptSchemaDrawer
        isOpen={isPromptSchemaOpen}
        onClose={() => setIsPromptSchemaOpen(false)}
        eventPlan={eventPlan}
      />

      <WhatsAppNoticeModal
        vendor={selectedVendorForNotice}
        onClose={() => setSelectedVendorForNotice(null)}
        onMarkSent={handleMarkVendorNoticeSent}
      />

      {/* 900ms Agent Thinking Progress Modal */}
      <AgentThinkingModal
        isOpen={isThinkingOpen}
        onComplete={handleThinkingComplete}
        triggerName={thinkingTrigger}
        isGeminiLive={Boolean(geminiConfig.apiKey && !geminiConfig.useFallbackSimulation)}
      />

      {/* Physical Micro-Interaction Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto glass-widget rounded-2xl p-4 shadow-xl flex items-start gap-3 animate-fadeIn transition-all duration-150"
          >
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {toast.title}
              </div>
              {toast.message && (
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm leading-none shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
