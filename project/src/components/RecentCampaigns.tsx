import React, { useState } from 'react';
import { Mail, BarChart2, Clock, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { campaignStore } from '../stores/campaignStore';

interface CampaignDetailsModalProps {
  campaign: any;
  onClose: () => void;
}

const CampaignDetailsModal = ({ campaign, onClose }: CampaignDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-gray-800 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-medium text-gray-100">{campaign.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-700 p-4">
              <h4 className="mb-2 text-sm font-medium text-gray-300">Campaign Performance</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Open Rate</p>
                  <p className="text-lg font-semibold text-gray-100">{campaign.openRate || '0%'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Click Rate</p>
                  <p className="text-lg font-semibold text-gray-100">{campaign.clickRate || '0%'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Bounce Rate</p>
                  <p className="text-lg font-semibold text-gray-100">{campaign.bounceRate || '0%'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Unsubscribe Rate</p>
                  <p className="text-lg font-semibold text-gray-100">{campaign.unsubscribeRate || '0%'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gray-700 p-4">
              <h4 className="mb-2 text-sm font-medium text-gray-300">Campaign Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className="text-sm font-medium text-gray-100">{campaign.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Recipients</span>
                  <span className="text-sm font-medium text-gray-100">{campaign.recipientCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Sent Date</span>
                  <span className="text-sm font-medium text-gray-100">{campaign.sentDate || 'Not sent'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-700 p-4">
            <h4 className="mb-4 text-sm font-medium text-gray-300">Email Content</h4>
            <div className="rounded bg-gray-900 p-4">
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-300">Subject:</p>
                <p className="text-sm text-gray-100">{campaign.subject || 'Welcome to FOC Digital Academy'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">Content:</p>
                <div className="mt-2 prose prose-sm max-w-none text-gray-100">
                  {campaign.content || (
                    <div>
                      <p>Hello,</p>
                      <p>Welcome to FOC Digital Academy! We're excited to have you on board.</p>
                      <p>Best regards,<br />FOC Digital Academy Team</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RecentCampaigns() {
  const navigate = useNavigate();
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const { campaigns } = campaignStore();

  const handleCampaignClick = (campaign: any) => {
    setSelectedCampaign(campaign);
  };

  return (
    <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-100">Recent Campaigns</h2>
          <button 
            onClick={() => navigate('/campaigns')}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            New Campaign
          </button>
        </div>

        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-100">
                      Campaign
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-100">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-100">
                      Open Rate
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-100">
                      Click Rate
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-100">
                      Sent
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {campaigns.map((campaign) => (
                    <tr 
                      key={campaign.id}
                      onClick={() => handleCampaignClick(campaign)}
                      className="cursor-pointer hover:bg-gray-700"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div className="ml-4">
                            <div className="font-medium text-gray-100">
                              {campaign.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            campaign.status === 'sent'
                              ? 'bg-green-900 text-green-200'
                              : campaign.status === 'scheduled'
                              ? 'bg-blue-900 text-blue-200'
                              : 'bg-gray-700 text-gray-200'
                          }`}
                        >
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        <div className="flex items-center">
                          <BarChart2 className="mr-1.5 h-4 w-4 text-gray-400" />
                          {campaign.openRate ? `${campaign.openRate}%` : '-'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {campaign.clickRate ? `${campaign.clickRate}%` : '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        <div className="flex items-center">
                          <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                          {campaign.sentDate || '-'}
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
}