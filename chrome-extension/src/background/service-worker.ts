// Background service worker for Smart Resume Editor Chrome Extension

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

// Tab activation handler - show side panel icon when on job sites
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
      updateActionIcon(tab);
    }
  } catch (error) {
    console.error('Error handling tab activation:', error);
  }
});

// Tab update handler - monitor URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateActionIcon(tab);
  }
});

// Context menu setup
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: 'smart-resume-analyze',
    title: 'Analyze with Smart Resume Editor',
    contexts: ['selection'],
    documentUrlPatterns: [
      '*://www.linkedin.com/jobs/*',
      '*://www.indeed.com/*',
      '*://www.glassdoor.com/*',
      '*://www.monster.com/*'
    ]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'smart-resume-analyze' && tab?.id) {
    // Send selected text to content script for analysis
    chrome.tabs.sendMessage(tab.id, {
      action: 'analyzeSelection',
      selectedText: info.selectionText
    });
  }
});

// Helper functions
function handleJobPageDetected(url: string, tab: chrome.tabs.Tab | undefined) {
  if (!tab?.id) return;
  
  console.log('Job page detected:', url);
  
  // Update action icon to show job detected
  chrome.action.setIcon({
    tabId: tab.id,
    path: {
      '16': 'icons/icon16-active.png',
      '32': 'icons/icon32-active.png',
      '48': 'icons/icon48-active.png',
      '128': 'icons/icon128-active.png'
    }
  });
  
  // Show notification if enabled
  chrome.storage.sync.get(['showNotifications'], (result) => {
    if (result.showNotifications !== false) {
      showJobDetectionNotification(tab.id!);
    }
  });
}

function handleOpenSidePanel(tab: chrome.tabs.Tab | undefined) {
  if (!tab?.id) return;
  
  // Open the side panel for this tab
  chrome.sidePanel.open({ tabId: tab.id });
}

function handleSaveResumeData(data: any) {
  chrome.storage.local.set({ resumeData: data }, () => {
    console.log('Resume data saved');
  });
}

function handleGetResumeData(sendResponse: (response: any) => void) {
  chrome.storage.local.get(['resumeData'], (result) => {
    sendResponse(result.resumeData || null);
  });
}

function handleAnalyzeJobMatch(jobData: any, resumeData: any, sendResponse: (response: any) => void) {
  // Simple job matching algorithm
  const analysis = analyzeJobMatch(jobData, resumeData);
  sendResponse(analysis);
}

function updateActionIcon(tab: chrome.tabs.Tab) {
  if (!tab.id || !tab.url) return;
  
  const isJobSite = isJobSiteUrl(tab.url);
  
  if (isJobSite) {
    chrome.action.setIcon({
      tabId: tab.id,
      path: {
        '16': 'icons/icon16-active.png',
        '32': 'icons/icon32-active.png',
        '48': 'icons/icon48-active.png',
        '128': 'icons/icon128-active.png'
      }
    });
    
    chrome.action.setTitle({
      tabId: tab.id,
      title: 'Smart Resume Editor - Job site detected'
    });
  } else {
    chrome.action.setIcon({
      tabId: tab.id,
      path: {
        '16': 'icons/icon16.png',
        '32': 'icons/icon32.png',
        '48': 'icons/icon48.png',
        '128': 'icons/icon128.png'
      }
    });
    
    chrome.action.setTitle({
      tabId: tab.id,
      title: 'Smart Resume Editor'
    });
  }
}

function isJobSiteUrl(url: string): boolean {
  const jobSites = [
    'linkedin.com/jobs',
    'indeed.com',
    'glassdoor.com',
    'monster.com'
  ];
  
  return jobSites.some(site => url.includes(site));
}

function showJobDetectionNotification(tabId: number) {
  chrome.tabs.sendMessage(tabId, {
    action: 'showNotification',
    notification: {
      title: 'Job Posting Detected',
      message: 'Click to analyze this job posting with Smart Resume Editor',
      type: 'job-detected'
    }
  });
}

function analyzeJobMatch(jobData: any, resumeData: any) {
  if (!jobData || !resumeData) {
    return { score: 0, matches: [], missing: [] };
  }
  
  const jobSkills = jobData.skills || [];
  const resumeSkills = resumeData.skills || [];
  
  const matches = jobSkills.filter((skill: string) => 
    resumeSkills.some((rSkill: string) => 
      rSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  const missing = jobSkills.filter((skill: string) => 
    !resumeSkills.some((rSkill: string) => 
      rSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  const score = jobSkills.length > 0 ? (matches.length / jobSkills.length) * 100 : 0;
  
  return {
    score: Math.round(score),
    matches,
    missing,
    recommendations: generateRecommendations(missing, jobData)
  };
}

function generateRecommendations(missingSkills: string[], jobData: any) {
  const recommendations = [];
  
  if (missingSkills.length > 0) {
    recommendations.push(`Consider adding these skills to your resume: ${missingSkills.slice(0, 5).join(', ')}`);
  }
  
  if (jobData.requirements && jobData.requirements.length > 0) {
    recommendations.push('Tailor your experience section to match the job requirements');
  }
  
  if (jobData.company) {
    recommendations.push(`Research ${jobData.company} and mention relevant company values or achievements in your cover letter`);
  }
  
  return recommendations;
}

// Export for testing
export {
  handleJobPageDetected,
  handleOpenSidePanel,
  analyzeJobMatch,
  isJobSiteUrl
};