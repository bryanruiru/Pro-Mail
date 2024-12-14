import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  scheduleTime?: Date;
  sentDate?: string;
  openRate?: number;
  clickRate?: number;
  recipientCount: number;
  bounceRate?: number;
  unsubscribeRate?: number;
}

interface CampaignStore {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
  removeCampaign: (id: string) => void;
  getActiveCampaignsCount: () => number;
  getTotalSentEmails: () => number;
  getAverageOpenRate: () => number;
  getAverageClickRate: () => number;
  getAverageBounceRate: () => number;
  getCampaignGrowthRate: () => number;
}

export const campaignStore = create<CampaignStore>()(
  persist(
    (set, get) => ({
      campaigns: [],
      addCampaign: (campaign) =>
        set((state) => ({
          campaigns: [...state.campaigns, campaign],
        })),
      updateCampaign: (id, data) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),
      removeCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
        })),
      getActiveCampaignsCount: () => {
        return get().campaigns.filter((c) => c.status === 'active').length;
      },
      getTotalSentEmails: () => {
        return get().campaigns
          .filter((c) => c.status === 'sent')
          .reduce((total, campaign) => total + campaign.recipientCount, 0);
      },
      getAverageOpenRate: () => {
        const sentCampaigns = get().campaigns.filter(
          (c) => c.status === 'sent' && c.openRate !== undefined
        );
        if (sentCampaigns.length === 0) return 0;
        const totalOpenRate = sentCampaigns.reduce(
          (sum, campaign) => sum + (campaign.openRate || 0),
          0
        );
        return totalOpenRate / sentCampaigns.length;
      },
      getAverageClickRate: () => {
        const sentCampaigns = get().campaigns.filter(
          (c) => c.status === 'sent' && c.clickRate !== undefined
        );
        if (sentCampaigns.length === 0) return 0;
        const totalClickRate = sentCampaigns.reduce(
          (sum, campaign) => sum + (campaign.clickRate || 0),
          0
        );
        return totalClickRate / sentCampaigns.length;
      },
      getAverageBounceRate: () => {
        const sentCampaigns = get().campaigns.filter(
          (c) => c.status === 'sent' && c.bounceRate !== undefined
        );
        if (sentCampaigns.length === 0) return 0;
        const totalBounceRate = sentCampaigns.reduce(
          (sum, campaign) => sum + (campaign.bounceRate || 0),
          0
        );
        return totalBounceRate / sentCampaigns.length;
      },
      getCampaignGrowthRate: () => {
        const campaigns = get().campaigns;
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        
        const recentCampaigns = campaigns.filter(
          c => c.sentDate && new Date(c.sentDate) >= thirtyDaysAgo
        ).length;

        return campaigns.length === 0 ? 0 : (recentCampaigns / campaigns.length) * 100;
      },
    }),
    {
      name: 'campaign-storage',
    }
  )
);