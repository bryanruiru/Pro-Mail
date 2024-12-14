import React, { useState } from 'react';
import { FileEdit, Plus, Edit2, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { defaultTemplates } from '../utils/emailTemplates';
import TemplatePreview from '../components/TemplatePreview';

export default function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState(defaultTemplates);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'newsletter',
    subject: '',
    content: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.description || !newTemplate.subject || !newTemplate.content) {
      setAlertMessage('Please fill in all required fields');
      setShowAlert(true);
      return;
    }

    const template = {
      id: (templates.length + 1).toString(),
      ...newTemplate
    };

    setTemplates([...templates, template]);
    setAlertMessage('Template created successfully');
    setShowAlert(true);
    setShowCreateModal(false);
    setNewTemplate({ name: '', description: '', category: 'newsletter', subject: '', content: '' });
  };

  const handleEditTemplate = (template: any) => {
    setNewTemplate(template);
    setShowEditModal(template.id);
  };

  const handleUpdateTemplate = () => {
    setTemplates(templates.map(t => 
      t.id === showEditModal ? { ...t, ...newTemplate } : t
    ));
    setAlertMessage('Template updated successfully');
    setShowAlert(true);
    setShowEditModal(null);
    setNewTemplate({ name: '', description: '', category: 'newsletter', subject: '', content: '' });
  };

  const handleUseTemplate = (template: any) => {
    navigate('/campaigns/new', { state: { template } });
  };

  return (
    <div className="p-8">
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

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Email Templates</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage and create email templates
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="relative rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl hover:border-gray-600 transition-colors"
          >
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-100">{template.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{template.description}</p>
            </div>
            <div className="mt-4">
              <span className="inline-flex rounded-full bg-gray-700 px-2 py-1 text-xs font-medium text-gray-200">
                {template.category}
              </span>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                onClick={() => handleEditTemplate(template)}
                className="rounded-lg bg-gray-700 px-3 py-1 text-sm text-gray-200 hover:bg-gray-600"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowPreview(template.id)}
                className="rounded-lg bg-gray-700 px-3 py-1 text-sm text-gray-200 hover:bg-gray-600"
              >
                Preview
              </button>
              <button
                onClick={() => handleUseTemplate(template)}
                className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowCreateModal(true)}
          className="relative flex h-full min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-gray-700 p-12 text-center hover:border-gray-600 transition-colors"
        >
          <div>
            <FileEdit className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-200">
              Create new template
            </span>
          </div>
        </button>
      </div>

      {/* Template Preview Modal */}
      {showPreview && (
        <TemplatePreview
          template={templates.find(t => t.id === showPreview)!}
          onClose={() => setShowPreview(null)}
          onUse={handleUseTemplate}
        />
      )}

      {/* Create/Edit Template Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl rounded-lg bg-gray-800 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-100">
                {showEditModal ? 'Edit Template' : 'Create New Template'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(null);
                  setNewTemplate({ name: '', description: '', category: 'newsletter', subject: '', content: '' });
                }}
                className="rounded-lg p-1 hover:bg-gray-700"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Description
                </label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter template description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Category
                </label>
                <select
                  value={newTemplate.category}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, category: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="newsletter">Newsletter</option>
                  <option value="promotional">Promotional</option>
                  <option value="transactional">Transactional</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="education">Education</option>
                  <option value="events">Events</option>
                  <option value="engagement">Engagement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={newTemplate.subject}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, subject: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter email subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Content
                </label>
                <textarea
                  value={newTemplate.content}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, content: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter HTML content"
                  rows={10}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(null);
                  setNewTemplate({ name: '', description: '', category: 'newsletter', subject: '', content: '' });
                }}
                className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={showEditModal ? handleUpdateTemplate : handleCreateTemplate}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {showEditModal ? 'Update Template' : 'Create Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}