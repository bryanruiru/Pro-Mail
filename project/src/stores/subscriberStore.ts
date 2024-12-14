import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Subscriber {
  id: number;
  email: string;
  name: string;
  status: 'Active' | 'Inactive';
  dateAdded: string;
  lists: string[];
}

interface SubscriberStore {
  subscribers: Subscriber[];
  addSubscriber: (subscriber: Subscriber) => void;
  addSubscribers: (subscribers: Subscriber[]) => void;
  removeSubscriber: (id: number) => void;
  updateSubscriber: (id: number, data: Partial<Subscriber>) => void;
  getActiveSubscribersCount: () => number;
  getSubscriberGrowthRate: () => number;
}

export const subscriberStore = create<SubscriberStore>()(
  persist(
    (set, get) => ({
      subscribers: [],
      addSubscriber: (subscriber) =>
        set((state) => ({
          subscribers: [...state.subscribers, subscriber],
        })),
      addSubscribers: (newSubscribers) =>
        set((state) => ({
          subscribers: [...state.subscribers, ...newSubscribers],
        })),
      removeSubscriber: (id) =>
        set((state) => ({
          subscribers: state.subscribers.filter((s) => s.id !== id),
        })),
      updateSubscriber: (id, data) =>
        set((state) => ({
          subscribers: state.subscribers.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),
      getActiveSubscribersCount: () => {
        return get().subscribers.filter((s) => s.status === 'Active').length;
      },
      getSubscriberGrowthRate: () => {
        const subscribers = get().subscribers;
        if (subscribers.length === 0) return 0;
        
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        
        const recentSubscribers = subscribers.filter(
          s => new Date(s.dateAdded) >= thirtyDaysAgo
        ).length;

        return (recentSubscribers / subscribers.length) * 100;
      },
    }),
    {
      name: 'subscriber-storage',
    }
  )
);