import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';
import { JobAnalysisPanel } from './JobAnalysisPanel';
import { AISuggestionsPanel } from './AISuggestionsPanel';
import { LaTeXEditor } from './LaTeXEditor';

export const SidePanel: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'analysis' | 'suggestions' | 'editor'>('analysis');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    // Get the current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, []);

  const handleTabSwitch = (tab: 'analysis' | 'suggestions' | 'editor') => {
    setCurrentTab(tab);
  };

  return (
    <ErrorBoundary>
      <div className="side-panel">
        <div className="side-panel-header">
          <h1 className="side-panel-title">Smart Resume Editor</h1>
          <div className="tab-buttons">
            <button
              className={`tab-button ${currentTab === 'analysis' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('analysis')}
            >
              Job Analysis
            </button>
            <button
              className={`tab-button ${currentTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('suggestions')}
            >
              AI Suggestions
            </button>
            <button
              className={`tab-button ${currentTab === 'editor' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('editor')}
            >
              LaTeX Editor
            </button>
          </div>
        </div>

        <div className="side-panel-content">
          {isLoading && <LoadingSpinner />}
          
          {!isLoading && (
            <>
              {currentTab === 'analysis' && (
                <JobAnalysisPanel currentUrl={currentUrl} />
              )}
              
              {currentTab === 'suggestions' && (
                <AISuggestionsPanel />
              )}
              
              {currentTab === 'editor' && (
                <LaTeXEditor />
              )}
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};