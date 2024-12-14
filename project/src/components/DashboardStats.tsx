import React from 'react';
import { Users, Mail, Inbox, BarChart2 } from 'lucide-react';
import { subscriberStore } from '../stores/subscriberStore';
import { campaignStore } from '../stores/campaignStore';

export default function DashboardStats() {
  const { getActiveSubscribersCount, getSubscriberGrowthRate } = subscriberStore();
  const { 
    getActiveCampaignsCount, 
    getTotalSentEmails, 
    getAverageOpenRate,
    getCampaignGrowthRate
  } = campaignStore();

  const stats = [
    {
      name: 'Total Subscribers',
      value: getActiveSubscribersCount().toLocaleString(),
      change: `${getSubscriberGrowthRate().toFixed(1)}%`,
      changeType: getSubscriberGrowthRate() > 0 ? 'positive' : 'neutral',
      icon: Users,
    },
    {
      name: 'Active Campaigns',
      value: getActiveCampaignsCount().toLocaleString(),
      change: `${getCampaignGrowthRate().toFixed(1)}%`,
      changeType: getCampaignGrowthRate() > 0 ? 'positive' : 'neutral',
      icon: Mail,
    },
    {
      name: 'Sent Emails',
      value: getTotalSentEmails().toLocaleString(),
      change: '0%',
      changeType: 'neutral',
      icon: Inbox,
    },
    {
      name: 'Avg. Open Rate',
      value: `${getAverageOpenRate().toFixed(1)}%`,
      change: '0%',
      changeType: 'neutral',
      icon: BarChart2,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative overflow-hidden rounded-lg bg-gray-800 p-6 shadow-xl"
        >
          <dt>
            <div className="absolute rounded-md bg-indigo-600 p-3">
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-400">
              {stat.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-100">{stat.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                stat.changeType === 'positive'
                  ? 'text-green-500'
                  : 'text-gray-500'
              }`}
            >
              {stat.change}
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
}