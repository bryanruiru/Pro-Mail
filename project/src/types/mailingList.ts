export interface MailingList {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  subscriberCount: number;
  tags: string[];
  settings: {
    doubleOptIn: boolean;
    welcomeEmail: boolean;
    unsubscribeLink: boolean;
  };
}

export interface CreateMailingListDTO {
  name: string;
  description: string;
  tags?: string[];
  subscriberCount?: number;
  settings?: {
    doubleOptIn?: boolean;
    welcomeEmail?: boolean;
    unsubscribeLink?: boolean;
  };
}