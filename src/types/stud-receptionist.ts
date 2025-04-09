// Stud Receptionist types
export interface StudInquiry {
  id: string;
  studServiceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message: string;
  status: "new" | "responded" | "closed";
  createdAt: string;
}

export interface StudInquiryResponse {
  id: string;
  inquiryId: string;
  message: string;
  isAutomatic: boolean;
  createdAt: string;
}

export interface StudReceptionistMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface StudReceptionistConversation {
  id: string;
  studServiceId: string;
  customerEmail: string;
  messages: StudReceptionistMessage[];
  status: "active" | "closed";
  createdAt: string;
}

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
