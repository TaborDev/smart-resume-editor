import { JobInfo, ContentScriptMessage } from '@smart-resume/types';

chrome.runtime.onMessage.addListener((message: ContentScriptMessage, sender, sendResponse) => {
  switch (message.type) {
    case 'JOB_DETECTED':
      handleJobDetected(message.data, sender.tab);
      break;
    
    case 'OPEN_SIDE_PANEL':
      handleOpenSidePanel(sender.tab);
      break;
      
    case 'ERROR':
      console.error('Content script error:', message.error);
      break;
  }
});

async function handleJobDetected(jobInfo: JobInfo, tab?: chrome.tabs.Tab) {
  if (!tab?.id) return;

  try {
    // Store job info for later use
    await chrome.storage.local.set({
      [`job_${tab.id}`]: jobInfo
    });

    // Show notification badge
    chrome.action.setBadgeText({
      text: '!',
      tabId: tab.id
    });

    chrome.action.setBadgeBackgroundColor({
      color: '#667eea',
      tabId: tab.id
    });

    console.log('Job detected and stored:', jobInfo);
  } catch (error) {
    console.error('Error handling job detection:', error);
  }
}

async function handleOpenSidePanel(tab?: chrome.tabs.Tab) {
  if (!tab?.id) return;

  try {
    // Open side panel
    await chrome.sidePanel.open({
      tabId: tab.id
    });

    // Set the panel path with job data
    await chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: 'sidebar/index.html',
      enabled: true
    });

    console.log('Side panel opened for tab:', tab.id);
  } catch (error) {
    console.error('Error opening side panel:', error);
  }
}

// Clean up storage when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`job_${tabId}`);
});

// Handle tab updates (URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Clear badge when navigating away from job sites
    const isJobSite = [
      'linkedin.com/jobs',
      'greenhouse.io',
      'lever.co',
      'workday.com',
      'indeed.com/viewjob',
      'glassdoor.com/job-listing'
    ].some(pattern => tab.url?.includes(pattern));

    if (!isJobSite) {
      chrome.action.setBadgeText({
        text: '',
        tabId: tabId
      });
    }
  }
});

console.log('Smart Resume Editor service worker initialized');