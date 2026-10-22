import { EventPlan } from '../types/event';

export const PRESET_A_WEDDING: EventPlan = {
  id: 'preset-wedding-heritage',
  name: 'Royal Heritage Wedding (Rajputana & Modern Fusion)',
  type: 'wedding',
  date: '2026-11-28',
  guestCount: 250,
  totalBudget: 1500000, // ₹15,00,000
  currency: 'INR',
  venue: {
    name: 'Chunda Palace Courtyard & Zenana Gardens',
    type: 'outdoor',
    capacity: 350,
    location: 'Udaipur, Rajasthan',
    isRainSheltered: false,
  },
  weatherCondition: 'Sunny & Clear',
  themeVibe: 'Imperial Marigold & Contemporary Rose Gold Royal Fusion',
  budgetCategories: [
    {
      id: 'cat-venue',
      category: 'Venue & Palace Courtyard Rental',
      allocated: 450000,
      estimatedActual: 450000,
      status: 'On Track',
      aiCostSavingTip: 'Book off-peak guest rooms block early to waive lawn electricity and night curfew surcharges.',
      notes: 'Includes Zenana lawns, poolside cabanas, and indoor backup ballroom.'
    },
    {
      id: 'cat-catering',
      category: 'Catering, Royal Thali & Mixology Bar',
      allocated: 420000,
      estimatedActual: 435000,
      status: 'Overrun Risk',
      aiCostSavingTip: 'Shift from 6 live live-counter desserts to 3 heritage signature counters (Ghewar, Malpua rabdi, Kulfi) to shave ₹40k.',
      notes: 'Rate ₹1,680/plate for 250 pax + evening cocktail bar.'
    },
    {
      id: 'cat-decor',
      category: 'Floral Mandap, Stage & Ambient Lighting',
      allocated: 220000,
      estimatedActual: 215000,
      status: 'Optimized',
      aiCostSavingTip: 'Use local Rajnigandha & Marigolds instead of imported Dutch carnations for day ceremonies.',
      notes: 'Includes floating flower pool, kinetic stage lighting, and royal canopy.'
    },
    {
      id: 'cat-photo',
      category: 'Cinematography, Drone & Candid Photography',
      allocated: 140000,
      estimatedActual: 140000,
      status: 'On Track',
      aiCostSavingTip: 'Package includes drone permissions and same-day 60-second Instagram reel edit.',
      notes: '4-camera crew covering all 3 ritual days.'
    },
    {
      id: 'cat-sound',
      category: 'Live Acoustic Folk, DJ & Line-Array Sound',
      allocated: 95000,
      estimatedActual: 90000,
      status: 'Optimized',
      aiCostSavingTip: 'Use in-house venue sound scaffolding rather than third-party trussing.',
      notes: 'Manganiyar folk band for Baraat + celebrity DJ for Sangeet.'
    },
    {
      id: 'cat-attire',
      category: 'Bridal, Groom & Family Trousseau Styling',
      allocated: 80000,
      estimatedActual: 80000,
      status: 'On Track',
      aiCostSavingTip: 'Coordinate bulk safa (turban) tying and jewelry rental vendor bundle.',
      notes: 'Hair & makeup artist booked for 4 sessions.'
    },
    {
      id: 'cat-logistics',
      category: 'Guest Shuttles, Luggage & Valet Logistics',
      allocated: 45000,
      estimatedActual: 48000,
      status: 'On Track',
      aiCostSavingTip: 'Schedule synchronized airport batch pick-ups instead of on-demand sedans.',
      notes: '3 Tempo Travellers and dedicated palace valet counter.'
    },
    {
      id: 'cat-contingency',
      category: 'Weather & Emergency Contingency Reserve',
      allocated: 50000,
      estimatedActual: 22000,
      status: 'Optimized',
      aiCostSavingTip: 'Waterproof marquee tent vendor on 2-hour standby with deposit.',
      notes: 'Buffer for overtime generator fuel and last-minute floral additions.'
    }
  ],
  timelineNodes: [
    {
      id: 't-pre-1',
      title: 'Mandap Floral Rigging & Sound Check',
      timeSlot: '08:00 AM - 10:30 AM',
      phase: 'day-of',
      category: 'Setup & Production',
      owner: 'Floral Production Lead',
      dependsOn: ['Palace Courtyard Handover'],
      hasConflict: false,
      conflictWarning: null,
      status: 'completed',
      notes: 'Mandap frame anchored; sound line arrays tuned to 85dB palace curfew norms.',
      isOutdoorDependent: true
    },
    {
      id: 't-pre-2',
      title: 'Palace Courtyard Handover & Power Check',
      timeSlot: '06:30 AM - 08:00 AM',
      phase: 'day-of',
      category: 'Venue Logistics',
      owner: 'Palace Liaison',
      dependsOn: [],
      hasConflict: false,
      conflictWarning: null,
      status: 'completed',
      notes: 'Check 63A 3-phase generator connection and perimeter ambient lanterns.',
      isOutdoorDependent: true
    },
    {
      id: 't-haldi',
      title: 'Sunny Courtyard Haldi & Floral Splash',
      timeSlot: '10:30 AM - 12:30 PM',
      phase: 'day-of',
      category: 'Rituals',
      owner: 'Ceremony Coordinator',
      dependsOn: ['Mandap Floral Rigging & Sound Check'],
      hasConflict: false,
      conflictWarning: null,
      status: 'completed',
      notes: 'Organic yellow marigold petals & brass urli seating for bride & groom.',
      isOutdoorDependent: true
    },
    {
      id: 't-lunch',
      title: 'Traditional Rajasthani Thali Lunch',
      timeSlot: '12:45 PM - 02:30 PM',
      phase: 'day-of',
      category: 'Catering',
      owner: 'Royal Spice Catering Lead',
      dependsOn: ['Sunny Courtyard Haldi & Floral Splash'],
      hasConflict: false,
      conflictWarning: null,
      status: 'in-progress',
      notes: 'Dal Baati Churma, Gatte ki Sabzi, and cold mint chhaas stations.',
      isOutdoorDependent: false
    },
    {
      id: 't-trousseau',
      title: 'Bridal & Groom Royal Attire & Portraiture',
      timeSlot: '03:00 PM - 05:00 PM',
      phase: 'day-of',
      category: 'Photography & Styling',
      owner: 'Lead Candid Photographer',
      dependsOn: ['Traditional Rajasthani Thali Lunch'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Golden hour drone portraits on palace balcony overlooking Lake Pichola.',
      isOutdoorDependent: false
    },
    {
      id: 't-baraat',
      title: 'Grand Baraat Procession with Dhol & Brass Band',
      timeSlot: '05:30 PM - 07:00 PM',
      phase: 'day-of',
      category: 'Procession',
      owner: 'Event Security & Logistics Lead',
      dependsOn: ['Bridal & Groom Royal Attire & Portraiture'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Decorated vintage open car, 12 dhol players, and illuminated handheld umbrellas.',
      isOutdoorDependent: true
    },
    {
      id: 't-varmala',
      title: 'Sunset Varmala & Cold-Pyro Sparkulars',
      timeSlot: '07:15 PM - 07:45 PM',
      phase: 'day-of',
      category: 'Rituals',
      owner: 'Stage Technical Director',
      dependsOn: ['Grand Baraat Procession with Dhol & Brass Band'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Synchronized smoke fountain and floral shower upon garland exchange.',
      isOutdoorDependent: true
    },
    {
      id: 't-pheras',
      title: 'Vedic Pheras Around Sacred Fire',
      timeSlot: '08:00 PM - 09:30 PM',
      phase: 'day-of',
      category: 'Rituals',
      owner: 'Head Vedic Priest',
      dependsOn: ['Sunset Varmala & Cold-Pyro Sparkulars'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Chanting accompanied by live acoustic sitar and flute maestro.',
      isOutdoorDependent: true
    },
    {
      id: 't-dinner',
      title: 'Royal Banquet Dinner & Live Mixology Bar',
      timeSlot: '08:30 PM - 11:30 PM',
      phase: 'day-of',
      category: 'Catering & Hospitality',
      owner: 'F&B Operations Director',
      dependsOn: ['Sunset Varmala & Cold-Pyro Sparkulars'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Grand buffet opens alongside dessert pavilion.',
      isOutdoorDependent: false
    },
    {
      id: 't-sangeet',
      title: 'After-Party Sangeet & DJ Extravaganza',
      timeSlot: '10:00 PM - 01:30 AM',
      phase: 'day-of',
      category: 'Entertainment',
      owner: 'DJ Sound Engineer',
      dependsOn: ['Vedic Pheras Around Sacred Fire'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Indoor ballroom after 10:00 PM to strictly comply with palace outdoor audio curfew.',
      isOutdoorDependent: false
    }
  ],
  vendors: [
    {
      id: 'v-1',
      name: 'Royal Spice Heritage Catering',
      role: 'Catering & Mixology',
      contactPerson: 'Chef Vikramaditya Singh',
      email: 'vikram@royalspiceudr.com',
      phone: '+91 98290 44123',
      slaDeadline: 'Today 12:00 PM (Lunch) & 07:45 PM (Dinner Prep)',
      paymentMilestone: 'Deposit Paid',
      amount: 420000,
      currency: 'INR',
      actionRequiredReason: undefined,
      lastNoticeGenerated: {
        timestamp: '2 hours ago',
        trigger: 'Initial Briefing Confirmation',
        subject: 'Catering Run-of-Show & Dietary Headcount Confirmation (250 Pax)',
        message: 'Dear Chef Vikram, confirming 250 pax banquet with 30 strict Jain covers and 15 live counters. Afternoon lunch setup ready by 12:15 PM.',
        sent: true
      }
    },
    {
      id: 'v-2',
      name: 'Mewar Floral & Scenic Fabricators',
      role: 'Stage Decor & Florals',
      contactPerson: 'Ananya Sharma',
      email: 'ananya@mewardecor.in',
      phone: '+91 94140 88219',
      slaDeadline: 'Today 04:30 PM (Varmala Stage Ready)',
      paymentMilestone: 'Deposit Paid',
      amount: 220000,
      currency: 'INR',
      lastNoticeGenerated: {
        timestamp: '3 hours ago',
        trigger: 'Setup Inspection',
        subject: 'Mandap Floral Inspection & Weather Standby Alert',
        message: 'Hi Ananya, courtyard mandap structural inspection passed. Please ensure all floral foam dampeners are sealed against Rajasthan afternoon heat.',
        sent: true
      }
    },
    {
      id: 'v-3',
      name: 'Lumière Cine Studios (Wedding Films)',
      role: 'Candid Photography & Cinematography',
      contactPerson: 'Rohan Mehra',
      email: 'rohan@lumiereweddings.com',
      phone: '+91 99201 11840',
      slaDeadline: 'Today 02:45 PM (Bridal Suite Setup)',
      paymentMilestone: 'Deposit Paid',
      amount: 140000,
      currency: 'INR'
    },
    {
      id: 'v-4',
      name: 'Desert Beats Sound & Line Array',
      role: 'AV, DJ & Live Acoustics',
      contactPerson: 'DJ Kunal / Sandeep',
      email: 'desertbeats.av@gmail.com',
      phone: '+91 98112 55901',
      slaDeadline: 'Today 04:00 PM (Baraat Sound Truck Ready)',
      paymentMilestone: 'Pending Approval',
      amount: 95000,
      currency: 'INR',
      actionRequiredReason: 'Stage 2 payout pending sound limiter certificate sign-off.'
    },
    {
      id: 'v-5',
      name: 'Chunda Palace Banquets & Lawns',
      role: 'Venue & Hospitality Partner',
      contactPerson: 'Col. Ranjit Rathore (Retd)',
      email: 'banquets@chundapalace.com',
      phone: '+91 94141 33201',
      slaDeadline: 'Continuous Protocol (Day-of)',
      paymentMilestone: 'Paid in Full',
      amount: 450000,
      currency: 'INR'
    },
    {
      id: 'v-6',
      name: 'Marwar Safa & Trousseau Drapers',
      role: 'Attire & Cultural Styling',
      contactPerson: 'Masterji Govind',
      email: 'govind.safas@gmail.com',
      phone: '+91 97820 90112',
      slaDeadline: 'Today 04:30 PM (Safa Station Setup)',
      paymentMilestone: 'Action Required',
      amount: 80000,
      currency: 'INR',
      actionRequiredReason: 'Confirm color allocation: Peach for groom side, Powder Blue for bride side.'
    },
    {
      id: 'v-7',
      name: 'Rajputana Royal Shuttles & Fleet',
      role: 'Guest Shuttles & Logistics',
      contactPerson: 'Dharmesh Joshi',
      email: 'dharmesh@royalfleetz.com',
      phone: '+91 98280 77123',
      slaDeadline: 'Today 01:30 PM (Airport Run #3)',
      paymentMilestone: 'Deposit Paid',
      amount: 45000,
      currency: 'INR'
    }
  ],
  ideation: {
    decorMoodboard: [
      {
        id: 'decor-1',
        title: 'Rajputana Marigold Royalty with Modern Brass',
        vibe: 'Regal, earthy gold, aromatic freshness',
        description: 'Tiers of natural orange genda and white mogra cascades hung from hand-carved stone arches with antique brass urlis.',
        colorHexes: ['#F59E0B', '#B45309', '#FEF3C7', '#78350F'],
        costImpact: 'Included in Base Package',
        tags: ['Eco-Friendly', 'Heritage', 'Fragrant'],
        imagePlaceholder: 'Palace Arch & Marigolds'
      },
      {
        id: 'decor-2',
        title: 'Enchanted Mirror-Mosaic (Thikri) Sangeet Stage',
        vibe: 'Glamorous, kinetic, modern palace night',
        description: 'Laser-cut mirrors embedded in jali screens that reflect moving beam lights and cold sparkulars without generating smoke.',
        colorHexes: ['#4C1D95', '#C084FC', '#0F172A', '#E2E8F0'],
        costImpact: '+₹35,000 for motorized truss',
        tags: ['High-Energy', 'Photo-Op', 'Sangeet'],
        imagePlaceholder: 'Mirror Mosaic Stage'
      },
      {
        id: 'decor-3',
        title: 'Zenana Lotus Pond Floating Candlelight',
        vibe: 'Serene, romantic, ethereal',
        description: 'Over 600 hand-dipped beeswax floating diyas surrounded by pink lotus buds lining the central water channel.',
        colorHexes: ['#EC4899', '#F43F5E', '#10B981', '#FFF1F2'],
        costImpact: '+₹18,000 (biodegradable wax)',
        tags: ['Romantic', 'Water Feature', 'Night Varmala'],
        imagePlaceholder: 'Lotus Water Channel'
      },
      {
        id: 'decor-4',
        title: 'Handcrafted Blue Pottery Bar & Lounge',
        vibe: 'Artisanal chic, Jaipur-inspired cocktail alcove',
        description: 'Ceramic tile bar counter with custom illuminated cocktail signs serving signature saffron gin fizzes.',
        colorHexes: ['#1E3A8A', '#38BDF8', '#F8FAFC', '#D97706'],
        costImpact: '+₹22,000 bar styling',
        tags: ['Artisan', 'Cocktails', 'Instagrammable'],
        imagePlaceholder: 'Blue Pottery Bar'
      }
    ],
    dietaryMenu: [
      {
        id: 'menu-1',
        dish: 'Smoked Dal Baati Churma with Panchkuta',
        course: 'Main Course',
        dietary: ['Vegetarian', 'Jain Option (No Onion/Garlic)'],
        costPerHead: 480,
        aiPairingNotes: 'Pair with aged spiced buttermilk (chhaas) and wild berry chutney.'
      },
      {
        id: 'menu-2',
        dish: 'Laal Maas Croquettes & Paneer Soola Skewers',
        course: 'Appetizers',
        dietary: ['Non-Veg / Veg Split', 'Gluten-Free Skewers'],
        costPerHead: 360,
        aiPairingNotes: 'Live tandoor charring at 07:30 PM with raw mango mint dip.'
      },
      {
        id: 'menu-3',
        dish: 'Gold-Leaf Ghewar with Saffron Rabdi & Pistachio Gelato',
        course: 'Desserts & Bar',
        dietary: ['Vegetarian', 'Eggless', 'Nut Allergy Alert'],
        costPerHead: 240,
        aiPairingNotes: 'Flash-torched live at dessert island.'
      },
      {
        id: 'menu-4',
        dish: 'Midnight Masala Kulcha & Spiced Kadak Chai',
        course: 'Late-Night Snacks',
        dietary: ['Vegetarian', 'Vegan on request'],
        costPerHead: 150,
        aiPairingNotes: 'Served from vintage rolling carts at 11:45 PM for energetic sangeet dancers.'
      }
    ],
    guestEngagement: [
      {
        id: 'act-1',
        activity: 'Live Perfume Bar (Ittar Blending Station)',
        targetAudience: 'All Guests (Memorable Keepsake)',
        duration: '3 hours during evening cocktails',
        costImpact: '₹28,000 for 250 custom 15ml flacons',
        engagementScore: 94,
        notes: 'Kannauj perfumers guide guests to blend personalized oud, rose, or khus scent.'
      },
      {
        id: 'act-2',
        activity: 'Instant Polaroid Wall & Guest Audio Guestbook',
        targetAudience: 'Youth & Family',
        duration: 'Throughout Sangeet & Reception',
        costImpact: '₹14,000 including vintage telephone recorder',
        engagementScore: 91,
        notes: 'Vintage rotary phone records heartwarming audio voicemails.'
      },
      {
        id: 'act-3',
        activity: 'Baraat Flashmob Choreography Masterclass',
        targetAudience: 'Friends & Cousins (50 pax)',
        duration: '30 mins before Baraat starts',
        costImpact: '₹8,000 choreographer fee',
        engagementScore: 88,
        notes: 'Quick sync of 3 viral hook steps to energize the groom procession.'
      }
    ],
    sustainabilitySwaps: [
      {
        id: 'sust-1',
        standardItem: 'Cut Imported Dutch Flowers & Floral Foam',
        ecoSwap: 'Locally Harvested Marigolds, Mogra & Potted Palms',
        co2Saved: '420 kg CO2e',
        costDelta: '-18% cost savings',
        status: 'Adopted'
      },
      {
        id: 'sust-2',
        standardItem: 'Printed 4-Page Program Booklets & Welcome Letters',
        ecoSwap: 'Dynamic EventPulse NFC Tap Cards & WhatsApp Concierge',
        co2Saved: '85 kg CO2e',
        costDelta: '-65% print savings',
        status: 'Adopted'
      },
      {
        id: 'sust-3',
        standardItem: 'Single-Use Plastic Water Bottles on Tables',
        ecoSwap: 'Chilled Glass Dispensers with Copper Tumblers',
        co2Saved: '110 kg CO2e + 900 bottles avoided',
        costDelta: '-10% hydration spend',
        status: 'Adopted'
      }
    ]
  },
  guests: [
    {
      id: 'gst-w1',
      name: 'Maharaja Digvijay Singh & Family',
      email: 'digvijay.singh@chundapalace.com',
      phone: '+91 98290 10001',
      cohort: 'VIP',
      rsvpStatus: 'Confirmed',
      dietary: 'Vegetarian',
      tableNumber: 'Table 1 (Imperial Royal)',
      vipTier: 'VVIP',
      plusOnes: 3,
      notes: 'Palace trustees. Reserve front-row Mandap seating.'
    },
    {
      id: 'gst-w2',
      name: 'Vikramaditya & Gayatri Rathore',
      email: 'rathore.vikram@heritageholdings.in',
      phone: '+91 98290 22345',
      cohort: 'Family',
      rsvpStatus: 'Confirmed',
      dietary: 'Jain',
      tableNumber: 'Table 2 (Zenana Lawn)',
      vipTier: 'VIP',
      plusOnes: 2,
      notes: 'Strict Jain thali (no root veggies, sunset dinner service).'
    },
    {
      id: 'gst-w3',
      name: 'Aanya & Siddharth Khurana',
      email: 'aanya.khurana@fintechglobal.com',
      phone: '+91 98110 33456',
      cohort: 'Friends',
      rsvpStatus: 'Confirmed',
      dietary: 'Gluten-Free',
      tableNumber: 'Table 5 (Lakeside Cabana)',
      vipTier: 'General',
      plusOnes: 1,
      notes: 'Gluten-free dessert & cocktail pairing requested.'
    },
    {
      id: 'gst-w4',
      name: 'Dr. Devashish & Sunita Roy',
      email: 'devashish.roy@delhimedical.org',
      phone: '+91 98101 44567',
      cohort: 'Family',
      rsvpStatus: 'Confirmed',
      dietary: 'Standard',
      tableNumber: 'Table 3 (Central Courtyard)',
      vipTier: 'VIP',
      plusOnes: 1,
      notes: 'Bride’s maternal uncle.'
    },
    {
      id: 'gst-w5',
      name: 'Aditya & Meera Singhania',
      email: 'singhania.aditya@mumbaicapital.com',
      phone: '+91 98200 55678',
      cohort: 'VIP',
      rsvpStatus: 'Pending',
      dietary: 'Vegan',
      tableNumber: 'Table 4 (Rose Pavillion)',
      vipTier: 'VIP',
      plusOnes: 1,
      notes: 'Awaiting flight confirmation from London.'
    },
    {
      id: 'gst-w6',
      name: 'Rohan Mehra & Sangeet Squad',
      email: 'rohan.mehra@creativestudios.in',
      phone: '+91 98295 66789',
      cohort: 'Performers',
      rsvpStatus: 'Confirmed',
      dietary: 'Standard',
      tableNumber: 'Table 7 (Artists Lounge)',
      vipTier: 'General',
      plusOnes: 4,
      notes: 'Sangeet flash-mob choreographers. Early green room snack service.'
    },
    {
      id: 'gst-w7',
      name: 'Kavita & Arvind Joshi',
      email: 'joshi.arvind@puneassociates.in',
      phone: '+91 98230 77890',
      cohort: 'Colleagues',
      rsvpStatus: 'Confirmed',
      dietary: 'Vegetarian',
      tableNumber: 'Table 6 (Bougainvillea Arch)',
      vipTier: 'General',
      plusOnes: 1,
      notes: 'Groom’s senior management partners.'
    },
    {
      id: 'gst-w8',
      name: 'Sameer Qureshi',
      email: 'sameer.q@dubaiinvest.ae',
      phone: '+971 50 123 4567',
      cohort: 'Friends',
      rsvpStatus: 'Confirmed',
      dietary: 'Halal',
      tableNumber: 'Table 5 (Lakeside Cabana)',
      vipTier: 'VIP',
      plusOnes: 1,
      notes: 'Halal certified meal requested.'
    },
    {
      id: 'gst-w9',
      name: 'Pooja Bhatt & Team',
      email: 'pooja.b@mumbaibride.com',
      phone: '+91 98205 88901',
      cohort: 'Colleagues',
      rsvpStatus: 'Declined',
      dietary: 'Standard',
      tableNumber: 'Unassigned',
      vipTier: 'General',
      plusOnes: 0,
      notes: 'Unable to attend due to conflicting European fashion week.'
    },
    {
      id: 'gst-w10',
      name: 'Pandit Vidyadhar Shastri & Acolytes',
      email: 'vidyadhar.shastri@vedicceremonies.org',
      phone: '+91 98292 99012',
      cohort: 'VIP',
      rsvpStatus: 'Confirmed',
      dietary: 'Jain',
      tableNumber: 'Table 1 (Imperial Royal)',
      vipTier: 'VVIP',
      plusOnes: 2,
      notes: 'Head Vedic Priest. Sattvic, ginger/garlic-free temple cuisine only.'
    }
  ],
  meta: {}
};

export const PRESET_B_BIRTHDAY: EventPlan = {
  id: 'preset-birthday-gala',
  name: 'Milestone 30th Birthday Gala (Neon Cyberpunk & House Beats)',
  type: 'birthday',
  date: '2026-10-10',
  guestCount: 80,
  totalBudget: 150000, // ₹1,50,000
  currency: 'INR',
  venue: {
    name: 'Skyline Lumina 360 Rooftop Lounge',
    type: 'outdoor',
    capacity: 120,
    location: 'Indiranagar, Bengaluru',
    isRainSheltered: false,
  },
  weatherCondition: 'Mild Breeze',
  themeVibe: 'Electric Violet & Cyberpunk Minimalist Chic',
  budgetCategories: [
    {
      id: 'cat-b-venue',
      category: 'Rooftop Lounge Minimum Spend & Rental',
      allocated: 55000,
      estimatedActual: 55000,
      status: 'On Track',
      aiCostSavingTip: 'Negotiate waiving venue hire fee since total beverage spend exceeds ₹50k guarantee.',
      notes: 'Includes dedicated private sky-deck, cocktail high-tables, and private restroom.'
    },
    {
      id: 'cat-b-bar',
      category: 'Artisanal Cocktails & Tapas Grazing Board',
      allocated: 45000,
      estimatedActual: 48000,
      status: 'Overrun Risk',
      aiCostSavingTip: 'Cap premium single malt bar to 2 hours, then transition to 3 signature neon cocktails.',
      notes: 'Custom mocktail bar for non-drinkers included.'
    },
    {
      id: 'cat-b-decor',
      category: 'Neon Signage, LED Arches & Photo Booth',
      allocated: 20000,
      estimatedActual: 18500,
      status: 'Optimized',
      aiCostSavingTip: 'Rent custom laser-cut acrylic neon instead of permanent purchase.',
      notes: '"Dirty Thirty & Thriving" custom UV neon centerpiece.'
    },
    {
      id: 'cat-b-sound',
      category: 'House DJ, Pioneer Decks & Laser Rig',
      allocated: 15000,
      estimatedActual: 15000,
      status: 'On Track',
      aiCostSavingTip: 'Lounge has house subwoofers; only external laser mapping needed.',
      notes: 'Deep house and disco funk playlist curation.'
    },
    {
      id: 'cat-b-cake',
      category: 'Artisan Comic Cake & Dessert Towers',
      allocated: 8000,
      estimatedActual: 7500,
      status: 'Optimized',
      aiCostSavingTip: 'Tiered 2D comic cake with dark chocolate raspberry ganache.',
      notes: 'Custom glitter candles and edible neon dust.'
    },
    {
      id: 'cat-b-contingency',
      category: 'Contingency & Late-Night Bites Buffer',
      allocated: 7000,
      estimatedActual: 2000,
      status: 'Optimized',
      aiCostSavingTip: 'Pre-order 10 flatbread pizzas with lounge kitchen manager at discount.',
      notes: 'Midnight slider buffer for late stayers.'
    }
  ],
  timelineNodes: [
    {
      id: 'tb-1',
      title: 'Neon Truss Setup & Bar Inventory Ingest',
      timeSlot: '04:30 PM - 06:00 PM',
      phase: 'day-of',
      category: 'Production',
      owner: 'Lounge Ops Lead',
      dependsOn: [],
      hasConflict: false,
      conflictWarning: null,
      status: 'completed',
      notes: 'Rigging neon arches, testing smoke haze machines.',
      isOutdoorDependent: true
    },
    {
      id: 'tb-2',
      title: 'Sound Check & Pioneer DJ Console Calibration',
      timeSlot: '06:00 PM - 07:00 PM',
      phase: 'day-of',
      category: 'AV & Sound',
      owner: 'DJ Sound Engineer',
      dependsOn: ['Neon Truss Setup & Bar Inventory Ingest'],
      hasConflict: false,
      conflictWarning: null,
      status: 'in-progress',
      notes: 'Sound calibrated for open rooftop acoustics without spilling past 90dB.',
      isOutdoorDependent: true
    },
    {
      id: 'tb-3',
      title: 'VIP Guest Arrival & Sunset Welcome Cocktails',
      timeSlot: '07:30 PM - 08:30 PM',
      phase: 'day-of',
      category: 'Hospitality',
      owner: 'Lead Host',
      dependsOn: ['Sound Check & Pioneer DJ Console Calibration'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Smoked rosemary gin & tonic welcome shots served at neon portal entrance.',
      isOutdoorDependent: true
    },
    {
      id: 'tb-4',
      title: 'Interactive 360 Spin Video Booth & Polaroid Wall',
      timeSlot: '08:00 PM - 10:30 PM',
      phase: 'day-of',
      category: 'Entertainment',
      owner: 'Photo Booth Tech',
      dependsOn: ['VIP Guest Arrival & Sunset Welcome Cocktails'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Slow-motion video with instant AirDrop/QR sharing.',
      isOutdoorDependent: false
    },
    {
      id: 'tb-5',
      title: 'Tapas Grazing Table & Gourmet Sliders Open',
      timeSlot: '08:45 PM - 10:45 PM',
      phase: 'day-of',
      category: 'Food & Beverage',
      owner: 'Skyline Head Chef',
      dependsOn: ['VIP Guest Arrival & Sunset Welcome Cocktails'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Artisanal cheese boards, truffle fries, pulled jackfruit/chicken sliders.',
      isOutdoorDependent: false
    },
    {
      id: 'tb-6',
      title: 'Birthday Roast & Toast by Best Friends',
      timeSlot: '09:45 PM - 10:15 PM',
      phase: 'day-of',
      category: 'Stage',
      owner: 'MC / Co-Host',
      dependsOn: ['Tapas Grazing Table & Gourmet Sliders Open'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Wireless mic handover, slideshow of college memories on LED wall.',
      isOutdoorDependent: true
    },
    {
      id: 'tb-7',
      title: 'Cake Cutting with Cold Sparkulars & Champagne Pop',
      timeSlot: '10:15 PM - 10:40 PM',
      phase: 'day-of',
      category: 'Key Moment',
      owner: 'Lead Host',
      dependsOn: ['Birthday Roast & Toast by Best Friends'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Dark chocolate comic cake brought to center stage with sparkling fountains.',
      isOutdoorDependent: true
    },
    {
      id: 'tb-8',
      title: 'High-Energy DJ Club Set & Laser Finale',
      timeSlot: '10:45 PM - 01:00 AM',
      phase: 'day-of',
      category: 'Entertainment',
      owner: 'DJ & Sound Lead',
      dependsOn: ['Cake Cutting with Cold Sparkulars & Champagne Pop'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Peak dance floor tracks, glow wristbands handed to all guests.',
      isOutdoorDependent: false
    }
  ],
  vendors: [
    {
      id: 'vb-1',
      name: 'Skyline 360 Lounge & Kitchen',
      role: 'Venue & Catering Partner',
      contactPerson: 'Varun Nair',
      email: 'varun@skyline360blr.com',
      phone: '+91 98450 11982',
      slaDeadline: 'Today 06:00 PM (Bar Ready)',
      paymentMilestone: 'Deposit Paid',
      amount: 100000,
      currency: 'INR'
    },
    {
      id: 'vb-2',
      name: 'GlowCraft Neon & Light Sculptures',
      role: 'Decor & Illumination',
      contactPerson: 'Simran Walia',
      email: 'simran@glowcraft.in',
      phone: '+91 97410 44812',
      slaDeadline: 'Today 05:00 PM (Signage Tested)',
      paymentMilestone: 'Paid in Full',
      amount: 20000,
      currency: 'INR'
    },
    {
      id: 'vb-3',
      name: 'DJ R3VIBE (Subhash)',
      role: 'AV & Music Producer',
      contactPerson: 'Subhash K',
      email: 'djr3vibe@gmail.com',
      phone: '+91 99001 77234',
      slaDeadline: 'Today 06:30 PM (Soundcheck)',
      paymentMilestone: 'Deposit Paid',
      amount: 15000,
      currency: 'INR'
    },
    {
      id: 'vb-4',
      name: 'Velvet Frost Pâtisserie',
      role: 'Custom Cake Designer',
      contactPerson: 'Chef Neha Rao',
      email: 'neha@velvetfrost.com',
      phone: '+91 98860 33219',
      slaDeadline: 'Today 07:00 PM (Chilled Delivery)',
      paymentMilestone: 'Paid in Full',
      amount: 8000,
      currency: 'INR'
    },
    {
      id: 'vb-5',
      name: 'Spin360 Motion Booths',
      role: 'Photo & Video Tech',
      contactPerson: 'Karthik S',
      email: 'spin360blr@gmail.com',
      phone: '+91 96112 88410',
      slaDeadline: 'Today 06:30 PM (Platform Installed)',
      paymentMilestone: 'Pending Approval',
      amount: 7000,
      currency: 'INR',
      actionRequiredReason: 'Need signed waiver for platform weight capacity (max 4 adults simultaneously).'
    }
  ],
  ideation: {
    decorMoodboard: [
      {
        id: 'db-1',
        title: 'Cyberpunk Neon Corridor & Tunnel of Light',
        vibe: 'Futuristic, ultra-photogenic, vibrant',
        description: 'Infinity neon arches leading into the rooftop deck with backlit acrylic plinths.',
        colorHexes: ['#A855F7', '#EC4899', '#06B6D4', '#0F172A'],
        costImpact: 'Included in Decor Budget',
        tags: ['Neon', 'Instagrammable', 'Cyberpunk'],
        imagePlaceholder: 'Cyberpunk Neon Portal'
      },
      {
        id: 'db-2',
        title: 'Illuminated Glow Furniture & LED Bar',
        vibe: 'Modern minimalist nightclub lounge',
        description: 'Color-changing wireless LED cube seats and cocktail high-boys synced to DJ beat.',
        colorHexes: ['#3B82F6', '#8B5CF6', '#1E293B', '#F8FAFC'],
        costImpact: '+₹8,000 for 12 glowing stools',
        tags: ['Nightclub', 'Ambient', 'High-Tech'],
        imagePlaceholder: 'Glow Furniture Deck'
      }
    ],
    dietaryMenu: [
      {
        id: 'mb-1',
        dish: 'Truffle Mushroom Brioche & Korean Fried Cauliflower',
        course: 'Appetizers',
        dietary: ['Vegetarian', 'Vegan Option'],
        costPerHead: 220,
        aiPairingNotes: 'Crisp gochujang glaze with toasted sesame dip.'
      },
      {
        id: 'mb-2',
        dish: 'Pulled Jackfruit & Barbecue Smoked Chicken Sliders',
        course: 'Main Course',
        dietary: ['Veg/Non-Veg Options', 'Brioche Buns'],
        costPerHead: 310,
        aiPairingNotes: 'Served with jalapeno slaw and purple sweet potato crisps.'
      },
      {
        id: 'mb-3',
        dish: 'Neon Pop Mocktail: Butterfly Pea & Lychee Sparkler',
        course: 'Desserts & Bar',
        dietary: ['Non-Alcoholic', 'Gluten-Free', 'Vegan'],
        costPerHead: 90,
        aiPairingNotes: 'Changes color from deep indigo to hot pink when citrus tonic is poured.'
      }
    ],
    guestEngagement: [
      {
        id: 'ab-1',
        activity: 'Flash Roast Master Game (Trivia on Birthday VIP)',
        targetAudience: 'All Close Friends',
        duration: '25 mins on Kahoot/Mobile buzzer',
        costImpact: 'Zero extra spend',
        engagementScore: 96,
        notes: 'Interactive mobile quiz with witty childhood photos displayed on lounge screens.'
      },
      {
        id: 'ab-2',
        activity: 'UV Neon Body Paint & Face Glitter Artist',
        targetAudience: 'Party Animals & Dancers',
        duration: '2 hours during DJ set',
        costImpact: '₹5,000 artist kit',
        engagementScore: 92,
        notes: 'Biodegradable cosmic shimmer and neon eyeliner applied live.'
      }
    ],
    sustainabilitySwaps: [
      {
        id: 'sb-1',
        standardItem: 'Mylar Balloon Arches & Confetti Poppers',
        ecoSwap: 'Reusable LED Neon Arches & Biodegradable Rice Paper Confetti',
        co2Saved: '35 kg plastic & zero helium waste',
        costDelta: '-15% rental savings',
        status: 'Adopted'
      },
      {
        id: 'sb-2',
        standardItem: 'Paper Printed Drink Menus',
        ecoSwap: 'QR Code Coasters with Dynamic Cocktail Selection',
        co2Saved: '12 kg paper',
        costDelta: 'Zero print spend',
        status: 'Adopted'
      }
    ]
  },
  guests: [
    {
      id: 'gst-b1',
      name: 'Tanvi Kapoor (Birthday VIP)',
      email: 'tanvi.kapoor@designpulse.co',
      phone: '+91 98330 11223',
      cohort: 'VIP',
      rsvpStatus: 'Confirmed',
      dietary: 'Gluten-Free',
      tableNumber: 'VIP Lounge Booth A',
      vipTier: 'VVIP',
      plusOnes: 1,
      notes: 'Birthday celebrant. Needs gluten-free customized cake slice first.'
    },
    {
      id: 'gst-b2',
      name: 'Rishi Vohra & Group',
      email: 'rishi.v@fintechventures.io',
      phone: '+91 98201 33445',
      cohort: 'Friends',
      rsvpStatus: 'Confirmed',
      dietary: 'Standard',
      tableNumber: 'Table 2 (Rooftop Rim)',
      vipTier: 'VIP',
      plusOnes: 3,
      notes: 'Close college friends group; champagne toast co-hosts.'
    },
    {
      id: 'gst-b3',
      name: 'Sneha Deshmukh',
      email: 'sneha.d@techscale.org',
      phone: '+91 98199 44556',
      cohort: 'Colleagues',
      rsvpStatus: 'Confirmed',
      dietary: 'Vegan',
      tableNumber: 'Table 4 (Skyline High-Tops)',
      vipTier: 'General',
      plusOnes: 1,
      notes: 'Plant-based mixology cocktails preferred.'
    },
    {
      id: 'gst-b4',
      name: 'Arjun & Tara Singhal',
      email: 'arjun.singhal@capitalpartners.in',
      phone: '+91 98200 55667',
      cohort: 'VIP',
      rsvpStatus: 'Confirmed',
      dietary: 'Vegetarian',
      tableNumber: 'VIP Lounge Booth B',
      vipTier: 'VIP',
      plusOnes: 1,
      notes: 'Angel investor colleagues.'
    },
    {
      id: 'gst-b5',
      name: 'DJ Ray & Audio Crew',
      email: 'ray.audio@deepgrooves.in',
      phone: '+91 98211 66778',
      cohort: 'Performers',
      rsvpStatus: 'Confirmed',
      dietary: 'Standard',
      tableNumber: 'DJ Console Deck',
      vipTier: 'General',
      plusOnes: 2,
      notes: 'Performer team, require energy drinks & sliders during midnight set.'
    },
    {
      id: 'gst-b6',
      name: 'Nikhil & Priya Nair',
      email: 'nikhil.nair@bengaluruai.com',
      phone: '+91 98450 77889',
      cohort: 'Friends',
      rsvpStatus: 'Pending',
      dietary: 'Halal',
      tableNumber: 'Table 3 (Cocktail Bar West)',
      vipTier: 'General',
      plusOnes: 1,
      notes: 'Flying in from Bengaluru, landing at 7:00 PM.'
    },
    {
      id: 'gst-b7',
      name: 'Aakash Mehta',
      email: 'aakash.mehta@indielaw.in',
      phone: '+91 98204 88990',
      cohort: 'Colleagues',
      rsvpStatus: 'Declined',
      dietary: 'Vegetarian',
      tableNumber: 'Unassigned',
      vipTier: 'General',
      plusOnes: 0,
      notes: 'Overseas litigation hearings.'
    },
    {
      id: 'gst-b8',
      name: 'Meena & Satish Kapoor',
      email: 'meena.kapoor@familycare.org',
      phone: '+91 98200 99001',
      cohort: 'Family',
      rsvpStatus: 'Confirmed',
      dietary: 'Vegetarian',
      tableNumber: 'VIP Lounge Booth A',
      vipTier: 'VVIP',
      plusOnes: 1,
      notes: 'Parents of celebrant. Comfortable low-noise seating desired.'
    }
  ],
  meta: {}
};

export const PRESET_C_COMMUNITY_FEST: EventPlan = {
  id: 'preset-community-fest',
  name: 'Neighborhood Cultural & Tech Community Fest',
  type: 'fest',
  date: '2026-12-05',
  guestCount: 500,
  totalBudget: 300000, // ₹3,00,000
  currency: 'INR',
  venue: {
    name: 'Greenwood Central Community Park & Amphitheatre',
    type: 'outdoor',
    capacity: 800,
    location: 'Sector 4, HSR Layout, Bengaluru',
    isRainSheltered: false,
  },
  weatherCondition: 'Sunny & Clear',
  themeVibe: 'Community Makers, Open Source & Sustainable Craft Fair',
  budgetCategories: [
    {
      id: 'cat-c-stage',
      category: 'Amphitheatre Stage, Truss & Canopy',
      allocated: 80000,
      estimatedActual: 78000,
      status: 'Optimized',
      aiCostSavingTip: 'Leverage municipal park fixed stage; only rent overhead waterproof canopy.',
      notes: 'Includes 24x16ft wooden riser, safety railings, and ADA-compliant ramp.'
    },
    {
      id: 'cat-c-sound',
      category: 'Public Address, Microphones & Acoustic Sound',
      allocated: 45000,
      estimatedActual: 45000,
      status: 'On Track',
      aiCostSavingTip: 'Partner with local music school for backline drumkit and guitar amps.',
      notes: 'Line array suitable for open ground voice clarity without neighbor noise complaints.'
    },
    {
      id: 'cat-c-stalls',
      category: 'Maker & Artisan Stalls (25 Modular Booths)',
      allocated: 65000,
      estimatedActual: 62000,
      status: 'Optimized',
      aiCostSavingTip: 'Sponsorship fee from 10 food vendors recovers ₹35,000 of stall cost.',
      notes: 'Octanorm booth frames with 1 table, 2 chairs, and individual 5A power socket.'
    },
    {
      id: 'cat-c-safety',
      category: 'First Aid, Security, Sanitation & Waste Mgmt',
      allocated: 35000,
      estimatedActual: 38000,
      status: 'On Track',
      aiCostSavingTip: 'Partner with local NGO "Hasiru Dala" for zero-waste segregation volunteers.',
      notes: '3 portable eco-toilets, 6 waste stations, and 1 ambulance on standby.'
    },
    {
      id: 'cat-c-marketing',
      category: 'Signage, Digital Flyers & Community Outreach',
      allocated: 25000,
      estimatedActual: 22000,
      status: 'Optimized',
      aiCostSavingTip: 'Use resident society WhatsApp channels and QR posters in grocery stores.',
      notes: 'Cloth banners across 4 neighborhood gates and Instagram sponsored geo-ads.'
    },
    {
      id: 'cat-c-power',
      category: 'Silent Diesel Generator & Distribution Boxes',
      allocated: 30000,
      estimatedActual: 32000,
      status: 'On Track',
      aiCostSavingTip: 'Tally exact stall wattage to avoid paying for an oversized 125kVA generator.',
      notes: 'Two 40kVA silent generators with rubber cable ramps across public walkways.'
    },
    {
      id: 'cat-c-contingency',
      category: 'Contingency & Volunteer Hydration Fund',
      allocated: 20000,
      estimatedActual: 8000,
      status: 'Optimized',
      aiCostSavingTip: 'Bulk 20L water cans with reusable stainless steel cups.',
      notes: 'Emergency fund for surprise crowd surge or police permission paperwork.'
    }
  ],
  timelineNodes: [
    {
      id: 'tc-1',
      title: 'Ground Marking, Stall Erection & Power Cabling',
      timeSlot: '06:00 AM - 09:30 AM',
      phase: 'day-of',
      category: 'Infrastructure',
      owner: 'Stall Production Lead',
      dependsOn: [],
      hasConflict: false,
      conflictWarning: null,
      status: 'completed',
      notes: '25 craft and food stalls assembled with safe electrical routing.',
      isOutdoorDependent: true
    },
    {
      id: 'tc-2',
      title: 'Sound Testing & Stage PA Equalization',
      timeSlot: '09:30 AM - 10:30 AM',
      phase: 'day-of',
      category: 'AV Production',
      owner: 'Acoustic Lead',
      dependsOn: ['Ground Marking, Stall Erection & Power Cabling'],
      hasConflict: false,
      conflictWarning: null,
      status: 'completed',
      notes: 'Acoustic levels tuned to stay below 65dB at park boundaries.',
      isOutdoorDependent: true
    },
    {
      id: 'tc-3',
      title: 'Gates Open & Community Maker Fair Starts',
      timeSlot: '11:00 AM - 01:30 PM',
      phase: 'day-of',
      category: 'Exhibition',
      owner: 'Volunteer Coordinator',
      dependsOn: ['Sound Testing & Stage PA Equalization'],
      hasConflict: false,
      conflictWarning: null,
      status: 'in-progress',
      notes: 'Handmade pottery, robotics demos, organic produce, and solar DIY stalls.',
      isOutdoorDependent: true
    },
    {
      id: 'tc-4',
      title: 'Tech Hackathon Demos & Youth Robotics Showcase',
      timeSlot: '02:00 PM - 04:00 PM',
      phase: 'day-of',
      category: 'Main Stage',
      owner: 'Tech Track Curator',
      dependsOn: ['Gates Open & Community Maker Fair Starts'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: '12 student teams pitch IoT water-conservation and AI neighborhood tools.',
      isOutdoorDependent: true
    },
    {
      id: 'tc-5',
      title: 'Street Play (Nukkad Natak) on Climate Action',
      timeSlot: '04:15 PM - 05:00 PM',
      phase: 'day-of',
      category: 'Cultural Stage',
      owner: 'Theater Troupe Lead',
      dependsOn: ['Tech Hackathon Demos & Youth Robotics Showcase'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'High-energy drum performance in center lawn gathering 300+ spectators.',
      isOutdoorDependent: true
    },
    {
      id: 'tc-6',
      title: 'Sunset Acoustic Folk-Fusion Band Performance',
      timeSlot: '05:30 PM - 07:30 PM',
      phase: 'day-of',
      category: 'Concert',
      owner: 'Stage Stage Manager',
      dependsOn: ['Street Play (Nukkad Natak) on Climate Action'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Local indie folk group performing Kannada and multilingual folk songs.',
      isOutdoorDependent: true
    },
    {
      id: 'tc-7',
      title: 'Community Awards & Zero-Waste Recognition Ceremony',
      timeSlot: '07:30 PM - 08:30 PM',
      phase: 'day-of',
      category: 'Ceremony',
      owner: 'RWA President',
      dependsOn: ['Sunset Acoustic Folk-Fusion Band Performance'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Honoring top innovators, young green crusaders, and elderly gardeners.',
      isOutdoorDependent: true
    },
    {
      id: 'tc-8',
      title: 'Eco-Teardown & Ground Cleanliness Audit',
      timeSlot: '08:45 PM - 10:30 PM',
      phase: 'day-of',
      category: 'Teardown',
      owner: 'Waste Management Officer',
      dependsOn: ['Community Awards & Zero-Waste Recognition Ceremony'],
      hasConflict: false,
      conflictWarning: null,
      status: 'pending',
      notes: 'Park returned in cleaner condition than received; 100% waste composted/recycled.',
      isOutdoorDependent: true
    }
  ],
  vendors: [
    {
      id: 'vc-1',
      name: 'Apex Octanorm Stall Fabricators',
      role: 'Stall & Canopy Infrastructure',
      contactPerson: 'Suresh Gowda',
      email: 'suresh@apexstalls.in',
      phone: '+91 94480 22109',
      slaDeadline: 'Today 08:30 AM (Stall Inspection)',
      paymentMilestone: 'Deposit Paid',
      amount: 65000,
      currency: 'INR'
    },
    {
      id: 'vc-2',
      name: 'Sonic Wave Open-Air Audio',
      role: 'Stage PA & Sound Engineering',
      contactPerson: 'Manojit Roy',
      email: 'manojit@sonicwaveaudio.com',
      phone: '+91 98451 90812',
      slaDeadline: 'Today 09:30 AM (Soundcheck)',
      paymentMilestone: 'Deposit Paid',
      amount: 45000,
      currency: 'INR'
    },
    {
      id: 'vc-3',
      name: 'Hasiru Dala Zero-Waste Operations',
      role: 'Waste Segregation & Composting',
      contactPerson: 'Padma Mary',
      email: 'events@hasirudala.org',
      phone: '+91 98801 44550',
      slaDeadline: 'Full Day (06:00 AM - 10:00 PM)',
      paymentMilestone: 'Paid in Full',
      amount: 35000,
      currency: 'INR'
    },
    {
      id: 'vc-4',
      name: 'PowerGrid Genset & Electricals',
      role: 'Silent Generators & Power Cabling',
      contactPerson: 'Kiran Reddy',
      email: 'kiran@powergridblr.com',
      phone: '+91 99000 66124',
      slaDeadline: 'Today 06:30 AM (Power Live)',
      paymentMilestone: 'Pending Approval',
      amount: 30000,
      currency: 'INR',
      actionRequiredReason: 'Safety earthing inspection report signed by BBMP electrical contractor.'
    },
    {
      id: 'vc-5',
      name: 'Greenwood Resident Volunteer Core',
      role: 'Crowd Navigation & First Aid',
      contactPerson: 'Dr. Meera Swaminathan',
      email: 'meera.swami@greenwoodrwa.org',
      phone: '+91 98452 77011',
      slaDeadline: 'Active (Rotational Shifts)',
      paymentMilestone: 'Paid in Full',
      amount: 0,
      currency: 'INR'
    }
  ],
  ideation: {
    decorMoodboard: [
      {
        id: 'dc-1',
        title: 'Upcycled Burlap, Bamboo & Khadi Bunting Canopy',
        vibe: 'Warm, earthy, communal celebration',
        description: 'Biodegradable cotton bunting flags, bamboo stall markers, and natural coir carpets.',
        colorHexes: ['#10B981', '#059669', '#F59E0B', '#78350F'],
        costImpact: 'Zero plastic waste footprint',
        tags: ['Zero-Waste', 'Earth-Friendly', 'Artisanal'],
        imagePlaceholder: 'Bamboo & Cloth Canopy'
      },
      {
        id: 'dc-2',
        title: 'Solar-Powered Fairy Light Tree Installations',
        vibe: 'Magical dusk transition',
        description: 'Banyan tree trunks wrapped with high-efficiency solar warm LED fairy lights.',
        colorHexes: ['#FBBF24', '#D97706', '#064E3B', '#111827'],
        costImpact: 'Supplied by student tech stall',
        tags: ['Solar Powered', 'Dusk Ambiance', 'Eco'],
        imagePlaceholder: 'Solar Light Tree'
      }
    ],
    dietaryMenu: [
      {
        id: 'mc-1',
        dish: 'Millet Bisibelebath with Crisp Tapioca Papad',
        course: 'Main Course',
        dietary: ['Gluten-Free', 'Vegetarian', 'Vegan'],
        costPerHead: 120,
        aiPairingNotes: 'Nutritious foxtail millet cooked with garden veggies in leaf plates.'
      },
      {
        id: 'mc-2',
        dish: 'Fresh Coconut Water & Sugarcane Mint Crush',
        course: 'Desserts & Bar',
        dietary: ['100% Raw', 'No Added Sugar', 'Zero Waste'],
        costPerHead: 50,
        aiPairingNotes: 'Served straight in coconut shells with compostable straw.'
      }
    ],
    guestEngagement: [
      {
        id: 'ac-1',
        activity: 'DIY Solar Robot & Clay Pottery Hands-On Workshop',
        targetAudience: 'Kids, Students & Families',
        duration: 'Continuous drop-in sessions',
        costImpact: 'Funded by stall fees',
        engagementScore: 98,
        notes: 'Over 180 children take home their self-assembled solar car toys.'
      },
      {
        id: 'ac-2',
        activity: 'Community Plant & Seed Exchange Booth',
        targetAudience: 'Garden Enthusiasts & Seniors',
        duration: 'All Day',
        costImpact: 'Zero cost (Community Barter)',
        engagementScore: 91,
        notes: 'Bring a sapling, take a native vegetable seed packet.'
      }
    ],
    sustainabilitySwaps: [
      {
        id: 'sc-1',
        standardItem: 'Disposable Plastic Cutlery & Thermocol Plates',
        ecoSwap: 'Rent-A-Cutlery Bank (Steel Plates & Spoons with Wash Station)',
        co2Saved: '380 kg plastic & 2,500 disposable items',
        costDelta: '-25% overall waste disposal cost',
        status: 'Adopted'
      },
      {
        id: 'sc-2',
        standardItem: 'Laminated Paper Stall Posters',
        ecoSwap: 'Chalkboard Wooden Easels with Eco-Chalk Art',
        co2Saved: '40 kg paper & plastic film',
        costDelta: '-50% signage spend',
        status: 'Adopted'
      }
    ]
  },
  guests: [
    {
      id: 'gst-c1',
      name: 'Priya Sundaram (Festival Lead)',
      email: 'priya.sundaram@koramangalacivic.org',
      phone: '+91 98450 12001',
      cohort: 'Volunteers',
      rsvpStatus: 'Confirmed',
      dietary: 'Vegetarian',
      tableNumber: 'Command Tent HQ',
      vipTier: 'VVIP',
      plusOnes: 0,
      notes: 'General festival coordinator & stage manager.'
    },
    {
      id: 'gst-c2',
      name: 'Dr. K. Venkataraman (RWA President)',
      email: 'venkataraman.k@koramangalacivic.org',
      phone: '+91 98451 23002',
      cohort: 'VIP',
      rsvpStatus: 'Confirmed',
      dietary: 'Vegetarian',
      tableNumber: 'Dignitary Pavillion A',
      vipTier: 'VVIP',
      plusOnes: 1,
      notes: 'Delivering keynote welcome address at 10:15 AM.'
    },
    {
      id: 'gst-c3',
      name: 'Farhan & Zoya Akhtar (Sponsors)',
      email: 'farhan@greenmobilityventures.in',
      phone: '+91 98452 34003',
      cohort: 'VIP',
      rsvpStatus: 'Confirmed',
      dietary: 'Halal',
      tableNumber: 'Dignitary Pavillion B',
      vipTier: 'VIP',
      plusOnes: 2,
      notes: 'Gold sponsors (Green Mobility Pavillion).'
    },
    {
      id: 'gst-c4',
      name: 'Koramangala Youth Volunteer Brigade',
      email: 'volunteers@koramangalacivic.org',
      phone: '+91 98453 45004',
      cohort: 'Volunteers',
      rsvpStatus: 'Confirmed',
      dietary: 'Standard',
      tableNumber: 'Volunteer Refreshment Hub',
      vipTier: 'General',
      plusOnes: 8,
      notes: 'Crowd direction, stage audio assistance & waste-management marshals.'
    },
    {
      id: 'gst-c5',
      name: 'Suhasini Rao (Handloom Collective)',
      email: 'suhasini.rao@karnatakacrafts.org',
      phone: '+91 98454 56005',
      cohort: 'Performers',
      rsvpStatus: 'Confirmed',
      dietary: 'Jain',
      tableNumber: 'Artisans Arcade Booth 1-4',
      vipTier: 'General',
      plusOnes: 2,
      notes: 'Handloom master artisans demonstrator.'
    },
    {
      id: 'gst-c6',
      name: 'Ananya & Tech Robotics Club',
      email: 'robotics@koramangalastem.org',
      phone: '+91 98455 67006',
      cohort: 'Colleagues',
      rsvpStatus: 'Confirmed',
      dietary: 'Vegan',
      tableNumber: 'Maker Space Stall 8',
      vipTier: 'General',
      plusOnes: 4,
      notes: 'Interactive student maker zone demonstrators.'
    },
    {
      id: 'gst-c7',
      name: 'Corporator Hemalatha Murthy',
      email: 'hemalatha.murthy@bbmp.gov.in',
      phone: '+91 98456 78007',
      cohort: 'VIP',
      rsvpStatus: 'Pending',
      dietary: 'Vegetarian',
      tableNumber: 'Dignitary Pavillion A',
      vipTier: 'VVIP',
      plusOnes: 2,
      notes: 'Civic permits guest of honour; awaiting protocol confirmation.'
    },
    {
      id: 'gst-c8',
      name: 'Bangalore Acoustic Folk Ensemble',
      email: 'folkbangalore@artscouncil.in',
      phone: '+91 98457 89008',
      cohort: 'Performers',
      rsvpStatus: 'Confirmed',
      dietary: 'Standard',
      tableNumber: 'Green Room 1',
      vipTier: 'General',
      plusOnes: 5,
      notes: 'Evening headliner live band musicians.'
    }
  ],
  meta: {}
};
