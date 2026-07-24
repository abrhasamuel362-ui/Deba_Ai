export type BusinessCategory = 'salon' | 'tutor' | 'repair' | 'clinic' | 'freelancer';

export interface Service {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  description: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

export interface Business {
  id: string;
  name: string;
  tagline: string;
  category: BusinessCategory;
  categoryLabel: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  coverImage: string;
  logo: string;
  isFeatured?: boolean;
  services: Service[];
  staff: StaffMember[];
  openingHours: string;
  aiTone: string;
  autoReplyEnabled: boolean;
  autoConfirmLimit: number;
  subscriptionTier: 'starter' | 'pro' | 'scale';
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  businessId: string;
  businessName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  staffId?: string;
  staffName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: BookingStatus;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  platformFee: number; // e.g. 2.5% of price
  notes?: string;
  reminderSentSms?: boolean;
  reminderSentWhatsapp?: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  businessId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  serviceName: string;
  aiSentiment?: 'positive' | 'neutral' | 'constructive';
}

export interface ChatMessage {
  id: string;
  businessId: string;
  sender: 'customer' | 'business' | 'ai';
  text: string;
  timestamp: string;
  customerName?: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisitDate: string;
  preferredService: string;
  tags: string[];
  lastFollowUpSent?: string;
}

export interface FollowUpTemplate {
  id: string;
  clientName: string;
  proposedMessage: string;
  channel: 'SMS' | 'WhatsApp' | 'Email';
  suggestedDiscount?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  category: 'pricing' | 'marketing' | 'retention' | 'efficiency';
  description: string;
  impact: string;
  actionable: string;
}
