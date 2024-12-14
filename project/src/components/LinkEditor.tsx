import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LinkEditorProps {
  onSave: (url: string, text: string) => void;
  onClose: () => void;
  initialUrl?: string;
  initialText?: string;
}

export default function LinkEditor({ onSave, onClose, initialUrl = '', initialText = '' }: LinkEditorProps) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);

  const handleSave = () => {
    if (url) {
      onSave(url, text);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-100">Insert Link</h3>
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
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Link Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter link text"
            />
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
            onClick={handleSave}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Insert Link
          </button>
        </div>
      </div>
    </div>
  );
}