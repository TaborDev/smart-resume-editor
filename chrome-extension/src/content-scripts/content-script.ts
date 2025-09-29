// Content script for detecting and interacting with job postings
import { JobDetector } from './job-detector';

// Initialize job detection
const jobDetector = new JobDetector();

// Listen for messages from popup/sidebar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'extractJobData') {
    const jobData = jobDetector.extractJobData();
    sendResponse(jobData);
    return true; // Keep message channel open for async response
  }

  if (message.action === 'detectJobPosting') {
    const isJobPage = jobDetector.detectJobPosting();
    sendResponse({ isJobPage });
    return true;
  }

  if (message.action === 'highlightSkills') {
    jobDetector.highlightSkills(message.skills);
    sendResponse({ success: true });
    return true;
  }
});

// Auto-detect job posting when page loads
document.addEventListener('DOMContentLoaded', () => {
  const isJobPage = jobDetector.detectJobPosting();
  
  if (isJobPage) {
    // Notify background script that we're on a job page
    chrome.runtime.sendMessage({
      action: 'jobPageDetected',
      url: window.location.href
    });
  }
});

// Monitor for dynamic content changes (SPA navigation)
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    
    // Re-check if this is a job page after navigation
    setTimeout(() => {
      const isJobPage = jobDetector.detectJobPosting();
      if (isJobPage) {
        chrome.runtime.sendMessage({
          action: 'jobPageDetected',
          url: window.location.href
        });
      }
    }, 1000); // Wait for content to load
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('Smart Resume Editor content script loaded');