import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Utensils,
  Plus,
  Search,
  Filter,
  Sparkles,
  Zap,
  Tag,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { EventPlan, GuestRecord, DietaryOption, RsvpStatus, GuestCohort, VipTier } from '../../types/event';
import { formatCurrency } from '../../services/currency';

interface GuestsViewProps {
  eventPlan: EventPlan;
  onUpdateGuestStatus: (guestId: string, status: RsvpStatus) => void;
  onAddGuest: (newGuest: Omit<GuestRecord, 'id'>) => void;
  onTriggerGuestSurgeScenario: () => void;
}

export const GuestsView: React.FC<GuestsViewProps> = ({
  eventPlan,
  onUpdateGuestStatus,
  onAddGuest,
  onTriggerGuestSurgeScenario,
}) => {
  const [selectedCohort, setSelectedCohort] = useState<string>('all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);

  // Form state for adding guest
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestCohort, setNewGuestCohort] = useState<GuestCohort>('Family');
  const [newGuestDietary, setNewGuestDietary] = useState<DietaryOption>('Vegetarian');
  const [newGuestVipTier, setNewGuestVipTier] = useState<VipTier>('General');
  const [newGuestTable, setNewGuestTable] = useState('Table 1');
  const [newGuestPlusOnes, setNewGuestPlusOnes] = useState(0);
  const [newGuestNotes, setNewGuestNotes] = useState('');

  const guests: GuestRecord[] = eventPlan.guests || [];

  // Metrics
  const totalGuestsInList = guests.reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);
  const confirmedCount = guests
    .filter((g) => g.rsvpStatus === 'Confirmed')
    .reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);
  const pendingCount = guests
    .filter((g) => g.rsvpStatus === 'Pending')
    .reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);
  const declinedCount = guests
    .filter((g) => g.rsvpStatus === 'Declined')
    .reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);

  const confirmationRate = totalGuestsInList > 0 ? Math.round((confirmedCount / totalGuestsInList) * 100) : 0;

  // Catering plate estimate
  const cateringCategory = eventPlan.budgetCategories.find((c) =>
    c.category.toLowerCase().includes('cater') || c.category.toLowerCase().includes('food')
  );
  const estCostPerPlate = cateringCategory
    ? Math.round(cateringCategory.allocated / Math.max(eventPlan.guestCount, 1))
    : Math.round(eventPlan.totalBudget * 0.3 / Math.max(eventPlan.guestCount, 1));

  const totalCateringImpact = confirmedCount * estCostPerPlate;

  // Dietary counts
  const dietaryBreakdown: Record<DietaryOption, number> = {
    'Vegetarian': 0,
    'Jain': 0,
    'Vegan': 0,
    'Gluten-Free': 0,
    'Halal': 0,
    'Standard': 0,
  };

  guests.forEach((g) => {
    if (g.rsvpStatus === 'Confirmed') {
      const count = 1 + (g.plusOnes || 0);
      dietaryBreakdown[g.dietary] = (dietaryBreakdown[g.dietary] || 0) + count;
    }
  });

  const filteredGuests = guests.filter((g) => {
    if (selectedCohort !== 'all' && g.cohort !== selectedCohort) return false;
    if (selectedDietary !== 'all' && g.dietary !== selectedDietary) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        (g.tableNumber && g.tableNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    onAddGuest({
      name: newGuestName.trim(),
      email: newGuestEmail.trim() || 'guest@example.com',
      cohort: newGuestCohort,
      rsvpStatus: 'Confirmed',
      dietary: newGuestDietary,
      vipTier: newGuestVipTier,
      tableNumber: newGuestTable,
      plusOnes: Number(newGuestPlusOnes),
      notes: newGuestNotes.trim() || undefined,
    });

    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestNotes('');
    setIsAddGuestModalOpen(false);
  };

  return (
    <div className="space-y-6 view-enter">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Target Capacity */}
        <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between stagger-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Target Headcount
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-xs">
                <Users className="w-4 h-4" strokeWidth={1.75} />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {eventPlan.guestCount}{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">planned</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Capacity at {eventPlan.venue.name}: {eventPlan.venue.capacity} max
          </div>
        </div>

        {/* Confirmed RSVPs */}
        <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between stagger-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Confirmed Attendance
              </span>
              <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-xs">
                <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
              {confirmedCount}{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">
                ({confirmationRate}%)
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {pendingCount} pending responses • {declinedCount} declined
          </div>
        </div>

        {/* Catering Plate Impact */}
        <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between stagger-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Confirmed Catering
              </span>
              <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shadow-xs">
                <Utensils className="w-4 h-4" strokeWidth={1.75} />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {formatCurrency(totalCateringImpact, eventPlan.currency)}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            ~{formatCurrency(estCostPerPlate, eventPlan.currency)} per plate rate
          </div>
        </div>

        {/* Quick Scenario Simulator */}
        <div className="glass-widget border-indigo-200/70 dark:border-indigo-900/60 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between stagger-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" strokeWidth={1.75} />
                AI Guest Surge
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50/80 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                1-Click
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Simulate 50 surprise late RSVPs & calculate plate overruns.
            </p>
          </div>
          <button
            onClick={onTriggerGuestSurgeScenario}
            className="mt-4 w-full py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Simulate +50 Guests</span>
          </button>
        </div>
      </div>

      {/* Dietary Requirements Matrix */}
      <div className="glass-widget rounded-2xl p-5 sm:p-6 shadow-sm stagger-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
              Dietary Requirements & Kitchen Specifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live dietary mix across confirmed attendees sent to head chef & banquet team
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Total Confirmed Plates: {confirmedCount}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {(
            [
              { label: 'Vegetarian', count: dietaryBreakdown['Vegetarian'], color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
              { label: 'Jain (No Root)', count: dietaryBreakdown['Jain'], color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
              { label: 'Vegan', count: dietaryBreakdown['Vegan'], color: 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800' },
              { label: 'Gluten-Free', count: dietaryBreakdown['Gluten-Free'], color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800' },
              { label: 'Halal Certified', count: dietaryBreakdown['Halal'], color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
              { label: 'Standard', count: dietaryBreakdown['Standard'], color: 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
            ] as const
          ).map((item) => {
            const percent = confirmedCount > 0 ? Math.round((item.count / confirmedCount) * 100) : 0;
            return (
              <div key={item.label} className={`p-3.5 rounded-xl border ${item.color}`}>
                <span className="text-[11px] font-semibold block">{item.label}</span>
                <div className="text-xl sm:text-2xl font-bold font-mono mt-1">{item.count}</div>
                <div className="mt-1 flex items-center justify-between text-[10px] opacity-80">
                  <span>{percent}% share</span>
                  <div className="w-12 h-1.5 rounded-full bg-current/20 overflow-hidden">
                    <div className="h-full bg-current rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guest Directory Controls & Table */}
      <div className="glass-widget rounded-2xl shadow-sm overflow-hidden stagger-3">
        {/* Table Filter Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200/70 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 dark:bg-slate-850/40 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
              <input
                type="text"
                placeholder="Search guest name, email, table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48 sm:w-64"
              />
            </div>

            {/* Cohort Filter */}
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Cohorts</option>
              <option value="Family">Family</option>
              <option value="VIP">VIPs & Dignitaries</option>
              <option value="Friends">Friends</option>
              <option value="Colleagues">Colleagues</option>
              <option value="Performers">Performers & Artists</option>
              <option value="Volunteers">Volunteers</option>
            </select>

            {/* Dietary Filter */}
            <select
              value={selectedDietary}
              onChange={(e) => setSelectedDietary(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Dietary Specs</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Jain">Jain</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
              <option value="Halal">Halal</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredGuests.length} of {guests.length} entries
            </span>
            <button
              onClick={() => setIsAddGuestModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Add Guest</span>
            </button>
          </div>
        </div>

        {/* Guest Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Guest & Cohort</th>
                <th className="py-3.5 px-5">RSVP Status</th>
                <th className="py-3.5 px-5">Dietary Spec</th>
                <th className="py-3.5 px-5">VIP Tier</th>
                <th className="py-3.5 px-5">Table / Seating</th>
                <th className="py-3.5 px-5">Party Size</th>
                <th className="py-3.5 px-5">Logistical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    No guests found matching current search or filters.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  return (
                    <tr key={guest.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors duration-150">
                      {/* Name & Cohort */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">
                          {guest.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-slate-500 dark:text-slate-400">
                          <span>{guest.email}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                            {guest.cohort}
                          </span>
                        </div>
                      </td>

                      {/* RSVP Status toggle */}
                      <td className="py-4 px-5">
                        <select
                          value={guest.rsvpStatus}
                          onChange={(e) => onUpdateGuestStatus(guest.id, e.target.value as RsvpStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                            guest.rsvpStatus === 'Confirmed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : guest.rsvpStatus === 'Pending'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Pending">Pending</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </td>

                      {/* Dietary Spec */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          <Utensils className="w-3 h-3 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
                          <span>{guest.dietary}</span>
                        </span>
                      </td>

                      {/* VIP Tier */}
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                          guest.vipTier === 'VVIP'
                            ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : guest.vipTier === 'VIP'
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {guest.vipTier === 'VVIP' && <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />}
                          <span>{guest.vipTier}</span>
                        </span>
                      </td>

                      {/* Table / Seating */}
                      <td className="py-4 px-5 font-mono text-slate-700 dark:text-slate-300">
                        {guest.tableNumber || 'Unassigned'}
                      </td>

                      {/* Party Size (+Ones) */}
                      <td className="py-4 px-5 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {1 + (guest.plusOnes || 0)} pax{' '}
                        {guest.plusOnes > 0 && (
                          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 font-sans">
                            (+{guest.plusOnes})
                          </span>
                        )}
                      </td>

                      {/* Logistical Notes */}
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={guest.notes}>
                        {guest.notes || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Guest Modal */}
      {isAddGuestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Add Attendee or Cohort Lead
              </h3>
              <button
                onClick={() => setIsAddGuestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateGuest} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Guest Full Name / Group Title</label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g. Vikram & Sunita Sharma"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email / Phone</label>
                <input
                  type="text"
                  value={newGuestEmail}
                  onChange={(e) => setNewGuestEmail(e.target.value)}
                  placeholder="guest@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cohort</label>
                  <select
                    value={newGuestCohort}
                    onChange={(e) => setNewGuestCohort(e.target.value as GuestCohort)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="Family">Family</option>
                    <option value="VIP">VIP</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="Performers">Performers</option>
                    <option value="Volunteers">Volunteers</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Dietary Spec</label>
                  <select
                    value={newGuestDietary}
                    onChange={(e) => setNewGuestDietary(e.target.value as DietaryOption)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Jain">Jain (No Root)</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Halal">Halal</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">VIP Tier</label>
                  <select
                    value={newGuestVipTier}
                    onChange={(e) => setNewGuestVipTier(e.target.value as VipTier)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="VIP">VIP</option>
                    <option value="VVIP">VVIP</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Plus-Ones</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newGuestPlusOnes}
                    onChange={(e) => setNewGuestPlusOnes(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Table Seating</label>
                  <input
                    type="text"
                    value={newGuestTable}
                    onChange={(e) => setNewGuestTable(e.target.value)}
                    placeholder="Table 1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Notes / Accessibility Requirements</label>
                <textarea
                  rows={2}
                  value={newGuestNotes}
                  onChange={(e) => setNewGuestNotes(e.target.value)}
                  placeholder="Wheelchair access, early dinner timing, specific allergy..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddGuestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all duration-150 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-150 active:scale-[0.98] shadow-xs"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
