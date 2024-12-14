import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Calendar, ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';

const timeRanges = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last 1 Year', value: '1y' },
  { label: 'Lifetime', value: 'all' },
];

export default function Analytics() {
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [selectedRange, setSelectedRange] = useState(timeRanges[0]);

  // Empty data for initial state
  const emailStats = [
    { date: new Date().toISOString().split('T')[0], sent: 0, opened: 0, clicked: 0 }
  ];

  const topCampaigns = [
    { name: 'No campaigns yet', openRate: 0, clickRate: 0 }
  ];

  // System capacity info
  const systemCapacity = {
    dailyEmailCapacity: 1000000,
    hourlyRate: Math.round(1000000 / 24),
    minuteRate: Math.round(1000000 / 24 / 60)
  };

  const handleTimeRangeSelect = (range: typeof timeRanges[0]) => {
    setSelectedRange(range);
    setShowTimeRangeDropdown(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Analytics</h1>
          <p className="mt-1 text-sm text-gray-400">
            Track your email campaign performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            <span className="font-medium">System Capacity: </span>
            <span>{systemCapacity.dailyEmailCapacity.toLocaleString()} emails/day</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
              className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedRange.label}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            
            {showTimeRangeDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {timeRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handleTimeRangeSelect(range)}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg bg-gray-800 p-6 shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-100">Email Performance</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emailStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line
                  type="monotone"
                  dataKey="sent"
                  stroke="#6366F1"
                  name="Sent"
                />
                <Line
                  type="monotone"
                  dataKey="opened"
                  stroke="#10B981"
                  name="Opened"
                />
                <Line
                  type="monotone"
                  dataKey="clicked"
                  stroke="#F59E0B"
                  name="Clicked"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-gray-400">
            System can process up to {systemCapacity.hourlyRate.toLocaleString()} emails/hour
          </div>
        </div>

        <div className="rounded-lg bg-gray-800 p-6 shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-100">Campaign Performance</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCampaigns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Bar dataKey="openRate" fill="#10B981" name="Open Rate" />
                <Bar dataKey="clickRate" fill="#F59E0B" name="Click Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-gray-400">
            Ready to process {systemCapacity.minuteRate.toLocaleString()} emails/minute
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-lg bg-gray-800 p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-100">Campaign Overview</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-700 p-4">
                <p className="text-sm text-gray-400">Total Sent</p>
                <p className="mt-2 text-3xl font-semibold text-gray-100">0</p>
                <div className="mt-2 flex items-center">
                  <ArrowUp className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-400">0%</span>
                </div>
              </div>
              <div className="rounded-lg border border-gray-700 p-4">
                <p className="text-sm text-gray-400">Open Rate</p>
                <p className="mt-2 text-3xl font-semibold text-gray-100">0%</p>
                <div className="mt-2 flex items-center">
                  <ArrowUp className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-400">0%</span>
                </div>
              </div>
              <div className="rounded-lg border border-gray-700 p-4">
                <p className="text-sm text-gray-400">Click Rate</p>
                <p className="mt-2 text-3xl font-semibold text-gray-100">0%</p>
                <div className="mt-2 flex items-center">
                  <ArrowDown className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-400">0%</span>
                </div>
              </div>
              <div className="rounded-lg border border-gray-700 p-4">
                <p className="text-sm text-gray-400">Bounce Rate</p>
                <p className="mt-2 text-3xl font-semibold text-gray-100">0%</p>
                <div className="mt-2 flex items-center">
                  <ArrowDown className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-400">0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}