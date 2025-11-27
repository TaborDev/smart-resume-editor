// Background script for the Chrome extension

// Extension installation and update handler
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
  console.log('Message received in background script:', message);
  
  switch (message.action) {
    case 'jobPageDetected':
      if (sender.tab?.id) {
        updateActionIcon(sender.tab);
      }
      break;
      
    case 'openSidePanel':
      if (sender.tab?.id) {
        openSidePanel(sender.tab.id);
      }
      break;
      
    case 'saveResumeData':
      saveResumeData(message.data).then(() => {
        sendResponse({ success: true });
      });
      return true; // Keep message channel open for async response
      
    case 'getResumeData':
      getResumeData(sendResponse);
      return true; // Keep message channel open for async response
      
    case 'analyzeJobMatch':
      analyzeJobMatch(message.jobData, message.resumeData, sendResponse);
      return true; // Keep message channel open for async response
      
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

// Helper Functions

function updateActionIcon(tab: chrome.tabs.Tab): void {
  if (!tab.id) return;
  
  const isJobSite = tab.url ? isJobSiteUrl(tab.url) : false;
  const iconPath = isJobSite 
    ? 'icons/icon-active-48.png' 
    : 'icons/icon-48.png';
    
  chrome.action?.setIcon({
    tabId: tab.id,
    path: iconPath
  });
}

function isJobSiteUrl(url: string): boolean {
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

function openSidePanel(tabId: number): void {
  if (chrome.sidePanel) {
    chrome.sidePanel.setOptions({
      tabId,
      path: 'sidebar/index.html',
      enabled: true
    });
  }
}

function saveResumeData(data: any): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ resumeData: data }, () => {
      console.log('Resume data saved');
      resolve();
    });
  });
}

function getResumeData(sendResponse: (response: any) => void): void {
  chrome.storage.local.get(['resumeData'], (result) => {
    console.log('Retrieved resume data:', result.resumeData || null);
    sendResponse(result.resumeData || null);
  });
}

function analyzeJobMatch(jobData: any, resumeData: any, sendResponse: (response: any) => void): void {
  // Simple job matching logic
  const jobSkills = new Set(
    (jobData.skills || []).map((skill: string) => skill.toLowerCase())
  );
  
  const resumeSkills = new Set(
    (resumeData.skills || []).map((skill: string) => skill.toLowerCase())
  );
  
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];
  
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
  
  const analysis = {
    matchPercentage,
    matchingSkills,
    missingSkills,
    recommendations: generateRecommendations(missingSkills, jobData)
  };
  
  console.log('Job match analysis:', analysis);
  sendResponse(analysis);
}

function generateRecommendations(missingSkills: string[], jobData: any): Array<{
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}> {
  const recommendations = [];
  
  if (missingSkills.length > 0) {
    recommendations.push({
      type: 'skills',
      title: 'Add missing skills to your resume',
      description: `Consider adding these skills to better match the job requirements: ${missingSkills.join(', ')}`,
      priority: 'high' as const
    });
  }
  
  // Add general recommendations
  recommendations.push({
    type: 'general',
    title: 'Tailor your resume',
    description: 'Customize your resume to highlight relevant experience for this role',
    priority: 'medium' as const
  });
  
  // Add more recommendations based on job data
  if (jobData.yearsOfExperience) {
    recommendations.push({
      type: 'experience',
      title: 'Highlight relevant experience',
      description: `The job requires ${jobData.yearsOfExperience} years of experience. Make sure to emphasize your most relevant roles.`,
      priority: 'medium' as const
    });
  }
  
  return recommendations;
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    updateActionIcon,
    isJobSiteUrl,
    openSidePanel,
    saveResumeData,
    getResumeData,
    analyzeJobMatch,
    generateRecommendations
  };
}
