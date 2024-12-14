import React, { useState } from 'react';
import { X } from 'lucide-react';
import { mailingListStore } from '../stores/mailingListStore';
import { subscriberStore } from '../stores/subscriberStore';

interface CreateMailingListModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateMailingListModal({ onClose, onSuccess }: CreateMailingListModalProps) {
  const { addList } = mailingListStore();
  const { subscribers } = subscriberStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedSubscribers: [] as number[],
  });

  const handleSubmit = () => {
    if (!formData.name) {
      return;
    }

    const newList = addList({
      name: formData.name,
      description: formData.description,
      tags: [],
      settings: {
        doubleOptIn: true,
        welcomeEmail: true,
        unsubscribeLink: true,
      },
      subscriberCount: formData.selectedSubscribers.length,
    });

    // Update subscribers with the new list
    formData.selectedSubscribers.forEach(subscriberId => {
      const subscriber = subscribers.find(s => s.id === subscriberId);
      if (subscriber) {
        subscriber.lists.push(newList.id);
      }
    });

    onSuccess();
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        selectedSubscribers: subscribers.map(s => s.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedSubscribers: []
      }));
    }
  };

  const handleSelectSubscriber = (id: number) => {
    setFormData(prev => ({
      ...prev,
      selectedSubscribers: prev.selectedSubscribers.includes(id)
        ? prev.selectedSubscribers.filter(subId => subId !== id)
        : [...prev.selectedSubscribers, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-gray-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-100">Create New List</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200">
              List Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter list name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter list description"
              rows={3}
            />
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-200">
                Add Subscribers
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.selectedSubscribers.length === subscribers.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-400">Select All</span>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {subscriber.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          subscriber.status === 'Active'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-gray-700 text-gray-200'
                        }`}>
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <input
                          type="checkbox"
                          checked={formData.selectedSubscribers.includes(subscriber.id)}
                          onChange={() => handleSelectSubscriber(subscriber.id)}
                          className="rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              {formData.selectedSubscribers.length} subscriber(s) selected
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Create List
          </button>
        </div>
      </div>
    </div>
  );
}