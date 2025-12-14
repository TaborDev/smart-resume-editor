// Background service worker for Smart Resume Editor Chrome Extension

// Helper functions
function handleJobPageDetected(url, tab) {
  if (!tab || !tab.id) return;
  
  // Update the extension icon to show active state
  updateActionIcon(tab);
  
  // Show a notification if enabled
  chrome.storage.sync.get(['showNotifications'], (result) => {
    if (result.showNotifications !== false) { // Default to true if not set
      showJobDetectionNotification(tab.id);
    }
  });
  
  // Send message to content script to handle job page
  chrome.tabs.sendMessage(tab.id, { action: 'handleJobPage', url: url });
}

function handleOpenSidePanel(tab) {
  if (!tab || !tab.id) return;
  
  // Open the side panel for the current tab
  chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidebar/index.html',
    enabled: true
  });
}

function handleSaveResumeData(data) {
  // Save resume data to chrome.storage
  return new Promise((resolve) => {
    chrome.storage.local.set({ resumeData: data }, () => {
      resolve();
    });
  });
}

function handleGetResumeData(sendResponse) {
  // Get resume data from chrome.storage
  chrome.storage.local.get(['resumeData'], (result) => {
    sendResponse(result.resumeData || null);
  });
}

function handleAnalyzeJobMatch(jobData, resumeData, sendResponse) {
  // Analyze job match and send response
  const analysis = analyzeJobMatch(jobData, resumeData);
  sendResponse(analysis);
}

function updateActionIcon(tab) {
  if (!tab || !tab.id) return;
  
  // Update the extension icon based on the current page
  const iconPath = isJobSiteUrl(tab.url || '')
    ? 'icons/icon-active-48.png'
    : 'icons/icon-48.png';
    
  chrome.action.setIcon({
    tabId: tab.id,
    path: iconPath
  });
}

function isJobSiteUrl(url) {
  if (!url) return false;
  
  const jobSites = [
    'linkedin.com/jobs',
    'indeed.com/jobs',
    'glassdoor.com/Job',
    'monster.com/jobs',
    'ziprecruiter.com/jobs'
  ];
  
  return jobSites.some(site => url.includes(site));
}

function showJobDetectionNotification(tabId) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-128.png',
    title: 'Job Detected',
    message: 'Click here to open the resume editor',
    priority: 2
  });
  
  // Handle notification click
  function onNotificationClicked() {
    chrome.sidePanel.setOptions({
      tabId: tabId,
      path: 'sidebar/index.html',
      enabled: true
    });
    chrome.notifications.onClicked.removeListener(onNotificationClicked);
  }
  
  chrome.notifications.onClicked.addListener(onNotificationClicked);
}

function analyzeJobMatch(jobData, resumeData) {
  // Simple job matching logic
  const jobSkills = new Set(
    (jobData.skills || []).map(skill => skill.toLowerCase())
  );
  
  const resumeSkills = new Set(
    (resumeData.skills || []).map(skill => skill.toLowerCase())
  );
  
  const matchingSkills = [];
  const missingSkills = [];
  
  for (const skill of jobSkills) {
    if (resumeSkills.has(skill)) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }
  
  const matchPercentage = jobSkills.size > 0 
    ? Math.round((matchingSkills.length / jobSkills.size) * 100) 
    : 0;
  
  return {
    matchPercentage,
    matchingSkills,
    missingSkills,
    recommendations: generateRecommendations(missingSkills, jobData)
  };
}

function generateRecommendations(missingSkills, jobData) {
  // Generate recommendations based on missing skills
  const recommendations = [];
  
  if (missingSkills.length > 0) {
    recommendations.push({
      type: 'skills',
      title: 'Add missing skills to your resume',
      description: `Consider adding these skills to better match the job requirements: ${missingSkills.join(', ')}`,
      priority: 'high'
    });
  }
  
  // Add general recommendations
  recommendations.push({
    type: 'general',
    title: 'Tailor your resume',
    description: 'Customize your resume to highlight relevant experience for this role',
    priority: 'medium'
  });
  
  return recommendations;
}

// Extension installation and update handlers
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
      handleJobPageDetected(message.url, sender.tab);
      break;
      
    case 'openSidePanel':
      handleOpenSidePanel(sender.tab);
      break;
      
    case 'saveResumeData':
      handleSaveResumeData(message.data);
      break;
      
    case 'getResumeData':
      handleGetResumeData(sendResponse);
      return true; // Keep message channel open
      
    case 'analyzeJobMatch':
      handleAnalyzeJobMatch(message.jobData, message.resumeData, sendResponse);
      return true;
      
    default:
      console.log('Unknown message action:', message.action);
  }
});

// Update icon when tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab) {
    updateActionIcon(tab);
  }
});

// Update icon when tab is activated
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab) {
      updateActionIcon(tab);
    }
  });
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    handleJobPageDetected,
    handleOpenSidePanel,
    handleSaveResumeData,
    handleGetResumeData,
    handleAnalyzeJobMatch
  };
}
