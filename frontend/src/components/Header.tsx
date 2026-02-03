import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">FOBOH Pricing</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create custom pricing profiles for your customers
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="http://localhost:3001/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              API Docs
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};