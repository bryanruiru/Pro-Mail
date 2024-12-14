import React from 'react';
import { X } from 'lucide-react';

interface TemplatePreviewProps {
  template: {
    id: string;
    name: string;
    description: string;
    category: string;
    content: string;
    subject: string;
  };
  onClose: () => void;
  onUse: (template: any) => void;
}

export default function TemplatePreview({ template, onClose, onUse }: TemplatePreviewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-lg bg-gray-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-100">{template.name}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-400">{template.description}</p>
          <span className="mt-2 inline-block rounded-full bg-gray-700 px-2 py-1 text-xs font-medium text-gray-200">
            {template.category}
          </span>
        </div>

        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-300">Subject Line</h4>
          <p className="text-gray-200">{template.subject}</p>
        </div>

        <div className="mb-6">
          <h4 className="mb-2 text-sm font-medium text-gray-300">Preview</h4>
          <div 
            className="max-h-[60vh] overflow-y-auto rounded-lg bg-white p-8"
          >
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: template.content }}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onUse(template)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}