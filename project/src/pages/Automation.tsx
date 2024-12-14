import React, { useState } from 'react';
import { Workflow, Plus, Play, Pause, Settings as SettingsIcon, Trash2, AlertCircle } from 'lucide-react';

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  triggers: string[];
  subscribers: number;
}

export default function Automation() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', description: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.description) {
      setAlertMessage('Please fill in all fields');
      setShowAlert(true);
      return;
    }

    const workflow: AutomationWorkflow = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      status: 'draft',
      triggers: [],
      subscribers: 0,
    };

    setWorkflows([...workflows, workflow]);
    setNewWorkflow({ name: '', description: '' });
    setShowCreateModal(false);
    setAlertMessage('Workflow created successfully');
    setShowAlert(true);
  };

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(workflows.map(workflow => {
      if (workflow.id === id) {
        const newStatus = workflow.status === 'active' ? 'paused' : 'active';
        return { ...workflow, status: newStatus };
      }
      return workflow;
    }));
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(workflow => workflow.id !== id));
    setAlertMessage('Workflow deleted successfully');
    setShowAlert(true);
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
          <h1 className="text-2xl font-bold text-gray-100">Automation</h1>
          <p className="mt-1 text-sm text-gray-400">
            Create and manage email automation workflows
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-100">{workflow.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{workflow.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleWorkflowStatus(workflow.id)}
                  className={`rounded-lg p-2 ${
                    workflow.status === 'active'
                      ? 'bg-green-900 text-green-200 hover:bg-green-800'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {workflow.status === 'active' ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <button className="rounded-lg bg-gray-700 p-2 text-gray-300 hover:bg-gray-600">
                  <SettingsIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteWorkflow(workflow.id)}
                  className="rounded-lg bg-gray-700 p-2 text-gray-300 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    workflow.status === 'active'
                      ? 'bg-green-900 text-green-200'
                      : workflow.status === 'paused'
                      ? 'bg-yellow-900 text-yellow-200'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Triggers</span>
                <span className="text-gray-200">{workflow.triggers.join(', ') || 'None'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Active Subscribers</span>
                <span className="text-gray-200">{workflow.subscribers}</span>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowCreateModal(true)}
          className="relative flex h-full min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-800 p-12 text-center hover:border-gray-600"
        >
          <div>
            <Workflow className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-200">
              Create new workflow
            </span>
          </div>
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-gray-800 p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-100">Create New Workflow</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter workflow name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Description
                </label>
                <textarea
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter workflow description"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkflow}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Create Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}