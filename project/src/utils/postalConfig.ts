export const POSTAL_CONFIG = {
  API_KEY: import.meta.env.VITE_POSTAL_API_KEY || '',
  SERVER_URL: import.meta.env.VITE_POSTAL_SERVER_URL || '',
  DEFAULT_FROM: 'FOC Digital Academy <noreply@focdigitalacademy.org>',
  WEBHOOK_URL: import.meta.env.VITE_POSTAL_WEBHOOK_URL || '',
  REPLY_TO: 'support@focdigitalacademy.org',
  BOUNCE_ADDRESS: 'bounces@focdigitalacademy.org',
  
  // Email Authentication Settings
  AUTH_CONFIG: {
    // DKIM Configuration
    DKIM_ENABLED: true,
    DKIM_DOMAIN: 'focdigitalacademy.org',
    DKIM_SELECTOR: 'postal',
    
    // SPF Record (to be added to DNS)
    SPF_RECORD: 'v=spf1 include:spf.postal.focdigitalacademy.org ~all',
    
    // DMARC Record (to be added to DNS)
    DMARC_RECORD: 'v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@focdigitalacademy.org; pct=100; adkim=s; aspf=s',
    
    // Recommended DNS Records
    RECOMMENDED_DNS: {
      MX: [
        { priority: 10, value: 'mx1.postal.focdigitalacademy.org' },
        { priority: 20, value: 'mx2.postal.focdigitalacademy.org' }
      ],
      TXT: [
        { name: '@', value: 'v=spf1 include:spf.postal.focdigitalacademy.org ~all' },
        { name: '_dmarc', value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@focdigitalacademy.org; pct=100; adkim=s; aspf=s' },
        { name: 'postal._domainkey', value: 'v=DKIM1; k=rsa; p=[YOUR-PUBLIC-KEY]' }
      ]
    }
  },

  // Delivery Optimization
  DELIVERY_CONFIG: {
    // Rate limiting settings
    MAX_RECIPIENTS_PER_DAY: 50000,
    MAX_MESSAGES_PER_CONNECTION: 100,
    CONNECTION_TIMEOUT: 30,
    
    // Warm-up configuration
    WARMUP: {
      ENABLED: true,
      INITIAL_VOLUME: 100,
      DAILY_INCREASE: 200,
      MAX_DAILY_VOLUME: 50000,
      MIN_DELAY_SECONDS: 1,
      MAX_DELAY_SECONDS: 5
    },
    
    // Retry configuration
    RETRY: {
      MAX_ATTEMPTS: 3,
      INITIAL_DELAY: 300,
      MAX_DELAY: 3600,
      BACKOFF_FACTOR: 2
    }
  },

  // Monitoring and Analytics
  MONITORING: {
    TRACK_OPENS: true,
    TRACK_CLICKS: true,
    TRACK_UNSUBSCRIBES: true,
    WEBHOOK_EVENTS: [
      'send',
      'deliver',
      'bounce',
      'feedback',
      'open',
      'click',
      'unsubscribe'
    ]
  }
};

export interface PostalMessage {
  to: string[];
  from: string;
  subject: string;
  html_body: string;
  plain_body?: string;
  track_opens?: boolean;
  track_clicks?: boolean;
  custom_headers?: Record<string, string>;
}

export interface PostalResponse {
  status: 'success' | 'error';
  message_id?: string;
  error?: string;
}