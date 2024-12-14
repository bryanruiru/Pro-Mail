import {
  LayoutDashboard,
  Mail,
  Users,
  FileEdit,
  Workflow,
  BarChart2,
  Link,
  Settings,
  UserCircle,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Campaigns', icon: Mail, href: '/campaigns' },
  { name: 'Subscribers', icon: Users, href: '/subscribers' },
  { name: 'Templates', icon: FileEdit, href: '/templates' },
  { name: 'Automation', icon: Workflow, href: '/automation' },
  { name: 'Analytics', icon: BarChart2, href: '/analytics' },
  { name: 'Integration', icon: Link, href: '/integration' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  return (
    <div className="flex h-screen flex-col justify-between border-r border-gray-800 bg-gray-900">
      <div className="px-4 py-6">
        <span className="grid h-10 place-content-center rounded-lg bg-indigo-600 text-xl font-bold text-white">
          FOC Pro Mail
        </span>

        <ul className="mt-6 space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <RouterLink
                to={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <item.icon className="h-5 w-5 opacity-75" />
                <span className="text-sm font-medium">{item.name}</span>
              </RouterLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-800">
        <div className="flex items-center gap-2 bg-gray-900 p-4 hover:bg-gray-800">
          <UserCircle className="h-10 w-10 text-gray-400" />
          <div>
            <p className="text-xs text-gray-300">
              <strong className="block font-medium">Admin User</strong>
              <span>admin@focdigitalacademy.org</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}