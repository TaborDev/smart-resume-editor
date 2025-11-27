// Background script for the Chrome extension

// Listen for installation and update events
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Smart Resume Editor extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
      autoDetectJobs: true,
      highlightSkills: true,
      showNotifications: true,
      resumeTemplates: []
    });
    
    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html')
    });
  } else if (details.reason === 'update') {
    console.log('Smart Resume Editor extension updated');
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'jobPageDetected':
      // Forward to service worker if needed
      break;
      
    case 'openSidePanel':
      // Forward to service worker if needed
      break;
      
    case 'saveResumeData':
      // Forward to service worker if needed
      break;
      
    case 'getResumeData':
      // Forward to service worker if needed
      break;
      
    case 'analyzeJobMatch':
      // Forward to service worker if needed
      break;
      
    default:
      console.log('Unknown message action:', message.action);
  }
});

// Update icon when tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab) {
    // Forward to service worker if needed
  }
});

// Update icon when tab is activated
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab) {
      // Forward to service worker if needed
    }
  });
});
