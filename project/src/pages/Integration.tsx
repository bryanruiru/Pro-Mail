import React from 'react';
import { Link2, Plus } from 'lucide-react';

export default function Integration() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect with other services and platforms
          </p>
        </div>
        <button className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400">
          <Link2 className="mx-auto h-12 w-12 text-gray-400" />
          <span className="mt-2 block text-sm font-medium text-gray-900">
            Connect new service
          </span>
        </div>
      </div>
    </div>
  );
}