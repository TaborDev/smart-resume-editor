import React from 'react';

export const PopupApp: React.FC = () => {
  const handleOpenEditor = () => {
    // Send message to content script to open the overlay on the current page
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs: chrome.tabs.Tab[]) => {
      const currentTab = tabs[0];
      if (currentTab?.id) {
        try {
          // First, try to inject the content script (in case it's not loaded)
          await chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['content-script.js']
          });
        } catch (e) {
          // Script might already be injected, that's fine
          console.log('Content script may already be injected');
        }

        // Now send the message to open overlay
        setTimeout(() => {
          chrome.tabs.sendMessage(currentTab.id!, { action: 'openOverlay' }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Failed to open overlay:', chrome.runtime.lastError);
              alert('Please refresh the page and try again.');
            } else {
              // Close the popup after opening the overlay
              window.close();
            }
          });
        }, 100);
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