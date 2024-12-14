import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FilterProps {
  onApplyFilters: (filters: FilterState) => void;
  onClose: () => void;
}

interface FilterState {
  status: string[];
  lists: string[];
  dateRange: string;
  activity: string;
}

export default function SubscriberFilter({ onApplyFilters, onClose }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    lists: [],
    dateRange: 'all',
    activity: 'all',
  });

  const statusOptions = ['Active', 'Inactive'];
  const listOptions = ['Newsletter', 'Product Updates', 'Beta Testing', 'Promotional'];
  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 90 Days' },
    { value: 'year', label: 'Last Year' },
  ];
  const activityOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'opened', label: 'Opened Email' },
    { value: 'clicked', label: 'Clicked Link' },
    { value: 'none', label: 'No Activity' },
  ];

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleListChange = (list: string) => {
    setFilters(prev => ({
      ...prev,
      lists: prev.lists.includes(list)
        ? prev.lists.filter(l => l !== list)
        : [...prev.lists, list],
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h3 className="text-lg font-medium text-gray-100">Filter Subscribers</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Status
              </label>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => handleStatusChange(status)}
                      className="rounded border-gray-600 bg-gray-700 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-300">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Lists
              </label>
              <div className="space-y-2">
                {listOptions.map((list) => (
                  <label key={list} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.lists.includes(list)}
                      onChange={() => handleListChange(list)}
                      className="rounded border-gray-600 bg-gray-700 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-300">{list}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-sm text-gray-200"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Activity
              </label>
              <select
                value={filters.activity}
                onChange={(e) => setFilters(prev => ({ ...prev, activity: e.target.value }))}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-sm text-gray-200"
              >
                {activityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setFilters({
                  status: [],
                  lists: [],
                  dateRange: 'all',
                  activity: 'all',
                });
              }}
              className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}