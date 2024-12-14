import React from 'react';
import DashboardStats from '../components/DashboardStats';
import RecentCampaigns from '../components/RecentCampaigns';
import QuickActions from '../components/QuickActions';

export default function Dashboard() {
  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to FOC Pro Mail. Here's what's happening with your campaigns.
        </p>
      </div>

      <div className="space-y-8">
        <DashboardStats />
        <QuickActions />
        <RecentCampaigns />
      </div>
    </main>
  );
}