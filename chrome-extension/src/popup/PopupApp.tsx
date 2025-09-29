import React from 'react';

export const PopupApp: React.FC = () => {
  const handleOpenEditor = () => {
    // Open the side panel
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      if (tabs[0]?.id) {
        chrome.sidePanel.open({ tabId: tabs[0].id });
      }
    });
  };

  const handleOpenSettings = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h1>Smart Resume Editor</h1>
      </div>
      <div className="popup-content">
        <p>Enhance your resume with AI-powered suggestions and real-time optimization.</p>
        <div className="popup-actions">
          <button 
            className="btn-primary"
            onClick={handleOpenEditor}
          >
            Open Editor
          </button>
          <button 
            className="btn-secondary"
            onClick={handleOpenSettings}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};