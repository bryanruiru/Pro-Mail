import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MailingList, CreateMailingListDTO } from '../types/mailingList';

interface MailingListStore {
  lists: MailingList[];
  addList: (list: CreateMailingListDTO) => MailingList;
  updateList: (id: string, updates: Partial<MailingList>) => void;
  deleteList: (id: string) => void;
  incrementSubscriberCount: (id: string) => void;
  decrementSubscriberCount: (id: string) => void;
  updateSubscriberCount: (id: string, count: number) => void;
}

export const mailingListStore = create<MailingListStore>()(
  persist(
    (set, get) => ({
      lists: [],
      addList: (listData: CreateMailingListDTO) => {
        const newList: MailingList = {
          id: Date.now().toString(),
          name: listData.name,
          description: listData.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          subscriberCount: listData.subscriberCount || 0,
          tags: listData.tags || [],
          settings: {
            doubleOptIn: listData.settings?.doubleOptIn ?? true,
            welcomeEmail: listData.settings?.welcomeEmail ?? true,
            unsubscribeLink: listData.settings?.unsubscribeLink ?? true,
          },
        };

        set((state) => ({
          lists: [...state.lists, newList],
        }));

        return newList;
      },
      updateList: (id: string, updates: Partial<MailingList>) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id
              ? {
                  ...list,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : list
          ),
        }));
      },
      deleteList: (id: string) => {
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        }));
      },
      incrementSubscriberCount: (id: string) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id
              ? { ...list, subscriberCount: list.subscriberCount + 1 }
              : list
          ),
        }));
      },
      decrementSubscriberCount: (id: string) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id && list.subscriberCount > 0
              ? { ...list, subscriberCount: list.subscriberCount - 1 }
              : list
          ),
        }));
      },
      updateSubscriberCount: (id: string, count: number) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id
              ? { ...list, subscriberCount: count }
              : list
          ),
        }));
      },
    }),
    {
      name: 'mailing-list-storage',
    }
  )
);