import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Loading Smart Resume Editor...
        </div>
      </div>
    </div>
  );
};