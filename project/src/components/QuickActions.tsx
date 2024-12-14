import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  FileUp,
  BarChart2,
  Mail,
  FileEdit,
  Settings,
} from 'lucide-react';

const actions = [
  {
    name: 'Add Subscriber',
    description: 'Add a new contact to your list',
    icon: UserPlus,
    color: 'bg-pink-500',
    path: '/subscribers',
    action: 'add',
  },
  {
    name: 'Import List',
    description: 'Import contacts via CSV',
    icon: FileUp,
    color: 'bg-purple-500',
    path: '/subscribers',
    action: 'import',
  },
  {
    name: 'View Reports',
    description: 'Check campaign performance',
    icon: BarChart2,
    color: 'bg-yellow-500',
    path: '/analytics',
  },
  {
    name: 'New Campaign',
    description: 'Create an email campaign',
    icon: Mail,
    color: 'bg-green-500',
    path: '/campaigns',
    action: 'new',
  },
  {
    name: 'Templates',
    description: 'Manage email templates',
    icon: FileEdit,
    color: 'bg-blue-500',
    path: '/templates',
  },
  {
    name: 'Settings',
    description: 'Configure your account',
    icon: Settings,
    color: 'bg-gray-500',
    path: '/settings',
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  const handleAction = (action: any) => {
    if (action.action === 'import') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const csvData = event.target?.result;
            console.log('Importing CSV:', csvData);
            navigate('/subscribers');
          };
          reader.readAsText(file);
        }
      };
      input.click();
    } else if (action.action === 'add') {
      navigate('/subscribers?action=add');
    } else if (action.action === 'new') {
      navigate('/campaigns/new');
    } else {
      navigate(action.path);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-gray-800 shadow-xl">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-100">Quick Actions</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <button
              key={action.name}
              onClick={() => handleAction(action)}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-700 bg-gray-900 px-6 py-5 shadow-sm hover:border-gray-600 hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${action.color}`}
              >
                <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-200">
                  {action.name}
                </p>
                <p className="truncate text-sm text-gray-400">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}