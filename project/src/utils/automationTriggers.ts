import { Subscriber } from '../types/subscriber';
import * as GROUPS from '../constants/groupDefinitions';

export interface AutomationTrigger {
  id: string;
  name: string;
  condition: (subscriber: Subscriber) => boolean;
  action: (subscriber: Subscriber) => void;
}

export const automationTriggers: AutomationTrigger[] = [
  {
    id: 'reactivation_trigger',
    name: 'Reactivate Unengaged Subscriber',
    condition: (subscriber: Subscriber) => {
      const daysSinceLastActive = getDaysSince(subscriber.journey.lastActive);
      return daysSinceLastActive > 90 && daysSinceLastActive <= 180;
    },
    action: (subscriber: Subscriber) => {
      // Trigger reactivation campaign
      console.log(`Triggering reactivation campaign for ${subscriber.email}`);
    }
  },
  {
    id: 'upsell_trigger',
    name: 'High-Ticket Upsell Opportunity',
    condition: (subscriber: Subscriber) => {
      return subscriber.purchases.purchases.length > 0 &&
        subscriber.engagement.engagementScore > 7 &&
        !subscriber.purchases.purchases.some(p => p.type === 'high-ticket');
    },
    action: (subscriber: Subscriber) => {
      // Trigger high-ticket offer campaign
      console.log(`Triggering high-ticket offer for ${subscriber.email}`);
    }
  },
  {
    id: 'cart_recovery',
    name: 'Abandoned Cart Recovery',
    condition: (subscriber: Subscriber) => {
      const recentCart = subscriber.purchases.abandonedCarts
        .find(cart => getDaysSince(cart.date) <= 3 && !cart.recovered);
      return !!recentCart;
    },
    action: (subscriber: Subscriber) => {
      // Trigger cart recovery sequence
      console.log(`Triggering cart recovery for ${subscriber.email}`);
    }
  },
  {
    id: 'engagement_boost',
    name: 'Boost Low Engagement',
    condition: (subscriber: Subscriber) => {
      return subscriber.engagement.engagementScore < 5 &&
        subscriber.status === 'active';
    },
    action: (subscriber: Subscriber) => {
      // Trigger re-engagement campaign
      console.log(`Triggering engagement boost for ${subscriber.email}`);
    }
  },
  {
    id: 'vip_upgrade',
    name: 'VIP Status Upgrade',
    condition: (subscriber: Subscriber) => {
      return subscriber.purchases.totalSpent > 1000 &&
        !subscriber.groups.includes(GROUPS.LOYALTY_GROUPS.VIP);
    },
    action: (subscriber: Subscriber) => {
      // Trigger VIP welcome sequence
      console.log(`Triggering VIP upgrade for ${subscriber.email}`);
    }
  }
];

function getDaysSince(date: string): number {
  const diff = new Date().getTime() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function checkAutomationTriggers(subscriber: Subscriber): void {
  automationTriggers.forEach(trigger => {
    if (trigger.condition(subscriber)) {
      trigger.action(subscriber);
    }
  });
}