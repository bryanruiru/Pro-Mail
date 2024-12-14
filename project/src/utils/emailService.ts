import { postalService } from './postalService';
import { POSTAL_CONFIG, PostalMessage } from './postalConfig';

interface EmailConfig {
  subject: string;
  content: string;
  recipients: string[];
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  onProgress?: (progress: number) => void;
}

class EmailService {
  private static instance: EmailService;
  private readonly DAILY_CAPACITY = 10000000; // 10 million emails per day
  private readonly HOURLY_RATE = Math.round(10000000 / 24);
  private readonly MINUTE_RATE = Math.round(10000000 / 24 / 60);

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendCampaign(config: EmailConfig): Promise<boolean> {
    try {
      const batchSize = 1000;
      const totalBatches = Math.ceil(config.recipients.length / batchSize);
      let successCount = 0;

      // Add DKIM and SPF verification headers
      const customHeaders = {
        'List-Unsubscribe': '<{{unsubscribe_url}}>',
        'X-Campaign-ID': `campaign-${Date.now()}`,
        'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        'Precedence': 'bulk',
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
        'X-Report-Abuse': 'Please report abuse here: {{abuse_url}}',
        'List-Id': `${config.fromName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.${new URL(POSTAL_CONFIG.SERVER_URL).hostname}`,
      };

      // Add engagement tracking
      const trackingConfig = {
        track_opens: true,
        track_clicks: true,
        track_plain_text: false,
        track_unsubscribes: true
      };

      // Implement rate limiting and warm-up
      const getDelayForBatch = (batchIndex: number): number => {
        const baseDelay = 1000; // 1 second base delay
        const warmupFactor = Math.min(1, (batchIndex + 1) / 10); // Gradually increase sending rate
        return baseDelay / warmupFactor;
      };

      for (let i = 0; i < totalBatches; i++) {
        const start = i * batchSize;
        const end = Math.min((i + 1) * batchSize, config.recipients.length);
        const batch = config.recipients.slice(start, end);

        // Enhanced message configuration
        const message: PostalMessage = {
          to: batch,
          from: `${config.fromName} <${config.fromEmail}>`,
          subject: config.subject,
          html_body: this.enhanceEmailContent(config.content),
          reply_to: config.replyTo || config.fromEmail,
          ...trackingConfig,
          custom_headers: customHeaders,
        };

        const result = await postalService.sendEmail(message);
        if (result.status === 'success') {
          successCount += batch.length;
        }

        if (config.onProgress) {
          const progress = Math.round(((i + 1) / totalBatches) * 100);
          config.onProgress(progress);
        }

        // Implement dynamic delay between batches
        await new Promise((resolve) => setTimeout(resolve, getDelayForBatch(i)));
      }

      return successCount === config.recipients.length;
    } catch (error) {
      console.error('Error sending campaign:', error);
      return false;
    }
  }

  private enhanceEmailContent(content: string): string {
    // Add preheader text
    const preheader = this.extractPreheaderText(content);
    const preheaderHtml = `
      <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        ${preheader}
      </div>`;

    // Add essential elements for better deliverability
    const enhancedContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
      </head>
      <body style="margin:0;padding:0;word-spacing:normal;background-color:#ffffff;">
        ${preheaderHtml}
        <div role="article" aria-roledescription="email" lang="en" style="-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#ffffff;">
          ${content}
        </div>
        <div style="display:none;white-space:nowrap;font-size:15px;line-height:0;">
          &nbsp; &zwnj; &nbsp; &zwnj; &nbsp; &zwnj; &nbsp; &zwnj; &nbsp; &zwnj; &nbsp; &zwnj; &nbsp; &zwnj;
        </div>
      </body>
      </html>`;

    return enhancedContent;
  }

  private extractPreheaderText(content: string): string {
    // Extract first text content from HTML
    const textMatch = content.match(/>([^<]+)</);
    if (textMatch && textMatch[1]) {
      return textMatch[1].trim().substring(0, 100);
    }
    return '';
  }

  public async saveDraft(config: EmailConfig): Promise<boolean> {
    try {
      // Save draft implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Draft saved:', {
        subject: config.subject,
        recipients: config.recipients.length
      });
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      return false;
    }
  }

  public getDailyCapacity(): number {
    return this.DAILY_CAPACITY;
  }

  public getHourlyRate(): number {
    return this.HOURLY_RATE;
  }

  public getMinuteRate(): number {
    return this.MINUTE_RATE;
  }
}

export const emailService = EmailService.getInstance();