import { POSTAL_CONFIG, PostalMessage, PostalResponse } from './postalConfig';

class PostalService {
  private static instance: PostalService;
  private readonly headers: HeadersInit;

  private constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'X-Server-API-Key': POSTAL_CONFIG.API_KEY,
    };
  }

  public static getInstance(): PostalService {
    if (!PostalService.instance) {
      PostalService.instance = new PostalService();
    }
    return PostalService.instance;
  }

  private async sendRequest(endpoint: string, data: any): Promise<Response> {
    const url = `${POSTAL_CONFIG.SERVER_URL}/api/v1/${endpoint}`;
    return fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });
  }

  public async sendEmail(message: PostalMessage): Promise<PostalResponse> {
    try {
      const response = await this.sendRequest('send/message', {
        ...message,
        track_opens: true,
        track_clicks: true,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        status: 'success',
        message_id: data.message_id,
      };
    } catch (error) {
      console.error('Error sending email via Postal:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  public async getMessageStatus(messageId: string): Promise<any> {
    try {
      const response = await fetch(
        `${POSTAL_CONFIG.SERVER_URL}/api/v1/messages/${messageId}`,
        { headers: this.headers }
      );
      return await response.json();
    } catch (error) {
      console.error('Error getting message status:', error);
      throw error;
    }
  }
}

export const postalService = PostalService.getInstance();