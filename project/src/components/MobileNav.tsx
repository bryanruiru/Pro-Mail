import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function MobileNav({ isOpen, onToggle, children }: MobileNavProps) {
  return (
    <>
      <button
        onClick={onToggle}
        className="fixed right-4 top-4 z-50 rounded-lg bg-gray-800 p-2 lg:hidden"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-200" />
        ) : (
          <Menu className="h-6 w-6 text-gray-200" />
        )}
      </button>

      <div
        className={`fixed inset-0 z-40 transform bg-gray-900 transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto pt-16">
          {children}
        </div>
      </div>
    </>
  );
}