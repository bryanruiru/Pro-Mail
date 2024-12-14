export interface Subscriber {
  id: string;
  email: string;
  name: string;
  dateAdded: string;
  status: 'active' | 'inactive' | 'unsubscribed';
  tags: string[];
  groups: string[];
  segments: string[];
  metadata: SubscriberMetadata;
  engagement: EngagementMetrics;
  journey: JourneyData;
  purchases: PurchaseHistory;
}

export interface SubscriberMetadata {
  location?: string;
  timezone?: string;
  language?: string;
  source?: string;
  campaign?: string;
  referrer?: string;
  customFields: Record<string, any>;
}

export interface EngagementMetrics {
  lastOpened?: string;
  lastClicked?: string;
  openRate: number;
  clickRate: number;
  websiteVisits: number;
  totalOpens: number;
  totalClicks: number;
  engagementScore: number;
}

export interface JourneyData {
  stage: JourneyStage;
  joinDate: string;
  lastActive: string;
  leadMagnets: LeadMagnet[];
  webinarAttendance: WebinarAttendance[];
  surveys: SurveyResponse[];
}

export interface PurchaseHistory {
  totalSpent: number;
  firstPurchase?: string;
  lastPurchase?: string;
  purchases: Purchase[];
  abandonedCarts: AbandonedCart[];
}

export interface LeadMagnet {
  id: string;
  name: string;
  downloadDate: string;
  type: 'ebook' | 'worksheet' | 'video' | 'resource';
}

export interface WebinarAttendance {
  id: string;
  name: string;
  date: string;
  attended: boolean;
  watchTime?: number;
}

export interface SurveyResponse {
  id: string;
  date: string;
  completed: boolean;
  responses?: Record<string, any>;
}

export interface Purchase {
  id: string;
  date: string;
  amount: number;
  products: string[];
  type: 'one-time' | 'subscription' | 'high-ticket';
}

export interface AbandonedCart {
  id: string;
  date: string;
  products: string[];
  totalValue: number;
  recovered: boolean;
}

export type JourneyStage =
  | 'new'
  | 'engaged'
  | 'converted'
  | 'unengaged'
  | 'lost'
  | 'reactivated';

export type SubscriberGroup =
  | JourneyGroup
  | EngagementGroup
  | PurchaseGroup
  | ContentGroup
  | DemographicGroup
  | ProgressGroup
  | ReferralGroup
  | TimeBasedGroup
  | FeedbackGroup
  | LoyaltyGroup;