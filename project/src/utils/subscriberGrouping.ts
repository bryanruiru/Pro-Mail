import { Subscriber } from '../types/subscriber';
import {
  calculateJourneyGroup,
  calculateEngagementGroup,
  calculatePurchaseGroup,
  calculateContentGroup,
  calculateLoyaltyGroup,
} from './groupingRules';

export function updateSubscriberGroups(subscriber: Subscriber): Subscriber {
  const updatedGroups = [
    ...calculateJourneyGroup(subscriber),
    ...calculateEngagementGroup(subscriber),
    ...calculatePurchaseGroup(subscriber),
    ...calculateContentGroup(subscriber),
    ...calculateLoyaltyGroup(subscriber),
  ];

  return {
    ...subscriber,
    groups: [...new Set(updatedGroups)], // Remove duplicates
  };
}

export function getSubscribersByGroup(subscribers: Subscriber[], group: string): Subscriber[] {
  return subscribers.filter(subscriber => subscriber.groups.includes(group));
}

export function getSubscribersByMultipleGroups(
  subscribers: Subscriber[],
  groups: string[],
  matchAll = true
): Subscriber[] {
  return subscribers.filter(subscriber => {
    if (matchAll) {
      return groups.every(group => subscriber.groups.includes(group));
    }
    return groups.some(group => subscriber.groups.includes(group));
  });
}

export function calculateEngagementScore(subscriber: Subscriber): number {
  const weights = {
    opens: 0.2,
    clicks: 0.3,
    purchases: 0.3,
    webinarAttendance: 0.1,
    surveyResponses: 0.1,
  };

  let score = 0;

  // Calculate open score (0-10)
  score += (subscriber.engagement.openRate * 10) * weights.opens;

  // Calculate click score (0-10)
  score += (subscriber.engagement.clickRate * 10) * weights.clicks;

  // Calculate purchase score (0-10)
  const purchaseScore = Math.min(subscriber.purchases.purchases.length * 2, 10);
  score += purchaseScore * weights.purchases;

  // Calculate webinar attendance score (0-10)
  const webinarScore = Math.min(
    subscriber.journey.webinarAttendance.filter(w => w.attended).length * 2,
    10
  );
  score += webinarScore * weights.webinarAttendance;

  // Calculate survey response score (0-10)
  const surveyScore = Math.min(
    subscriber.journey.surveys.filter(s => s.completed).length * 2,
    10
  );
  score += surveyScore * weights.surveyResponses;

  return Math.round(score * 10) / 10; // Round to 1 decimal place
}