import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ResumeEditor } from './ResumeEditor';

export const SidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    // Get the current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, []);

  return (
    <ErrorBoundary>
      <ResumeEditor currentUrl={currentUrl} />
    </ErrorBoundary>
  );
};