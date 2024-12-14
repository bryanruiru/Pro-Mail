import { format, subDays } from 'date-fns';

interface FilterOptions {
  status: string[];
  lists: string[];
  dateRange: string;
  activity: string;
}

export function filterSubscribers(subscribers: any[], filters: FilterOptions) {
  return subscribers.filter(subscriber => {
    // Filter by status
    if (filters.status.length > 0 && !filters.status.includes(subscriber.status)) {
      return false;
    }

    // Filter by lists
    if (filters.lists.length > 0 && !subscriber.lists.some((list: string) => filters.lists.includes(list))) {
      return false;
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const subscriberDate = new Date(subscriber.dateAdded);
      const today = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          if (format(subscriberDate, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd')) {
            return false;
          }
          break;
        case 'week':
          if (subscriberDate < subDays(today, 7)) {
            return false;
          }
          break;
        case 'month':
          if (subscriberDate < subDays(today, 30)) {
            return false;
          }
          break;
        case 'quarter':
          if (subscriberDate < subDays(today, 90)) {
            return false;
          }
          break;
        case 'year':
          if (subscriberDate < subDays(today, 365)) {
            return false;
          }
          break;
      }
    }

    // Filter by activity
    if (filters.activity !== 'all') {
      switch (filters.activity) {
        case 'opened':
          if (!subscriber.lastOpened) {
            return false;
          }
          break;
        case 'clicked':
          if (!subscriber.lastClicked) {
            return false;
          }
          break;
        case 'none':
          if (subscriber.lastOpened || subscriber.lastClicked) {
            return false;
          }
          break;
      }
    }

    return true;
  });
}