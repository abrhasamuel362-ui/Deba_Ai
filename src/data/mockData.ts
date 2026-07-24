import { Business, Booking, Review, ChatMessage, ClientRecord } from '../types';

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz_1',
    name: 'Glow & Co. Luxury Salon',
    tagline: 'Modern Hair Styling, Balayage & Skin Care',
    category: 'salon',
    categoryLabel: 'Salon & Beauty',
    rating: 4.9,
    reviewCount: 128,
    address: '428 Maple Avenue, Downtown',
    phone: '+1 (555) 234-5678',
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    logo: '✨',
    isFeatured: true,
    openingHours: 'Mon-Sat: 9:00 AM - 7:00 PM',
    aiTone: 'Friendly, welcoming, and elegant',
    autoReplyEnabled: true,
    autoConfirmLimit: 150,
    subscriptionTier: 'pro',
    services: [
      { id: 's1', name: 'Signature Haircut & Blowout', category: 'Hair', durationMinutes: 60, price: 75, description: 'Precision styling tailored to your face shape with relaxing scalp massage.' },
      { id: 's2', name: 'Custom Balayage & Glossing', category: 'Color', durationMinutes: 120, price: 180, description: 'Hand-painted highlights for natural dimension and radiant shine.' },
      { id: 's3', name: 'Hydra-Glow Facial', category: 'Skincare', durationMinutes: 45, price: 95, description: 'Deep cleansing, gentle exfoliation, and intense moisture boost.' },
      { id: 's4', name: 'Gel Manicure & Hand Care', category: 'Nails', durationMinutes: 45, price: 50, description: 'Long-lasting high shine gel polish with cuticle treatment.' }
    ],
    staff: [
      { id: 'st1', name: 'Elena Rostova', role: 'Master Stylist', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', rating: 4.95 },
      { id: 'st2', name: 'Marcus Chen', role: 'Color Specialist', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', rating: 4.88 }
    ]
  },
  {
    id: 'biz_2',
    name: 'Apex Prep Academy',
    tagline: '1-on-1 Math, Physics & SAT/ACT Coaching',
    category: 'tutor',
    categoryLabel: 'Tutoring & Coaching',
    rating: 5.0,
    reviewCount: 84,
    address: '112 University Plaza, Suite 304',
    phone: '+1 (555) 876-5432',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    logo: '🎓',
    isFeatured: true,
    openingHours: 'Mon-Sun: 10:00 AM - 8:00 PM',
    aiTone: 'Encouraging, structured, and academic',
    autoReplyEnabled: true,
    autoConfirmLimit: 200,
    subscriptionTier: 'scale',
    services: [
      { id: 's5', name: 'Calculus & Advanced Math (1-on-1)', category: 'Math', durationMinutes: 60, price: 85, description: 'Individualized calculus help covering derivatives, integrals, and exam prep.' },
      { id: 's6', name: 'SAT / ACT Math Intensive', category: 'Test Prep', durationMinutes: 90, price: 120, description: 'Targeted strategies to maximize score improvement and time management.' },
      { id: 's7', name: 'AP Physics Problem Solving', category: 'Science', durationMinutes: 60, price: 90, description: 'Deep-dive into mechanics, electromagnetism, and lab concepts.' }
    ],
    staff: [
      { id: 'st3', name: 'Dr. Aris Thorne', role: 'Head Tutor (PhD Math)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', rating: 5.0 }
    ]
  },
  {
    id: 'biz_3',
    name: 'QuickFix Tech & Phone Repair',
    tagline: 'Same-Day Screen, Battery & Laptop Diagnostics',
    category: 'repair',
    categoryLabel: 'Tech & Repair',
    rating: 4.8,
    reviewCount: 210,
    address: '88 Commerce Street',
    phone: '+1 (555) 345-6789',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    logo: '⚡',
    isFeatured: false,
    openingHours: 'Mon-Sat: 8:30 AM - 6:30 PM',
    aiTone: 'Direct, clear, informative, and prompt',
    autoReplyEnabled: true,
    autoConfirmLimit: 100,
    subscriptionTier: 'pro',
    services: [
      { id: 's8', name: 'iPhone / Android Screen Replacement', category: 'Mobile', durationMinutes: 30, price: 89, description: 'Genuine OLED/LCD glass replacement with 90-day hardware warranty.' },
      { id: 's9', name: 'Battery Diagnostic & Swap', category: 'Mobile', durationMinutes: 20, price: 49, description: 'Fresh high-capacity battery installation and power output check.' },
      { id: 's10', name: 'MacBook & PC Hardware Repair', category: 'Computer', durationMinutes: 60, price: 110, description: 'Diagnostic inspection for water damage, keyboard or logic board issues.' }
    ],
    staff: [
      { id: 'st4', name: 'Dave Miller', role: 'Senior Technician', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', rating: 4.82 }
    ]
  },
  {
    id: 'biz_4',
    name: 'Dr. Evelyn Wellness Clinic',
    tagline: 'Holistic Chiropractic, Acupuncture & Physical Rehab',
    category: 'clinic',
    categoryLabel: 'Health & Wellness',
    rating: 4.95,
    reviewCount: 156,
    address: '500 Health Way, Suite 100',
    phone: '+1 (555) 901-2345',
    coverImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    logo: '🌿',
    isFeatured: true,
    openingHours: 'Mon-Fri: 8:00 AM - 6:00 PM',
    aiTone: 'Empathetic, reassuring, professional, and medical',
    autoReplyEnabled: true,
    autoConfirmLimit: 250,
    subscriptionTier: 'scale',
    services: [
      { id: 's11', name: 'Initial Chiropractic Assessment & Adjustment', category: 'Chiropractic', durationMinutes: 45, price: 110, description: 'Comprehensive spinal alignment and posture correction strategy.' },
      { id: 's12', name: 'Therapeutic Acupuncture Session', category: 'Acupuncture', durationMinutes: 60, price: 95, description: 'Targeted pain relief and nervous system rebalancing.' },
      { id: 's13', name: 'Deep Tissue Physical Rehab Massage', category: 'Physiotherapy', durationMinutes: 60, price: 120, description: 'Muscle recovery and mobility restoration.' }
    ],
    staff: [
      { id: 'st5', name: 'Dr. Evelyn Vance, DC', role: 'Chiropractor', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80', rating: 4.98 }
    ]
  },
  {
    id: 'biz_5',
    name: 'Alex Rivera Studio',
    tagline: 'Brand Photography, Portraits & Commercial Visuals',
    category: 'freelancer',
    categoryLabel: 'Freelancer & Creative',
    rating: 4.92,
    reviewCount: 62,
    address: 'Studio 14, Arts District',
    phone: '+1 (555) 432-1098',
    coverImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
    logo: '📷',
    isFeatured: false,
    openingHours: 'Tue-Sun: 10:00 AM - 6:00 PM',
    aiTone: 'Creative, articulate, passionate, and prompt',
    autoReplyEnabled: true,
    autoConfirmLimit: 300,
    subscriptionTier: 'pro',
    services: [
      { id: 's14', name: 'Professional Headshot Mini-Session', category: 'Photography', durationMinutes: 45, price: 150, description: '3 retouched high-res digital images with LinkedIn & web licensing.' },
      { id: 's15', name: 'Full Brand Storytelling Shoot', category: 'Photography', durationMinutes: 120, price: 450, description: 'Multiple look changes, environment shots, and 25 edited images.' }
    ],
    staff: [
      { id: 'st6', name: 'Alex Rivera', role: 'Lead Photographer', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80', rating: 4.92 }
    ]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk_101',
    businessId: 'biz_1',
    businessName: 'Glow & Co. Luxury Salon',
    serviceId: 's1',
    serviceName: 'Signature Haircut & Blowout',
    servicePrice: 75,
    staffId: 'st1',
    staffName: 'Elena Rostova',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1 (555) 111-2233',
    date: '2026-07-24',
    time: '10:00 AM',
    status: 'confirmed',
    paymentStatus: 'paid',
    platformFee: 1.88,
    reminderSentSms: true,
    reminderSentWhatsapp: true,
    createdAt: '2026-07-21'
  },
  {
    id: 'bk_102',
    businessId: 'biz_1',
    businessName: 'Glow & Co. Luxury Salon',
    serviceId: 's2',
    serviceName: 'Custom Balayage & Glossing',
    servicePrice: 180,
    staffId: 'st2',
    staffName: 'Marcus Chen',
    customerName: 'Amanda Lopez',
    customerEmail: 'amanda.l@example.com',
    customerPhone: '+1 (555) 444-5566',
    date: '2026-07-24',
    time: '02:00 PM',
    status: 'pending',
    paymentStatus: 'paid',
    platformFee: 4.50,
    reminderSentSms: false,
    reminderSentWhatsapp: false,
    createdAt: '2026-07-22'
  },
  {
    id: 'bk_103',
    businessId: 'biz_2',
    businessName: 'Apex Prep Academy',
    serviceId: 's5',
    serviceName: 'Calculus & Advanced Math (1-on-1)',
    servicePrice: 85,
    staffId: 'st3',
    staffName: 'Dr. Aris Thorne',
    customerName: 'David Miller',
    customerEmail: 'david.m@example.com',
    customerPhone: '+1 (555) 777-8899',
    date: '2026-07-25',
    time: '04:00 PM',
    status: 'confirmed',
    paymentStatus: 'paid',
    platformFee: 2.12,
    reminderSentSms: true,
    reminderSentWhatsapp: false,
    createdAt: '2026-07-20'
  },
  {
    id: 'bk_104',
    businessId: 'biz_3',
    businessName: 'QuickFix Tech & Phone Repair',
    serviceId: 's8',
    serviceName: 'iPhone / Android Screen Replacement',
    servicePrice: 89,
    staffId: 'st4',
    staffName: 'Dave Miller',
    customerName: 'Jason Wu',
    customerEmail: 'jason.w@example.com',
    customerPhone: '+1 (555) 333-9900',
    date: '2026-07-23',
    time: '11:30 AM',
    status: 'completed',
    paymentStatus: 'paid',
    platformFee: 2.22,
    reminderSentSms: true,
    reminderSentWhatsapp: true,
    createdAt: '2026-07-22'
  }
];

export const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: 'cli_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 111-2233',
    totalVisits: 6,
    totalSpent: 450,
    lastVisitDate: '2026-06-15',
    preferredService: 'Signature Haircut & Blowout',
    tags: ['VIP', 'Regular', 'Balayage Fan']
  },
  {
    id: 'cli_2',
    name: 'Amanda Lopez',
    email: 'amanda.l@example.com',
    phone: '+1 (555) 444-5566',
    totalVisits: 3,
    totalSpent: 360,
    lastVisitDate: '2026-05-20',
    preferredService: 'Custom Balayage & Glossing',
    tags: ['Color Client', 'Due for Touchup']
  },
  {
    id: 'cli_3',
    name: 'Chloe Bennett',
    email: 'chloe.b@example.com',
    phone: '+1 (555) 888-0011',
    totalVisits: 8,
    totalSpent: 720,
    lastVisitDate: '2026-04-10',
    preferredService: 'Hydra-Glow Facial',
    tags: ['Dormant', 'High Value']
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    businessId: 'biz_1',
    customerName: 'Jessica M.',
    rating: 5,
    comment: 'Elena is an absolute wizard! My balayage has never looked so smooth and natural. Plus, the text reminders were super helpful.',
    date: '2026-07-18',
    serviceName: 'Custom Balayage & Glossing',
    aiSentiment: 'positive'
  },
  {
    id: 'rev_2',
    businessId: 'biz_1',
    customerName: 'Robert K.',
    rating: 5,
    comment: 'Instant booking on my phone, auto confirmation in 5 seconds, and Marcus gave me a fresh clean cut. 10/10.',
    date: '2026-07-10',
    serviceName: 'Signature Haircut & Blowout',
    aiSentiment: 'positive'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    businessId: 'biz_1',
    sender: 'customer',
    text: 'Hi! Do you have any availability for a haircut and blowout this Friday afternoon?',
    timestamp: '10:14 AM',
    customerName: 'Sarah Jenkins'
  },
  {
    id: 'msg_2',
    businessId: 'biz_1',
    sender: 'ai',
    text: 'Hello Sarah! ✨ Yes, we have openings this Friday at 2:00 PM with Marcus and 3:30 PM with Elena. Would you like me to reserve one of these slots for you?',
    timestamp: '10:14 AM',
    customerName: 'Samuel_AI AI'
  }
];
