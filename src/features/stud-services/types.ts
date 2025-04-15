// Stud Services Feature - Types

/**
 * Stud Service
 */
export interface StudService {
  id: string;
  studId: string;
  fee: number;
  description?: string;
  availability: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Stud Service with Dog Information
 */
export interface StudServiceWithDog extends StudService {
  stud?: {
    id: string;
    name: string;
    breed: string;
    color: string;
    dateOfBirth?: string;
    ownerId: string;
    owner?: {
      firstName: string;
      lastName: string;
      email?: string;
    };
  };
}

/**
 * Stud Booking
 */
export interface StudBooking {
  id: string;
  studServiceId: string;
  clientId: string;
  femaleDogId: string;
  status: "pending" | "confirmed" | "completed" | "canceled";
  scheduledDate?: string;
  notes?: string;
  createdAt: string;
}

/**
 * Stud Booking with Related Information
 */
export interface StudBookingWithRelations extends StudBooking {
  studService?: StudServiceWithDog;
  femaleDog?: {
    id: string;
    name: string;
    breed: string;
    color: string;
  };
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

/**
 * Stud Receptionist Message
 */
export interface StudReceptionistMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

/**
 * Stud Receptionist Conversation
 */
export interface StudReceptionistConversation {
  id: string;
  studServiceId: string;
  customerEmail?: string;
  messages: StudReceptionistMessage[];
  status: "active" | "closed";
  createdAt: string;
}

/**
 * AI Stud Receptionist Response
 */
export interface AIStudReceptionistResponse {
  message: string;
  suggestedQuestions?: string[];
  availabilityInfo?: {
    isAvailable: boolean;
    nextAvailableDate?: string;
    bookingInstructions?: string;
  };
  pricing?: {
    fee: number;
    additionalFees?: { description: string; amount: number }[];
  };
  healthInfo?: {
    healthTests: string[];
    clearances: string[];
  };
}

/**
 * Stud Marketing
 */
export interface StudMarketing {
  id: string;
  studId: string;
  title: string;
  description?: string;
  dnaHighlights?: {
    verified: boolean;
    coi?: number;
    prepotency?: number;
    colorCarrier?: string[];
    healthClearances?: string[];
  };
  colorGenetics?: {
    mainColor: string;
    pattern: string;
    carries: string[];
  };
  healthClearances?: {
    tests: string[];
    certificates?: string[];
  };
  feeStructure?: {
    baseFee: number;
    premiumFee?: number;
    puppyBackOption?: boolean;
    specialTerms?: string;
  };
  availabilityCalendar?: {
    isAvailable: boolean;
    availableDates?: string[];
    bookedDates?: string[];
    maxBookingsPerMonth?: number;
  };
  successMetrics?: {
    conceptionRate?: number;
    averageLitterSize?: number;
    testimonials?: string[];
  };
  createdAt: string;
  updatedAt: string;
}
