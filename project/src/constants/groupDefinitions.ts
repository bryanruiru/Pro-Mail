export const JOURNEY_GROUPS = {
  NEW_SUBSCRIBER: 'new_subscriber',
  ENGAGED: 'engaged',
  CONVERTED: 'converted',
  UNENGAGED: 'unengaged',
  LOST: 'lost',
  REACTIVATED: 'reactivated',
} as const;

export const ENGAGEMENT_GROUPS = {
  HIGH_OPENER: 'high_opener',
  FREQUENT_CLICKER: 'frequent_clicker',
  WEBSITE_VISITOR: 'website_visitor',
  CART_ABANDONER: 'cart_abandoner',
  INACTIVE: 'inactive',
} as const;

export const PURCHASE_GROUPS = {
  NON_BUYER: 'non_buyer',
  PRE_ORDER: 'pre_order',
  SUBSCRIPTION: 'subscription',
  HIGH_TICKET: 'high_ticket',
  UPSELL_CANDIDATE: 'upsell_candidate',
} as const;

export const CONTENT_GROUPS = {
  EBOOK_READER: 'ebook_reader',
  WEBINAR_ATTENDEE: 'webinar_attendee',
  RESOURCE_USER: 'resource_user',
  COURSE_PARTICIPANT: 'course_participant',
} as const;

export const DEMOGRAPHIC_GROUPS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  ENTREPRENEUR: 'entrepreneur',
  CORPORATE: 'corporate',
} as const;

export const PROGRESS_GROUPS = {
  NEW_STUDENT: 'new_student',
  ACTIVE_LEARNER: 'active_learner',
  GRADUATE: 'graduate',
  LAPSED: 'lapsed',
} as const;

export const REFERRAL_GROUPS = {
  REFERRER: 'referrer',
  REFERRED: 'referred',
  ADVOCATE: 'advocate',
} as const;

export const TIME_BASED_GROUPS = {
  SEASONAL: 'seasonal',
  CAMPAIGN_SPECIFIC: 'campaign_specific',
  BLACK_FRIDAY: 'black_friday',
  PROMOTION: 'promotion',
} as const;

export const FEEDBACK_GROUPS = {
  SURVEY_RESPONDENT: 'survey_respondent',
  TESTIMONIAL: 'testimonial',
  REVIEWER: 'reviewer',
} as const;

export const LOYALTY_GROUPS = {
  NEW: 'new_member',
  REGULAR: 'regular_member',
  LOYAL: 'loyal_member',
  VIP: 'vip_member',
} as const;