import React, { useState } from 'react';
import { X, Trash2, Edit2 } from 'lucide-react';
import { mailingListStore } from '../stores/mailingListStore';

interface RecipientModalProps {
  onClose: () => void;
  onSelect: (listId: string) => void;
}

export default function RecipientModal({ onClose, onSelect }: RecipientModalProps) {
  const { lists, deleteList } = mailingListStore();
  const [editingList, setEditingList] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this list?')) {
      deleteList(id);
    }
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const list = lists.find(l => l.id === id);
    if (list) {
      setEditForm({ name: list.name, description: list.description });
      setEditingList(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-100">Select Recipients</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-2">
          {lists.length === 0 ? (
            <p className="text-center text-gray-400">No mailing lists available</p>
          ) : (
            lists.map((list) => (
              <div key={list.id}>
                {editingList === list.id ? (
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="mb-2 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
                      placeholder="List name"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="mb-2 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingList(null)}
                        className="rounded-lg bg-gray-700 px-3 py-1 text-sm text-gray-200 hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Update list logic here
                          setEditingList(null);
                        }}
                        className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelect(list.id)}
                    className="group relative w-full rounded-lg border border-gray-700 bg-gray-900 p-4 text-left hover:bg-gray-850 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-200">{list.name}</p>
                        <p className="text-sm text-gray-400">{list.subscriberCount} subscribers</p>
                        <p className="mt-1 text-xs text-gray-500">{list.description}</p>
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleEdit(list.id, e)}
                          className="rounded-lg bg-gray-700 p-2 text-gray-300 hover:bg-gray-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(list.id, e)}
                          className="rounded-lg bg-gray-700 p-2 text-gray-300 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}