import React, { useState } from 'react';
import { Upload, Download, UserPlus, Search, Filter, Trash2, MoreVertical, X, AlertCircle, Edit2 } from 'lucide-react';
import { subscriberStore } from '../stores/subscriberStore';

interface Subscriber {
  id: number;
  email: string;
  name: string;
  status: 'Active' | 'Inactive';
  dateAdded: string;
  lists: string[];
}

const availableLists = ['Newsletter', 'Product Updates', 'Beta Testing', 'Promotional'];

export default function SubscriberManagement() {
  const { subscribers, addSubscriber, addSubscribers, removeSubscriber, updateSubscriber } = subscriberStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [newSubscriber, setNewSubscriber] = useState({
    email: '',
    name: '',
    lists: [] as string[],
  });

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSubscribers(subscribers.map((sub) => sub.id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  const handleSelectSubscriber = (id: number) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id) ? prev.filter((subId) => subId !== id) : [...prev, id]
    );
  };

  const cleanEmail = (email: string): string => {
    // Remove quotes and trim whitespace
    return email.replace(/['"]/g, '').trim();
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Check file size (500MB = 500 * 1024 * 1024 bytes)
      if (file.size > 500 * 1024 * 1024) {
        setAlertMessage('File size must be less than 500MB');
        setShowAlert(true);
        return;
      }

      // Create a progress indicator
      setAlertMessage('Processing file...');
      setShowAlert(true);

      // Process the file in chunks
      const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let processedSubscribers: Subscriber[] = [];
      let headers: string[] = [];
      let emailIndex = -1;
      let nameIndex = -1;
      let isFirstChunk = true;
      let partialLine = '';

      for (let chunk = 0; chunk < totalChunks; chunk++) {
        const start = chunk * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        
        const fileSlice = file.slice(start, end);
        const text = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsText(fileSlice);
        });

        // Combine with partial line from previous chunk
        let lines = (partialLine + text).split('\n');
        
        // Save partial line for next chunk if not the last chunk
        if (chunk < totalChunks - 1) {
          partialLine = lines.pop() || '';
        }

        if (isFirstChunk) {
          // Process headers in first chunk
          headers = lines[0].toLowerCase().split(',');
          emailIndex = headers.findIndex(h => 
            h.includes('email') || h.includes('e-mail') || h.includes('mail')
          );
          nameIndex = headers.findIndex(h => 
            h.includes('name') || h.includes('full name') || h.includes('firstname') || h.includes('lastname')
          );

          if (emailIndex === -1) {
            setAlertMessage('No email column found in CSV');
            setShowAlert(true);
            return;
          }

          lines = lines.slice(1); // Remove header row
          isFirstChunk = false;
        }

        // Process lines in current chunk
        const chunkSubscribers = lines
          .filter(line => line.trim())
          .map((line, index) => {
            const values = line.split(',');
            const email = cleanEmail(values[emailIndex] || '');
            const name = values[nameIndex]?.replace(/['"]/g, '').trim() || 'Unknown';

            if (!isValidEmail(email)) return null;

            return {
              id: Date.now() + processedSubscribers.length + index,
              email,
              name,
              status: 'Active' as const,
              dateAdded: new Date().toISOString().split('T')[0],
              lists: ['Newsletter'],
            };
          })
          .filter((sub): sub is Subscriber => 
            sub !== null && 
            !subscribers.some(existing => existing.email === sub.email) &&
            !processedSubscribers.some(processed => processed.email === sub.email)
          );

        processedSubscribers = [...processedSubscribers, ...chunkSubscribers];

        // Update progress
        setAlertMessage(`Processing: ${Math.round((chunk + 1) / totalChunks * 100)}%`);
      }

      if (processedSubscribers.length === 0) {
        setAlertMessage('No valid subscribers found in CSV');
        setShowAlert(true);
        return;
      }

      // Add subscribers in larger batches (1 million at a time)
      const BATCH_SIZE = 1_000_000;
      for (let i = 0; i < processedSubscribers.length; i += BATCH_SIZE) {
        const batch = processedSubscribers.slice(i, i + BATCH_SIZE);
        addSubscribers(batch);
        
        // Update progress for batch processing
        setAlertMessage(`Adding subscribers: ${Math.min(100, Math.round((i + BATCH_SIZE) / processedSubscribers.length * 100))}%`);
        
        // Small delay to prevent UI lock
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      setAlertMessage(`${processedSubscribers.length} subscribers imported successfully`);
      setShowAlert(true);
    };
    input.click();
  };

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Status', 'Date Added', 'Lists'];
    const csvContent = [
      headers.join(','),
      ...subscribers.map((sub) =>
        [sub.name, sub.email, sub.status, sub.dateAdded, sub.lists.join(';')].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'subscribers.csv';
    link.click();
  };

  const handleAddSubscriber = () => {
    if (!newSubscriber.email || !newSubscriber.name) {
      setAlertMessage('Please fill in all required fields');
      setShowAlert(true);
      return;
    }

    if (!isValidEmail(newSubscriber.email)) {
      setAlertMessage('Please enter a valid email address');
      setShowAlert(true);
      return;
    }

    if (subscribers.some(sub => sub.email === newSubscriber.email)) {
      setAlertMessage('This email is already registered');
      setShowAlert(true);
      return;
    }

    const subscriber: Subscriber = {
      id: Date.now(),
      email: newSubscriber.email,
      name: newSubscriber.name,
      status: 'Active',
      dateAdded: new Date().toISOString().split('T')[0],
      lists: newSubscriber.lists,
    };

    addSubscriber(subscriber);
    setAlertMessage('Subscriber added successfully');
    setShowAlert(true);
    setShowAddModal(false);
    setNewSubscriber({ email: '', name: '', lists: [] });
  };

  const handleEditSubscriber = () => {
    if (!editingSubscriber) return;

    if (!isValidEmail(editingSubscriber.email)) {
      setAlertMessage('Please enter a valid email address');
      setShowAlert(true);
      return;
    }

    updateSubscriber(editingSubscriber.id, editingSubscriber);
    setAlertMessage('Subscriber updated successfully');
    setShowAlert(true);
    setShowEditModal(false);
    setEditingSubscriber(null);
  };

  const handleDeleteSubscriber = (id: number) => {
    removeSubscriber(id);
    setAlertMessage('Subscriber deleted successfully');
    setShowAlert(true);
    setShowActionMenu(null);
  };

  const toggleList = (list: string, target: 'new' | 'edit') => {
    if (target === 'new') {
      setNewSubscriber(prev => ({
        ...prev,
        lists: prev.lists.includes(list)
          ? prev.lists.filter(l => l !== list)
          : [...prev.lists, list],
      }));
    } else if (editingSubscriber) {
      setEditingSubscriber(prev => ({
        ...prev,
        lists: prev.lists.includes(list)
          ? prev.lists.filter(l => l !== list)
          : [...prev.lists, list],
      }));
    }
  };

  const handleActionClick = (subscriber: Subscriber, action: 'edit' | 'delete') => {
    if (action === 'edit') {
      setEditingSubscriber(subscriber);
      setShowEditModal(true);
    } else if (action === 'delete') {
      handleDeleteSubscriber(subscriber.id);
    }
    setShowActionMenu(null);
  };

  return (
    <div className="p-8">
      {/* Alert Component */}
      {showAlert && (
        <div className="fixed top-4 right-4 flex items-center gap-2 rounded-lg bg-gray-800 p-4 text-white shadow-lg">
          <AlertCircle className="h-5 w-5" />
          <p>{alertMessage}</p>
          <button
            onClick={() => setShowAlert(false)}
            className="ml-4 text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Subscribers</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage your email subscribers and lists
          </p>
        </div>
        <div className="space-x-4">
          <button
            onClick={handleExport}
            className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <button
            onClick={handleImport}
            className="inline-flex items-center rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 transition-colors"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Subscriber
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="rounded-lg bg-gray-800 shadow-xl">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button className="inline-flex items-center rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </button>
            </div>
            <div className="text-sm text-gray-400">
              {subscribers.length} total subscribers
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.length === subscribers.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Lists
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={() => handleSelectSubscriber(subscriber.id)}
                        className="rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {subscriber.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          subscriber.status === 'Active'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-gray-700 text-gray-200'
                        }`}
                      >
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {subscriber.lists.map((list) => (
                          <span
                            key={list}
                            className="inline-flex rounded-full bg-gray-700 px-2 text-xs font-medium text-gray-200"
                          >
                            {list}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {subscriber.dateAdded}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button 
                          onClick={() => setShowActionMenu(showActionMenu === subscriber.id ? null : subscriber.id)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {showActionMenu === subscriber.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleActionClick(subscriber, 'edit')}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                              >
                                <Edit2 className="mr-3 h-4 w-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleActionClick(subscriber, 'delete')}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                              >
                                <Trash2 className="mr-3 h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-gray-800 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-100">Add New Subscriber</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newSubscriber.email}
                  onChange={(e) =>
                    setNewSubscriber({ ...newSubscriber, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newSubscriber.name}
                  onChange={(e) =>
                    setNewSubscriber({ ...newSubscriber, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Mailing Lists
                </label>
                <div className="mt-2 space-y-2">
                  {availableLists.map((list) => (
                    <label key={list} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newSubscriber.lists.includes(list)}
                        onChange={() => toggleList(list, 'new')}
                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-200">{list}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubscriber}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Add Subscriber
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subscriber Modal */}
      {showEditModal && editingSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-gray-800 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-100">Edit Subscriber</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSubscriber(null);
                }}
                className="rounded-lg p-1 hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editingSubscriber.email}
                  onChange={(e) =>
                    setEditingSubscriber({ ...editingSubscriber, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingSubscriber.name}
                  onChange={(e) =>
                    setEditingSubscriber({ ...editingSubscriber, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Status
                </label>
                <select
                  value={editingSubscriber.status}
                  onChange={(e) =>
                    setEditingSubscriber({
                      ...editingSubscriber,
                      status: e.target.value as 'Active' | 'Inactive',
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Mailing Lists
                </label>
                <div className="mt-2 space-y-2">
                  {availableLists.map((list) => (
                    <label key={list} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingSubscriber.lists.includes(list)}
                        onChange={() => toggleList(list, 'edit')}
                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-200">{list}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSubscriber(null);
                }}
                className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubscriber}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}