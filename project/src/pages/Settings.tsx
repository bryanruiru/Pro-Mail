import React, { useState } from 'react';
import { User, Mail, Shield, Bell, Save } from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  component: React.ComponentType<any>;
}

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    fullName: 'Admin User',
    email: 'admin@focdigitalacademy.org',
    role: 'Administrator',
    timezone: 'Africa/Nairobi',
  });

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-200">Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option>Administrator</option>
          <option>Editor</option>
          <option>Viewer</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">Timezone</label>
        <select
          value={formData.timezone}
          onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York (EST)</option>
        </select>
      </div>
    </div>
  );
};

const EmailSettings = () => {
  const [formData, setFormData] = useState({
    fromName: 'FOC Digital Academy',
    fromEmail: 'noreply@focdigitalacademy.org',
    replyTo: 'support@focdigitalacademy.org',
    signature: '',
  });

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-200">From Name</label>
        <input
          type="text"
          value={formData.fromName}
          onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">From Email</label>
        <input
          type="email"
          value={formData.fromEmail}
          onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">Reply-To Email</label>
        <input
          type="email"
          value={formData.replyTo}
          onChange={(e) => setFormData({ ...formData, replyTo: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">Email Signature</label>
        <textarea
          value={formData.signature}
          onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter your email signature..."
        />
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-200">Current Password</label>
        <input
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">New Password</label>
        <input
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">Confirm New Password</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="twoFactor"
          checked={formData.twoFactor}
          onChange={(e) => setFormData({ ...formData, twoFactor: e.target.checked })}
          className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="twoFactor" className="text-sm font-medium text-gray-200">
          Enable Two-Factor Authentication
        </label>
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    campaignComplete: true,
    newSubscriber: true,
    bounceAlert: true,
    weeklyReport: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-4">
      {Object.entries(notifications).map(([key, value]) => (
        <div key={key} className="flex items-center space-x-3">
          <input
            type="checkbox"
            id={key}
            checked={value}
            onChange={() => toggleNotification(key as keyof typeof notifications)}
            className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor={key} className="text-sm font-medium text-gray-200">
            {key.split(/(?=[A-Z])/).join(' ')}
          </label>
        </div>
      ))}
    </div>
  );
};

const settingsSections: SettingsSection[] = [
  { id: 'account', title: 'Account Settings', component: AccountSettings },
  { id: 'email', title: 'Email Settings', component: EmailSettings },
  { id: 'security', title: 'Security', component: SecuritySettings },
  { id: 'notifications', title: 'Notifications', component: NotificationSettings },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('account');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSave = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const ActiveComponent = settingsSections.find(
    section => section.id === activeSection
  )?.component || AccountSettings;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Settings</h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage your account and application settings
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  activeSection === section.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {section.id === 'account' && <User className="mr-3 h-5 w-5" />}
                {section.id === 'email' && <Mail className="mr-3 h-5 w-5" />}
                {section.id === 'security' && <Shield className="mr-3 h-5 w-5" />}
                {section.id === 'notifications' && <Bell className="mr-3 h-5 w-5" />}
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="col-span-9">
          <div className="rounded-lg bg-gray-800 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-100">
                {settingsSections.find(section => section.id === activeSection)?.title}
              </h2>
            </div>

            <ActiveComponent />

            <div className="mt-6 flex items-center justify-end space-x-4">
              <button
                onClick={handleSave}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </button>

              {showSaveSuccess && (
                <span className="text-sm text-green-400">
                  Settings saved successfully!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}