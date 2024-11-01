import React from 'react';
import { Bell, Settings } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Analytics Platform</h1>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-2 ml-3 text-gray-500 hover:text-gray-700">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}