import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ResumeEditor } from './ResumeEditor';

export const SidePanel: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [jobTabId, setJobTabId] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Check for jobUrl and jobTabId in query params
    const params = new URLSearchParams(window.location.search);
    const jobUrlParam = params.get('jobUrl');
    const jobTabIdParam = params.get('jobTabId');

    if (jobUrlParam) {
      setCurrentUrl(jobUrlParam);
    }
    
    if (jobTabIdParam) {
      setJobTabId(parseInt(jobTabIdParam, 10));
    }

    // Fallback to active tab if no params (e.g. opened directly)
    if (!jobUrlParam) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          setCurrentUrl(tabs[0].url);
        }
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <ResumeEditor currentUrl={currentUrl} jobTabId={jobTabId} />
    </ErrorBoundary>
  );
};