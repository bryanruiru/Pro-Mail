import { Subscriber } from '../types/subscriber';
import * as GROUPS from '../constants/groupDefinitions';

export function calculateJourneyGroup(subscriber: Subscriber): string[] {
  const groups: string[] = [];
  const daysSinceJoin = getDaysSince(subscriber.journey.joinDate);
  const daysSinceLastActive = getDaysSince(subscriber.journey.lastActive);

  if (daysSinceJoin <= 30) {
    groups.push(GROUPS.JOURNEY_GROUPS.NEW_SUBSCRIBER);
  }

  if (subscriber.engagement.engagementScore >= 7) {
    groups.push(GROUPS.JOURNEY_GROUPS.ENGAGED);
  }

  if (subscriber.purchases.purchases.length > 0) {
    groups.push(GROUPS.JOURNEY_GROUPS.CONVERTED);
  }

  if (daysSinceLastActive > 90) {
    groups.push(GROUPS.JOURNEY_GROUPS.UNENGAGED);
  }

  if (daysSinceLastActive > 180) {
    groups.push(GROUPS.JOURNEY_GROUPS.LOST);
  }

  return groups;
}

export function calculateEngagementGroup(subscriber: Subscriber): string[] {
  const groups: string[] = [];

  if (subscriber.engagement.openRate >= 0.5) {
    groups.push(GROUPS.ENGAGEMENT_GROUPS.HIGH_OPENER);
  }

  if (subscriber.engagement.clickRate >= 0.3) {
    groups.push(GROUPS.ENGAGEMENT_GROUPS.FREQUENT_CLICKER);
  }

  if (subscriber.engagement.websiteVisits > 5) {
    groups.push(GROUPS.ENGAGEMENT_GROUPS.WEBSITE_VISITOR);
  }

  if (subscriber.purchases.abandonedCarts.length > 0) {
    groups.push(GROUPS.ENGAGEMENT_GROUPS.CART_ABANDONER);
  }

  return groups;
}

export function calculatePurchaseGroup(subscriber: Subscriber): string[] {
  const groups: string[] = [];
  const purchases = subscriber.purchases.purchases;

  if (purchases.length === 0) {
    groups.push(GROUPS.PURCHASE_GROUPS.NON_BUYER);
  }

  const hasSubscription = purchases.some(p => p.type === 'subscription');
  if (hasSubscription) {
    groups.push(GROUPS.PURCHASE_GROUPS.SUBSCRIPTION);
  }

  const hasHighTicket = purchases.some(p => p.type === 'high-ticket');
  if (hasHighTicket) {
    groups.push(GROUPS.PURCHASE_GROUPS.HIGH_TICKET);
  }

  if (purchases.length > 0 && !hasHighTicket) {
    groups.push(GROUPS.PURCHASE_GROUPS.UPSELL_CANDIDATE);
  }

  return groups;
}

export function calculateContentGroup(subscriber: Subscriber): string[] {
  const groups: string[] = [];

  if (subscriber.journey.leadMagnets.some(lm => lm.type === 'ebook')) {
    groups.push(GROUPS.CONTENT_GROUPS.EBOOK_READER);
  }

  if (subscriber.journey.webinarAttendance.some(w => w.attended)) {
    groups.push(GROUPS.CONTENT_GROUPS.WEBINAR_ATTENDEE);
  }

  if (subscriber.journey.leadMagnets.some(lm => lm.type === 'resource')) {
    groups.push(GROUPS.CONTENT_GROUPS.RESOURCE_USER);
  }

  return groups;
}

export function calculateLoyaltyGroup(subscriber: Subscriber): string[] {
  const groups: string[] = [];
  const daysSinceJoin = getDaysSince(subscriber.journey.joinDate);
  const purchaseTotal = subscriber.purchases.totalSpent;

  if (daysSinceJoin <= 30) {
    groups.push(GROUPS.LOYALTY_GROUPS.NEW);
  } else if (daysSinceJoin > 180 && purchaseTotal > 1000) {
    groups.push(GROUPS.LOYALTY_GROUPS.VIP);
  } else if (daysSinceJoin > 90 && purchaseTotal > 500) {
    groups.push(GROUPS.LOYALTY_GROUPS.LOYAL);
  } else {
    groups.push(GROUPS.LOYALTY_GROUPS.REGULAR);
  }

  return groups;
}

function getDaysSince(date: string): number {
  const diff = new Date().getTime() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}